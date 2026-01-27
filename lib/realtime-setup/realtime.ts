import { InferRealtimeEvents, Realtime } from '@upstash/realtime';
import z from 'zod/v4';
import { redis } from '../redis-setup/redis';

const messageSchema = z.object({
  id: z.string(),
  sender: z.string().max(100),
  text: z.string().max(5000000), // Augmente pour les images en base64 chiffrees
  timestamp: z.number(),
  roomId: z.string(),
  token: z.string().optional(),
  // Type de message: "text" ou "image"
  messageType: z.enum(['text', 'image']).optional(),
  // Metadata image (si messageType === "image")
  imageMetadata: z.object({
    mimeType: z.string(),
    width: z.number(),
    height: z.number(),
  }).optional(),
});

const schema = {
  chat: {
    messageSchema,
    destroy: z.object({
      isDestroy: z.literal(true),
    }),
    // Evenement pour l'echange de cles hybrides E2E (ECDH + Kyber)
    keyExchange: z.object({
      ecdh: z.string(), // Cle publique ECDH en base64
      kyber: z.string(), // Cle publique Kyber en base64
    }),
    // Evenement pour le ciphertext Kyber (initiateur -> destinataire)
    kyberCiphertext: z.object({
      kyberCiphertext: z.string(), // Ciphertext Kyber en base64
    }),
  },
};

export const realtime = new Realtime({ schema, redis });

export type RealtimeEvents = InferRealtimeEvents<typeof realtime>;

export type Message = z.infer<typeof messageSchema>;
