import { InferRealtimeEvents, Realtime } from '@upstash/realtime';
import z from 'zod/v4';
import { redis } from '../redis-setup/redis';

const messageSchema = z.object({
  id: z.string(),
  sender: z.string().max(100),
  text: z.string().max(1000),
  timestamp: z.number(),
  roomId: z.string(),
  //qui envoit le message
  token: z.string().optional(),
});

//Il faut deux evenements pour faire du chat afin de prévenir les clients connectés

//1) notification d'un nouveau message
//2) notification de la destruction du chat (quand la room expire)

const schema = {
  chat: {
    messageSchema,
    destroy: z.object({
      isDestroy: z.literal(true),
    }),
    // Événement pour l'échange de clés E2E
    keyExchange: z.object({
      publicKey: z.string(), // Clé publique en base64
    }),
  },
};

export const realtime = new Realtime({ schema, redis });

//le type de nos evenements realtime pour le client side
export type RealtimeEvents = InferRealtimeEvents<typeof realtime>;

export type Message = z.infer<typeof messageSchema>;
