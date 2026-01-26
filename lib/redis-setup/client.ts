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

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export const client = treaty<App>(API_URL).api;
