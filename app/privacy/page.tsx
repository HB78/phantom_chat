import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Politique de Confidentialité - Phantom Chat',
  description:
    'Comment Phantom Chat protège vos données personnelles. Politique de confidentialité conforme au RGPD.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <h1 className="mb-4 font-mono text-4xl font-bold text-green-400 md:text-5xl">
            <span className="text-green-600">{'>'}</span> PRIVACY_POLICY
          </h1>
          <p className="text-lg text-zinc-400">
            Politique de confidentialité conforme au RGPD
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
              <span>Aucun compte utilisateur, aucune donnée personnelle collectée</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-green-400">[+]</span>
              <span>Messages chiffrés de bout en bout, illisibles pour nous</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-green-400">[+]</span>
              <span>Données automatiquement supprimées à l&apos;expiration du TTL</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-green-400">[+]</span>
              <span>Aucune vente ni partage de données avec des tiers</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-green-400">[+]</span>
              <span>Un seul cookie technique, strictement nécessaire</span>
            </li>
          </ul>
        </section>

        {/* Responsable du traitement */}
        <section className="mb-8" aria-labelledby="controller-heading">
          <h2
            id="controller-heading"
            className="mb-4 font-mono text-xl font-bold text-green-400"
          >
            <span className="text-green-600">{'>'}</span> RESPONSABLE_DU_TRAITEMENT
          </h2>
          <div className="border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="space-y-2 font-mono text-sm">
              <div className="flex border-l-2 border-green-500/50 bg-black/30 p-3">
                <span className="w-32 text-zinc-500">Nom :</span>
                <span className="text-zinc-300">Kenshin Himura</span>
              </div>
              <div className="flex border-l-2 border-green-500/50 bg-black/30 p-3">
                <span className="w-32 text-zinc-500">Email :</span>
                <span className="text-green-400">lastmodel03@gmail.com</span>
              </div>
            </div>
          </div>
        </section>

        {/* Données collectées */}
        <section className="mb-8" aria-labelledby="data-heading">
          <h2
            id="data-heading"
            className="mb-4 font-mono text-xl font-bold text-green-400"
          >
            <span className="text-green-600">{'>'}</span> DONNÉES_COLLECTÉES
          </h2>
          <div className="border border-zinc-800 bg-zinc-900/50 p-6">
            <p className="mb-4 text-zinc-400">
              Phantom Chat est conçu selon le principe de minimisation des données.
              Nous collectons uniquement ce qui est strictement nécessaire au fonctionnement :
            </p>
            <div className="space-y-4">
              <div className="border-l-2 border-amber-500/50 bg-black/30 p-4">
                <h3 className="mb-2 font-mono text-sm font-bold text-amber-400">
                  Messages chiffrés
                </h3>
                <p className="text-sm text-zinc-400">
                  Stockés temporairement sous forme chiffrée (AES-256-GCM). Nous n&apos;avons pas
                  accès au contenu en clair. Supprimés automatiquement à l&apos;expiration de la room.
                </p>
              </div>
              <div className="border-l-2 border-amber-500/50 bg-black/30 p-4">
                <h3 className="mb-2 font-mono text-sm font-bold text-amber-400">
                  Clés publiques de chiffrement
                </h3>
                <p className="text-sm text-zinc-400">
                  Échangées pour établir le chiffrement E2E. Les clés privées ne quittent
                  jamais votre appareil.
                </p>
              </div>
              <div className="border-l-2 border-amber-500/50 bg-black/30 p-4">
                <h3 className="mb-2 font-mono text-sm font-bold text-amber-400">
                  Token d&apos;authentification (cookie)
                </h3>
                <p className="text-sm text-zinc-400">
                  Un identifiant anonyme généré aléatoirement pour identifier votre session
                  dans une room. Aucune information personnelle n&apos;y est associée.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Ce que nous NE collectons PAS */}
        <section className="mb-8" aria-labelledby="nocollect-heading">
          <h2
            id="nocollect-heading"
            className="mb-4 font-mono text-xl font-bold text-green-400"
          >
            <span className="text-green-600">{'>'}</span> DONNÉES_NON_COLLECTÉES
          </h2>
          <div className="border border-red-500/30 bg-red-500/5 p-6">
            <ul className="space-y-2 font-mono text-sm text-zinc-300">
              <li className="flex items-start">
                <span className="mr-2 text-red-400">[X]</span>
                <span>Adresses email ou numéros de téléphone</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-red-400">[X]</span>
                <span>Noms réels ou identités</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-red-400">[X]</span>
                <span>Adresses IP (non journalisées)</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-red-400">[X]</span>
                <span>Historique de navigation ou métadonnées</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-red-400">[X]</span>
                <span>Données de localisation</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-red-400">[X]</span>
                <span>Cookies de tracking ou publicitaires</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Base légale */}
        <section className="mb-8" aria-labelledby="legal-heading">
          <h2
            id="legal-heading"
            className="mb-4 font-mono text-xl font-bold text-green-400"
          >
            <span className="text-green-600">{'>'}</span> BASE_LÉGALE
          </h2>
          <div className="border border-zinc-800 bg-zinc-900/50 p-6">
            <p className="text-zinc-400">
              Le traitement des données est fondé sur l&apos;<strong className="text-zinc-200">intérêt légitime</strong> (Article 6.1.f du RGPD) :
              permettre le fonctionnement du service de messagerie chiffrée.
              Le cookie technique est exempt de consentement car strictement nécessaire
              (Article 82 de la loi Informatique et Libertés).
            </p>
          </div>
        </section>

        {/* Durée de conservation */}
        <section className="mb-8" aria-labelledby="retention-heading">
          <h2
            id="retention-heading"
            className="mb-4 font-mono text-xl font-bold text-green-400"
          >
            <span className="text-green-600">{'>'}</span> DURÉE_DE_CONSERVATION
          </h2>
          <div className="border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="space-y-2 font-mono text-sm">
              <div className="flex border-l-2 border-green-500/50 bg-black/30 p-3">
                <span className="w-48 text-zinc-500">Messages & rooms :</span>
                <span className="text-zinc-300">Jusqu&apos;à expiration du TTL (max 24h) ou destruction manuelle</span>
              </div>
              <div className="flex border-l-2 border-green-500/50 bg-black/30 p-3">
                <span className="w-48 text-zinc-500">Cookie de session :</span>
                <span className="text-zinc-300">Durée de la session ou fermeture du navigateur</span>
              </div>
            </div>
            <p className="mt-4 text-sm text-zinc-500">
              * La suppression est définitive et irréversible. Aucune sauvegarde n&apos;est conservée.
            </p>
          </div>
        </section>

        {/* Vos droits */}
        <section className="mb-8" aria-labelledby="rights-heading">
          <h2
            id="rights-heading"
            className="mb-4 font-mono text-xl font-bold text-green-400"
          >
            <span className="text-green-600">{'>'}</span> VOS_DROITS_RGPD
          </h2>
          <div className="border border-zinc-800 bg-zinc-900/50 p-6">
            <p className="mb-4 text-zinc-400">
              Conformément au RGPD, vous disposez des droits suivants :
            </p>
            <ul className="ml-4 list-disc space-y-2 text-zinc-400">
              <li><strong className="text-zinc-200">Droit d&apos;accès :</strong> Obtenir une copie de vos données</li>
              <li><strong className="text-zinc-200">Droit de rectification :</strong> Corriger vos données</li>
              <li><strong className="text-zinc-200">Droit à l&apos;effacement :</strong> Supprimer vos données</li>
              <li><strong className="text-zinc-200">Droit à la portabilité :</strong> Récupérer vos données</li>
              <li><strong className="text-zinc-200">Droit d&apos;opposition :</strong> Vous opposer au traitement</li>
            </ul>
            <p className="mt-4 text-sm text-zinc-500">
              Note : En raison de notre architecture zero-knowledge, nous ne pouvons pas identifier
              quelles données vous appartiennent. La destruction de la room est le moyen le plus
              efficace d&apos;exercer votre droit à l&apos;effacement.
            </p>
            <p className="mt-4 text-zinc-400">
              Pour exercer vos droits :{' '}
              <a href="mailto:lastmodel03@gmail.com" className="text-green-400 hover:underline">
                lastmodel03@gmail.com
              </a>
            </p>
          </div>
        </section>

        {/* Transferts */}
        <section className="mb-8" aria-labelledby="transfer-heading">
          <h2
            id="transfer-heading"
            className="mb-4 font-mono text-xl font-bold text-green-400"
          >
            <span className="text-green-600">{'>'}</span> TRANSFERTS_HORS_UE
          </h2>
          <div className="border border-zinc-800 bg-zinc-900/50 p-6">
            <p className="text-zinc-400">
              Le site est hébergé par Vercel Inc. aux États-Unis. Vercel adhère au
              EU-US Data Privacy Framework, garantissant un niveau de protection adéquat
              conformément à la décision d&apos;adéquation de la Commission européenne.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="mb-8" aria-labelledby="contact-heading">
          <h2
            id="contact-heading"
            className="mb-4 font-mono text-xl font-bold text-green-400"
          >
            <span className="text-green-600">{'>'}</span> CONTACT
          </h2>
          <div className="border border-zinc-800 bg-zinc-900/50 p-6">
            <p className="text-zinc-400">
              Pour toute question concernant cette politique ou vos données personnelles :
            </p>
            <p className="mt-2 font-mono text-green-400">
              <a href="mailto:lastmodel03@gmail.com" className="hover:underline">
                lastmodel03@gmail.com
              </a>
            </p>
            <p className="mt-4 text-sm text-zinc-500">
              Vous pouvez également introduire une réclamation auprès de la CNIL :
              <a
                href="https://www.cnil.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 text-green-400 hover:underline"
              >
                www.cnil.fr
              </a>
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
              href="/cookies"
              className="border border-zinc-800 bg-zinc-900/50 p-4 transition-all hover:border-green-500/30"
            >
              <h3 className="font-mono text-sm font-bold text-green-400">[COOKIES]</h3>
              <p className="text-xs text-zinc-500">Politique de cookies</p>
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
