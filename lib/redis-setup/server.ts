import { treaty } from '@elysiajs/eden';
import { app } from '../../app/api/[[...slugs]]/route';

/**
 * Eden Treaty server pour Server Components et Server Actions
 *
 * ✅ Importe l'instance Elysia réelle
 * ✅ Appels directs sans passer par HTTP (plus rapide)
 * ✅ Peut accéder à Redis et autres ressources serveur
 *
 * ⚠️ N'utilisez JAMAIS ce fichier dans un Client Component !
 *
 * Usage:
 * - Server Components (async function Page())
 * - Server Actions ('use server')
 * - API routes
 *
 * Exemple:
 * ```tsx
 * // app/dashboard/page.tsx (Server Component)
 * import { server } from '@/lib/server'
 *
 * export default async function Dashboard() {
 *   const data = await server.user.get()
 *   return <div>{data}</div>
 * }
 * ```
 */
export const server = treaty(app).api;
