//fichier central, toutes les requetes api vont d'abord passer par ce fichier

import { Message, realtime } from '@/lib/realtime-setup/realtime';
import { redis } from '@/lib/redis-setup/redis';
import { Elysia } from 'elysia';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import { authMiddleware } from './auth';

const ROOM_TTL_SECONDS = 60 * 10;

// MES ROUTES POUR CE PROJET

// I) ROOMS
const rooms = new Elysia({ prefix: '/room' })
  .post('/create', async () => {
    const roomId = nanoid();

    //on met l'id de la room dans la bdd redis
    //`meta:${roomId}` est le nom de la boite
    //le deuxieme argument à savoir { connected: [],createdAt: Date.now(),} est le contenu de la boite
    await redis.hset(`meta:${roomId}`, {
      connected: [],
      createdAt: Date.now(),
    });

    //auto-destruction de la room
    await redis.expire(`meta:${roomId}`, ROOM_TTL_SECONDS);

    //pas de besoin de json ici par comme next js avec nextresponse
    return { roomId };
  })
  .use(authMiddleware)
  .get(
    '/ttl',
    async ({ auth }) => {
      const ttl = await redis.ttl(`meta:${auth.roomId}`);
      return { ttl: ttl > 0 ? ttl : 0 };
    },
    { query: z.object({ roomId: z.string() }) }
  )
  .delete(
    '/',
    async ({ auth }) => {
      // Notifie tout le monde que la room est détruite
      //toujours le realtime en premier lors de la suppression d'une room
      await realtime
        .channel(auth.roomId)
        .emit('chat.destroy', { isDestroy: true });

      await Promise.all([
        //destruction des données de la room dans redis, suppression des metadata
        redis.del(auth.roomId),
        //destruction de la room
        redis.del(`meta:${auth.roomId}`),
        //destruction des messages associés a la room
        redis.del(`messages:${auth.roomId}`),
        //destruction des clés publiques E2E
        redis.del(`keys:${auth.roomId}`),
      ]);
    },
    {
      query: z.object({ roomId: z.string() }),
    }
  )
  // POST /room/keys - Envoyer sa clé publique pour l'échange E2E
  .post(
    '/keys',
    async ({ body, auth }) => {
      const { publicKey } = body;

      // Stocker ma clé publique dans Redis (hash avec mon token comme clé)
      // keys:ABC123 = { "token-alice": "AAA...", "token-bob": "BBB..." }
      await redis.hset(`keys:${auth.roomId}`, {
        [auth.token]: publicKey,
      });

      // Synchroniser le TTL avec la room (pour que les clés expirent en même temps)
      const remaining = await redis.ttl(`meta:${auth.roomId}`);
      await redis.expire(`keys:${auth.roomId}`, remaining);

      // Notifier l'autre user via realtime qu'une nouvelle clé est disponible
      await realtime
        .channel(auth.roomId)
        .emit('chat.keyExchange', { publicKey });

      return { success: true };
    },
    {
      query: z.object({ roomId: z.string() }),
      body: z.object({ publicKey: z.string() }),
    }
  )
  // GET /room/keys - Récupérer la clé publique de l'autre user
  .get(
    '/keys',
    async ({ auth }) => {
      // Récupérer toutes les clés publiques de la room
      const keys = await redis.hgetall<Record<string, string>>(
        `keys:${auth.roomId}`
      );

      // Si pas de clés stockées
      if (!keys) {
        return { otherPublicKey: null };
      }

      // Trouver la clé de l'autre user (celle qui n'est PAS la mienne)
      const otherKey = Object.entries(keys).find(
        ([token]) => token !== auth.token
      );

      return {
        otherPublicKey: otherKey ? otherKey[1] : null,
      };
    },
    {
      query: z.object({ roomId: z.string() }),
    }
  );

// II) SEND MESSAGES
const messages = new Elysia({ prefix: '/messages' })
  .use(authMiddleware)
  .post(
    '/',
    async ({ body, auth }) => {
      const { sender, text } = body;

      const { roomId } = auth;

      const roomExist = await redis.exists(`meta:${roomId}`);
      if (!roomExist) {
        throw new Error('Room does not exist');
      }

      const message: Message = {
        id: nanoid(),
        sender,
        text,
        timestamp: Date.now(),
        roomId,
      };

      //add message to history
      //quand un message arrive il est stocker dans le arraydes messages a droite de la liste en dernier d'ou le rpush
      //on ajoute un objet js dans la room
      await redis.rpush(`messages:${roomId}`, {
        ...message,
        token: auth.token,
      });

      //le message va etre emmit a tous les clients connectés a cette room via upstash realtime
      await realtime.channel(roomId).emit('chat.messageSchema', message);

      //housekeeping force the expiration session of the room
      //ttl est un concept de redis c'est le time to leave
      const remaining = await redis.ttl(`meta:${roomId}`);
      await redis.expire(`messages:${roomId}`, remaining);
      await redis.expire(roomId, remaining);
    },
    {
      //utiliser query c'est comme faire une route /api/test?id
      //la c'est en fait un post vers /api/messages?roomId
      // ?id est un substitut pour ne pas utiliser une route classique /api/test/id
      query: z.object({ roomId: z.string() }),
      body: z.object({
        sender: z.string().max(100),
        text: z.string().max(1000),
      }),
    }
  )
  .get(
    '/',
    async ({ auth }) => {
      const messages = await redis.lrange<Message>(
        `messages:${auth.roomId}`,
        0,
        -1
      );

      return {
        messages: messages.map((m) => ({
          ...m,
          token: m.token === auth.token ? auth.token : undefined,
        })),
      };
    },
    {
      query: z.object({
        roomId: z.string(),
      }),
    }
  );

export const app = new Elysia({ prefix: '/api' }).use(rooms).use(messages);

//le type de toute notre api grace a Eden
export type App = typeof app;

export const GET = app.fetch;
export const POST = app.fetch;
export const DELETE = app.fetch;
