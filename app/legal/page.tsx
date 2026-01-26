import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Mentions Légales - Phantom Chat',
  description:
    'Mentions légales de Phantom Chat : informations sur l\'éditeur, l\'hébergeur et les conditions d\'utilisation du service.',
};

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <h1 className="mb-4 font-mono text-4xl font-bold text-green-400 md:text-5xl">
            <span className="text-green-600">{'>'}</span> MENTIONS_LÉGALES
          </h1>
          <p className="text-lg text-zinc-400">
            Informations légales conformément à la loi n° 2004-575 du 21 juin 2004
          </p>
        </header>

        {/* Éditeur */}
        <section className="mb-8" aria-labelledby="editeur-heading">
          <h2
            id="editeur-heading"
            className="mb-4 font-mono text-xl font-bold text-green-400"
          >
            <span className="text-green-600">{'>'}</span> ÉDITEUR_DU_SITE
          </h2>
          <div className="border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="space-y-2 font-mono text-sm">
              <div className="flex border-l-2 border-green-500/50 bg-black/30 p-3">
                <span className="w-32 text-zinc-500">Nom :</span>
                <span className="text-zinc-300">Kenshin Himura</span>
              </div>
              <div className="flex border-l-2 border-green-500/50 bg-black/30 p-3">
                <span className="w-32 text-zinc-500">Statut :</span>
                <span className="text-zinc-300">Particulier</span>
              </div>
              <div className="flex border-l-2 border-green-500/50 bg-black/30 p-3">
                <span className="w-32 text-zinc-500">Email :</span>
                <span className="text-green-400">lastmodel03@gmail.com</span>
              </div>
            </div>
          </div>
        </section>

        {/* Hébergeur */}
        <section className="mb-8" aria-labelledby="hebergeur-heading">
          <h2
            id="hebergeur-heading"
            className="mb-4 font-mono text-xl font-bold text-green-400"
          >
            <span className="text-green-600">{'>'}</span> HÉBERGEUR
          </h2>
          <div className="border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="space-y-2 font-mono text-sm">
              <div className="flex border-l-2 border-green-500/50 bg-black/30 p-3">
                <span className="w-32 text-zinc-500">Nom :</span>
                <span className="text-zinc-300">Vercel Inc.</span>
              </div>
              <div className="flex border-l-2 border-green-500/50 bg-black/30 p-3">
                <span className="w-32 text-zinc-500">Adresse :</span>
                <span className="text-zinc-300">340 S Lemon Ave #4133, Walnut, CA 91789, USA</span>
              </div>
              <div className="flex border-l-2 border-green-500/50 bg-black/30 p-3">
                <span className="w-32 text-zinc-500">Site :</span>
                <a
                  href="https://vercel.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 hover:underline"
                >
                  https://vercel.com
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Propriété intellectuelle */}
        <section className="mb-8" aria-labelledby="ip-heading">
          <h2
            id="ip-heading"
            className="mb-4 font-mono text-xl font-bold text-green-400"
          >
            <span className="text-green-600">{'>'}</span> PROPRIÉTÉ_INTELLECTUELLE
          </h2>
          <div className="border border-zinc-800 bg-zinc-900/50 p-6">
            <p className="text-zinc-400">
              L&apos;ensemble du contenu de ce site (textes, images, code source, design) est la propriété
              exclusive de l&apos;éditeur, sauf mention contraire. Toute reproduction, représentation,
              modification ou exploitation non autorisée est interdite et constitue une contrefaçon
              sanctionnée par le Code de la propriété intellectuelle.
            </p>
          </div>
        </section>

        {/* Responsabilité */}
        <section className="mb-8" aria-labelledby="resp-heading">
          <h2
            id="resp-heading"
            className="mb-4 font-mono text-xl font-bold text-green-400"
          >
            <span className="text-green-600">{'>'}</span> LIMITATION_DE_RESPONSABILITÉ
          </h2>
          <div className="border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="space-y-4 text-zinc-400">
              <p>
                Phantom Chat est un service de messagerie chiffrée fourni &quot;tel quel&quot;.
                L&apos;éditeur ne peut être tenu responsable :
              </p>
              <ul className="ml-4 list-disc space-y-2">
                <li>Du contenu des messages échangés par les utilisateurs</li>
                <li>De toute utilisation illégale du service</li>
                <li>De la perte de données due à l&apos;expiration du TTL ou à la destruction des rooms</li>
                <li>Des dommages directs ou indirects résultant de l&apos;utilisation du service</li>
              </ul>
              <p>
                Les utilisateurs sont seuls responsables de leurs communications et de l&apos;usage
                qu&apos;ils font du service.
              </p>
            </div>
          </div>
        </section>

        {/* Liens */}
        <section className="mb-8" aria-labelledby="liens-heading">
          <h2
            id="liens-heading"
            className="mb-4 font-mono text-xl font-bold text-green-400"
          >
            <span className="text-green-600">{'>'}</span> DOCUMENTS_ASSOCIÉS
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Link
              href="/privacy"
              className="border border-zinc-800 bg-zinc-900/50 p-4 transition-all hover:border-green-500/30"
            >
              <h3 className="font-mono text-sm font-bold text-green-400">[PRIVACY]</h3>
              <p className="text-xs text-zinc-500">Politique de confidentialité</p>
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
