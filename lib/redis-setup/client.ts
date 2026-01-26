import { treaty } from '@elysiajs/eden';
import type { App } from '../../app/api/[[...slugs]]/route';

/**
 * Eden Treaty client pour React Query et Client Components
 *
 * ⚠️ Utilise uniquement le type (pas l'instance) pour éviter d'importer le code serveur
 * Les appels passent par HTTP (fetch)
 *
 * Usage:
 * - Client Components avec React Query (useQuery, useMutation)
 * - 'use client' components
 */
export const client = treaty<App>('localhost:3000').api;
