import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Politique de Cookies - Phantom Chat',
  description:
    'Politique de cookies de Phantom Chat. Un seul cookie technique, strictement nécessaire au fonctionnement du service.',
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <h1 className="mb-4 font-mono text-4xl font-bold text-green-400 md:text-5xl">
            <span className="text-green-600">{'>'}</span> COOKIE_POLICY
          </h1>
          <p className="text-lg text-zinc-400">
            Politique de cookies conforme au RGPD et à la directive ePrivacy
          </p>
        </header>

        {/* Résumé */}
        <section
          className="mb-8 border border-green-500/30 bg-green-500/5 p-6"
          aria-labelledby="summary-heading"
        >
          <h2
            id="summary-heading"
            className="mb-4 font-mono text-xl font-bold text-green-400"
          >
            <span className="text-green-600">$</span> TL;DR
          </h2>
          <ul className="space-y-2 font-mono text-sm text-zinc-300">
            <li className="flex items-start">
              <span className="mr-2 text-green-400">[+]</span>
              <span>Un seul cookie : <code className="text-amber-400">x-auth-token</code></span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-green-400">[+]</span>
              <span>Cookie technique strictement nécessaire (pas de consentement requis)</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-green-400">[+]</span>
              <span>Aucun cookie de tracking, analytics ou publicité</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-green-400">[+]</span>
              <span>Supprimé automatiquement à la fermeture du navigateur</span>
            </li>
          </ul>
        </section>

        {/* Qu'est-ce qu'un cookie */}
        <section className="mb-8" aria-labelledby="what-heading">
          <h2
            id="what-heading"
            className="mb-4 font-mono text-xl font-bold text-green-400"
          >
            <span className="text-green-600">{'>'}</span> QU&apos;EST-CE_QU&apos;UN_COOKIE
          </h2>
          <div className="border border-zinc-800 bg-zinc-900/50 p-6">
            <p className="text-zinc-400">
              Un cookie est un petit fichier texte stocké sur votre appareil par votre navigateur.
              Il permet aux sites web de mémoriser des informations entre les pages ou les visites.
              Les cookies peuvent être &quot;de session&quot; (supprimés à la fermeture du navigateur)
              ou &quot;persistants&quot; (conservés pendant une durée définie).
            </p>
          </div>
        </section>

        {/* Cookies utilisés */}
        <section className="mb-8" aria-labelledby="cookies-heading">
          <h2
            id="cookies-heading"
            className="mb-4 font-mono text-xl font-bold text-green-400"
          >
            <span className="text-green-600">{'>'}</span> COOKIES_UTILISÉS
          </h2>
          <div className="border border-zinc-800 bg-zinc-900/50 p-6">
            <p className="mb-4 text-zinc-400">
              Phantom Chat utilise un unique cookie technique :
            </p>
            <div className="overflow-x-auto">
              <table className="w-full font-mono text-sm">
                <thead>
                  <tr className="border-b border-zinc-700 text-left">
                    <th className="py-2 pr-4 text-green-400">Nom</th>
                    <th className="py-2 pr-4 text-green-400">Type</th>
                    <th className="py-2 pr-4 text-green-400">Durée</th>
                    <th className="py-2 text-green-400">Finalité</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-zinc-800">
                    <td className="py-3 pr-4 text-amber-400">x-auth-token</td>
                    <td className="py-3 pr-4 text-zinc-400">Technique</td>
                    <td className="py-3 pr-4 text-zinc-400">Session</td>
                    <td className="py-3 text-zinc-400">
                      Identifie votre session dans une room de chat
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Détail du cookie */}
        <section className="mb-8" aria-labelledby="detail-heading">
          <h2
            id="detail-heading"
            className="mb-4 font-mono text-xl font-bold text-green-400"
          >
            <span className="text-green-600">{'>'}</span> DÉTAIL_TECHNIQUE
          </h2>
          <div className="border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="space-y-2 font-mono text-sm">
              <div className="flex border-l-2 border-green-500/50 bg-black/30 p-3">
                <span className="w-32 text-zinc-500">Nom :</span>
                <span className="text-amber-400">x-auth-token</span>
              </div>
              <div className="flex border-l-2 border-green-500/50 bg-black/30 p-3">
                <span className="w-32 text-zinc-500">Valeur :</span>
                <span className="text-zinc-300">Token aléatoire (nanoid)</span>
              </div>
              <div className="flex border-l-2 border-green-500/50 bg-black/30 p-3">
                <span className="w-32 text-zinc-500">HttpOnly :</span>
                <span className="text-green-400">Oui</span>
                <span className="ml-2 text-zinc-500">(inaccessible au JavaScript)</span>
              </div>
              <div className="flex border-l-2 border-green-500/50 bg-black/30 p-3">
                <span className="w-32 text-zinc-500">Secure :</span>
                <span className="text-green-400">Oui</span>
                <span className="ml-2 text-zinc-500">(HTTPS uniquement en prod)</span>
              </div>
              <div className="flex border-l-2 border-green-500/50 bg-black/30 p-3">
                <span className="w-32 text-zinc-500">SameSite :</span>
                <span className="text-green-400">Strict</span>
                <span className="ml-2 text-zinc-500">(protection CSRF)</span>
              </div>
              <div className="flex border-l-2 border-green-500/50 bg-black/30 p-3">
                <span className="w-32 text-zinc-500">Path :</span>
                <span className="text-zinc-300">/</span>
              </div>
            </div>
          </div>
        </section>

        {/* Pourquoi ce cookie */}
        <section className="mb-8" aria-labelledby="why-heading">
          <h2
            id="why-heading"
            className="mb-4 font-mono text-xl font-bold text-green-400"
          >
            <span className="text-green-600">{'>'}</span> POURQUOI_CE_COOKIE
          </h2>
          <div className="border border-zinc-800 bg-zinc-900/50 p-6">
            <p className="mb-4 text-zinc-400">
              Le cookie <code className="text-amber-400">x-auth-token</code> est indispensable pour :
            </p>
            <ul className="ml-4 list-disc space-y-2 text-zinc-400">
              <li>
                <strong className="text-zinc-200">Identifier votre session :</strong> Savoir que vous
                êtes un participant autorisé de la room
              </li>
              <li>
                <strong className="text-zinc-200">Limiter l&apos;accès :</strong> Empêcher un 3ème
                utilisateur de rejoindre une room à 2 personnes
              </li>
              <li>
                <strong className="text-zinc-200">Sécuriser les échanges :</strong> S&apos;assurer que
                seuls les participants légitimes peuvent envoyer des messages
              </li>
            </ul>
            <p className="mt-4 text-sm text-zinc-500">
              Sans ce cookie, le service ne peut pas fonctionner.
            </p>
          </div>
        </section>

        {/* Pas de consentement */}
        <section className="mb-8" aria-labelledby="consent-heading">
          <h2
            id="consent-heading"
            className="mb-4 font-mono text-xl font-bold text-green-400"
          >
            <span className="text-green-600">{'>'}</span> EXEMPTION_DE_CONSENTEMENT
          </h2>
          <div className="border border-zinc-800 bg-zinc-900/50 p-6">
            <p className="text-zinc-400">
              Conformément à l&apos;article 82 de la loi Informatique et Libertés et aux
              lignes directrices de la CNIL, les cookies <strong className="text-zinc-200">strictement
              nécessaires</strong> au fonctionnement du service sont exemptés de consentement.
            </p>
            <p className="mt-4 text-zinc-400">
              Le cookie <code className="text-amber-400">x-auth-token</code> entre dans cette
              catégorie car le service ne peut pas fonctionner sans lui. C&apos;est pourquoi
              nous n&apos;affichons pas de bannière de consentement aux cookies.
            </p>
          </div>
        </section>

        {/* Cookies tiers */}
        <section className="mb-8" aria-labelledby="third-heading">
          <h2
            id="third-heading"
            className="mb-4 font-mono text-xl font-bold text-green-400"
          >
            <span className="text-green-600">{'>'}</span> COOKIES_TIERS
          </h2>
          <div className="border border-red-500/30 bg-red-500/5 p-6">
            <p className="font-mono text-sm text-zinc-300">
              <span className="text-red-400">[AUCUN]</span> Phantom Chat n&apos;utilise aucun cookie tiers :
            </p>
            <ul className="mt-4 space-y-2 font-mono text-sm text-zinc-400">
              <li className="flex items-start">
                <span className="mr-2 text-red-400">[X]</span>
                <span>Pas de Google Analytics ni autre outil d&apos;analyse</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-red-400">[X]</span>
                <span>Pas de cookies publicitaires (Facebook, Google Ads...)</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-red-400">[X]</span>
                <span>Pas de boutons de partage social</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-red-400">[X]</span>
                <span>Pas de widgets externes</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Gérer les cookies */}
        <section className="mb-8" aria-labelledby="manage-heading">
          <h2
            id="manage-heading"
            className="mb-4 font-mono text-xl font-bold text-green-400"
          >
            <span className="text-green-600">{'>'}</span> GÉRER_LES_COOKIES
          </h2>
          <div className="border border-zinc-800 bg-zinc-900/50 p-6">
            <p className="mb-4 text-zinc-400">
              Vous pouvez supprimer ou bloquer les cookies via les paramètres de votre navigateur.
              Cependant, si vous bloquez le cookie <code className="text-amber-400">x-auth-token</code>,
              vous ne pourrez pas utiliser les rooms de chat.
            </p>
            <p className="text-sm text-zinc-500">
              Pour supprimer le cookie : fermez simplement votre navigateur ou supprimez manuellement
              les cookies du site dans les paramètres de votre navigateur.
            </p>
          </div>
        </section>

        {/* Liens */}
        <section className="mb-8">
          <div className="grid gap-4 sm:grid-cols-3">
            <Link
              href="/legal"
              className="border border-zinc-800 bg-zinc-900/50 p-4 transition-all hover:border-green-500/30"
            >
              <h3 className="font-mono text-sm font-bold text-green-400">[LEGAL]</h3>
              <p className="text-xs text-zinc-500">Mentions légales</p>
            </Link>
            <Link
              href="/privacy"
              className="border border-zinc-800 bg-zinc-900/50 p-4 transition-all hover:border-green-500/30"
            >
              <h3 className="font-mono text-sm font-bold text-green-400">[PRIVACY]</h3>
              <p className="text-xs text-zinc-500">Politique de confidentialité</p>
            </Link>
            <Link
              href="/terms"
              className="border border-zinc-800 bg-zinc-900/50 p-4 transition-all hover:border-green-500/30"
            >
              <h3 className="font-mono text-sm font-bold text-green-400">[TERMS]</h3>
              <p className="text-xs text-zinc-500">Conditions d&apos;utilisation</p>
            </Link>
          </div>
        </section>

        {/* Date */}
        <footer className="text-center">
          <p className="font-mono text-xs text-zinc-600">
            Dernière mise à jour : Janvier 2025
          </p>
        </footer>
      </article>
    </div>
  );
}
