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

    await redis.hset(`meta:${roomId}`, {
      connected: [],
      createdAt: Date.now(),
    });

    await redis.expire(`meta:${roomId}`, ROOM_TTL_SECONDS);

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
      await realtime
        .channel(auth.roomId)
        .emit('chat.destroy', { isDestroy: true });

      await Promise.all([
        redis.del(auth.roomId),
        redis.del(`meta:${auth.roomId}`),
        redis.del(`messages:${auth.roomId}`),
        redis.del(`keys:${auth.roomId}`),
        redis.del(`kyber:${auth.roomId}`),
      ]);
    },
    {
      query: z.object({ roomId: z.string() }),
    }
  )
  // ============ HYBRID KEY EXCHANGE (ECDH + KYBER) ============

  // POST /room/keys - Envoyer ses cles publiques hybrides
  .post(
    '/keys',
    async ({ body, auth }) => {
      const { ecdhPublicKey, kyberPublicKey, dsaPublicKey } = body;

      console.log(`📥 [${auth.token.slice(0, 8)}] Storing public keys for room ${auth.roomId}`);

      // Stocker les cles publiques dans Redis
      // Format: keys:roomId = { "token-alice": { ecdh: "...", kyber: "...", dsa: "..." }, ... }
      await redis.hset(`keys:${auth.roomId}`, {
        [auth.token]: JSON.stringify({
          ecdh: ecdhPublicKey,
          kyber: kyberPublicKey,
          dsa: dsaPublicKey,
        }),
      });

      // Synchroniser le TTL avec la room
      const remaining = await redis.ttl(`meta:${auth.roomId}`);
      await redis.expire(`keys:${auth.roomId}`, remaining);

      console.log(`✅ [${auth.token.slice(0, 8)}] Keys stored successfully`);

      // Notifier l'autre user via realtime
      await realtime.channel(auth.roomId).emit('chat.keyExchange', {
        ecdh: ecdhPublicKey,
        kyber: kyberPublicKey,
      });

      return { success: true };
    },
    {
      query: z.object({ roomId: z.string() }),
      body: z.object({
        ecdhPublicKey: z.string(),
        kyberPublicKey: z.string(),
        dsaPublicKey: z.string().optional(),
      }),
    }
  )
  // GET /room/keys - Recuperer les cles publiques de l'autre user
  .get(
    '/keys',
    async ({ auth }) => {
      const keys = await redis.hgetall<Record<string, string>>(
        `keys:${auth.roomId}`
      );

      console.log(`🔍 [${auth.token.slice(0, 8)}] Fetching keys for room ${auth.roomId}`);
      console.log(`   Keys in Redis:`, keys ? Object.keys(keys).map(k => k.slice(0, 8)) : 'none');

      if (!keys) {
        console.log(`   ❌ No keys found in Redis`);
        return { ecdh: null, kyber: null, kyberCiphertext: null, shouldBeInitiator: false };
      }

      // Trouver les cles de l'autre user
      const otherKeyEntry = Object.entries(keys).find(
        ([token]) => token !== auth.token
      );

      if (!otherKeyEntry) {
        console.log(`   ❌ No other user's keys found (only my own)`);
        return { ecdh: null, kyber: null, kyberCiphertext: null, shouldBeInitiator: false };
      }

      // Parser les cles (avec fallback pour ancien format)
      let otherKeys: { ecdh?: string; kyber?: string };
      const rawData = otherKeyEntry[1];
      console.log(`   📄 Raw data type:`, typeof rawData, rawData);
      
      try {
        // Si c'est deja un objet (Redis peut auto-parser), on l'utilise directement
        if (typeof rawData === 'object' && rawData !== null) {
          otherKeys = rawData as { ecdh?: string; kyber?: string };
          console.log(`   ✅ Using object directly:`, otherKeys);
        } else {
          // Sinon, on parse le JSON
          otherKeys = JSON.parse(rawData);
          console.log(`   ✅ Parsed JSON:`, otherKeys);
        }
      } catch {
        // Ancien format: juste une string (cle ECDH seule)
        otherKeys = { ecdh: rawData as string, kyber: undefined };
        console.log(`   ⚠️  Using legacy format`);
      }

      // Verifier s'il y a un ciphertext Kyber pour moi
      const kyberData = await redis.hgetall<Record<string, string>>(
        `kyber:${auth.roomId}`
      );
      console.log(`   🔑 Kyber data in Redis:`, kyberData ? Object.keys(kyberData).map(k => k.slice(0, 8)) : 'none');
      const kyberCiphertext = kyberData?.[auth.token] || null;
      console.log(`   ${kyberCiphertext ? '✅' : '❌'} Kyber ciphertext for me:`, kyberCiphertext ? 'YES' : 'NO');

      // Determiner de facon deterministe qui est l'initiateur
      // Le token lexicographiquement le plus petit est l'initiateur
      const otherToken = otherKeyEntry[0];
      const shouldBeInitiator = auth.token < otherToken;
      console.log(`   🎯 Role: ${shouldBeInitiator ? 'INITIATOR' : 'RESPONDER'}`);

      return {
        ecdh: otherKeys.ecdh || null,
        kyber: otherKeys.kyber || null,
        dsa: (otherKeys as { ecdh?: string; kyber?: string; dsa?: string }).dsa || null,
        kyberCiphertext,
        shouldBeInitiator,
      };
    },
    {
      query: z.object({ roomId: z.string() }),
    }
  )
  // POST /room/kyber - Envoyer le ciphertext Kyber (initiateur -> destinataire)
  .post(
    '/kyber',
    async ({ body, auth }) => {
      const { kyberCiphertext } = body;

      // Recuperer le token de l'autre user
      const keys = await redis.hgetall<Record<string, string>>(
        `keys:${auth.roomId}`
      );

      if (!keys) {
        throw new Error('No keys found for this room');
      }

      const otherToken = Object.keys(keys).find(
        (token) => token !== auth.token
      );

      if (!otherToken) {
        throw new Error('Other user not found');
      }

      // Stocker le ciphertext pour l'autre user
      await redis.hset(`kyber:${auth.roomId}`, {
        [otherToken]: kyberCiphertext,
      });

      // Synchroniser le TTL
      const remaining = await redis.ttl(`meta:${auth.roomId}`);
      await redis.expire(`kyber:${auth.roomId}`, remaining);

      // Notifier l'autre user
      await realtime.channel(auth.roomId).emit('chat.kyberCiphertext', {
        kyberCiphertext,
      });

      return { success: true };
    },
    {
      query: z.object({ roomId: z.string() }),
      body: z.object({
        kyberCiphertext: z.string(),
      }),
    }
  )
  // GET /room/kyber - Recuperer le ciphertext Kyber (pour le destinataire)
  .get(
    '/kyber',
    async ({ auth }) => {
      const kyberData = await redis.hgetall<Record<string, string>>(
        `kyber:${auth.roomId}`
      );

      const kyberCiphertext = kyberData?.[auth.token] || null;

      return { kyberCiphertext };
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
      const { sender, text, signature, messageType, imageMetadata } = body;

      const { roomId } = auth;

      const roomExist = await redis.exists(`meta:${roomId}`);
      if (!roomExist) {
        throw new Error('Room does not exist');
      }

      const message: Message = {
        id: nanoid(),
        sender,
        text,
        signature,
        timestamp: Date.now(),
        roomId,
        messageType: messageType || 'text',
        imageMetadata,
      };

      await redis.rpush(`messages:${roomId}`, {
        ...message,
        token: auth.token,
      });

      await realtime.channel(roomId).emit('chat.messageSchema', message);

      const remaining = await redis.ttl(`meta:${roomId}`);
      await redis.expire(`messages:${roomId}`, remaining);
      await redis.expire(roomId, remaining);
    },
    {
      query: z.object({ roomId: z.string() }),
      body: z.object({
        sender: z.string().max(100),
        text: z.string().max(5000000), // Augmente pour les images en base64 chiffrees
        signature: z.string().optional(), // Signature ML-DSA (base64)
        messageType: z.enum(['text', 'image']).optional(),
        imageMetadata: z.object({
          mimeType: z.string(),
          width: z.number(),
          height: z.number(),
        }).optional(),
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

export type App = typeof app;

export const GET = app.fetch;
export const POST = app.fetch;
export const DELETE = app.fetch;
