import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://phantomchat.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',      // Routes API
          '/room/',     // Rooms de chat (privé et éphémère)
          '/_next/',    // Fichiers Next.js internes
          '/create',    // Page de création (pas utile pour SEO)
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
