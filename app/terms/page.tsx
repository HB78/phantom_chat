import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Conditions Générales d\'Utilisation - Phantom Chat',
  description:
    'Conditions générales d\'utilisation de Phantom Chat. Règles d\'usage du service de messagerie chiffrée.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <h1 className="mb-4 font-mono text-4xl font-bold text-green-400 md:text-5xl">
            <span className="text-green-600">{'>'}</span> TERMS_OF_SERVICE
          </h1>
          <p className="text-lg text-zinc-400">
            Conditions Générales d&apos;Utilisation de Phantom Chat
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
              <span>Service gratuit, fourni &quot;tel quel&quot;</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-green-400">[+]</span>
              <span>Usage légal uniquement, vous êtes responsable de vos messages</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-green-400">[+]</span>
              <span>Données auto-détruites, aucune récupération possible</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-green-400">[+]</span>
              <span>Aucune garantie de disponibilité ou de performance</span>
            </li>
          </ul>
        </section>

        {/* Article 1 - Objet */}
        <section className="mb-8" aria-labelledby="art1-heading">
          <h2
            id="art1-heading"
            className="mb-4 font-mono text-xl font-bold text-green-400"
          >
            <span className="text-green-600">{'>'}</span> ARTICLE_1 : OBJET
          </h2>
          <div className="border border-zinc-800 bg-zinc-900/50 p-6">
            <p className="text-zinc-400">
              Les présentes Conditions Générales d&apos;Utilisation (CGU) régissent l&apos;utilisation
              du service Phantom Chat, une plateforme de messagerie chiffrée avec auto-destruction
              des messages. En utilisant ce service, vous acceptez sans réserve les présentes CGU.
            </p>
          </div>
        </section>

        {/* Article 2 - Description */}
        <section className="mb-8" aria-labelledby="art2-heading">
          <h2
            id="art2-heading"
            className="mb-4 font-mono text-xl font-bold text-green-400"
          >
            <span className="text-green-600">{'>'}</span> ARTICLE_2 : DESCRIPTION_DU_SERVICE
          </h2>
          <div className="border border-zinc-800 bg-zinc-900/50 p-6">
            <p className="mb-4 text-zinc-400">
              Phantom Chat permet aux utilisateurs de :
            </p>
            <ul className="ml-4 list-disc space-y-2 text-zinc-400">
              <li>Créer des salons de discussion temporaires (rooms)</li>
              <li>Échanger des messages chiffrés de bout en bout avec un autre utilisateur</li>
              <li>Détruire manuellement les rooms à tout moment</li>
              <li>Bénéficier d&apos;une destruction automatique à l&apos;expiration du TTL (Time-To-Live)</li>
            </ul>
            <p className="mt-4 text-zinc-400">
              Le service est fourni gratuitement, sans création de compte ni collecte
              de données personnelles.
            </p>
          </div>
        </section>

        {/* Article 3 - Accès */}
        <section className="mb-8" aria-labelledby="art3-heading">
          <h2
            id="art3-heading"
            className="mb-4 font-mono text-xl font-bold text-green-400"
          >
            <span className="text-green-600">{'>'}</span> ARTICLE_3 : CONDITIONS_D&apos;ACCÈS
          </h2>
          <div className="border border-zinc-800 bg-zinc-900/50 p-6">
            <p className="mb-4 text-zinc-400">
              L&apos;accès au service est ouvert à toute personne disposant d&apos;un navigateur web
              compatible et d&apos;une connexion Internet. Aucune inscription n&apos;est requise.
            </p>
            <p className="text-zinc-400">
              L&apos;utilisateur doit être majeur ou avoir l&apos;autorisation d&apos;un représentant légal
              pour utiliser ce service.
            </p>
          </div>
        </section>

        {/* Article 4 - Utilisation */}
        <section className="mb-8" aria-labelledby="art4-heading">
          <h2
            id="art4-heading"
            className="mb-4 font-mono text-xl font-bold text-green-400"
          >
            <span className="text-green-600">{'>'}</span> ARTICLE_4 : RÈGLES_D&apos;UTILISATION
          </h2>
          <div className="border border-zinc-800 bg-zinc-900/50 p-6">
            <p className="mb-4 text-zinc-400">
              L&apos;utilisateur s&apos;engage à utiliser le service de manière légale et éthique.
              Sont strictement interdits :
            </p>
            <div className="border border-red-500/30 bg-red-500/5 p-4">
              <ul className="space-y-2 font-mono text-sm text-zinc-300">
                <li className="flex items-start">
                  <span className="mr-2 text-red-400">[X]</span>
                  <span>Contenus illégaux (pédopornographie, terrorisme, incitation à la haine...)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-red-400">[X]</span>
                  <span>Harcèlement, menaces ou intimidation</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-red-400">[X]</span>
                  <span>Fraude, escroquerie ou activités criminelles</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-red-400">[X]</span>
                  <span>Atteinte aux droits de propriété intellectuelle</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-red-400">[X]</span>
                  <span>Spam, phishing ou distribution de malware</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-red-400">[X]</span>
                  <span>Tentatives de contournement des mesures de sécurité</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Article 5 - Responsabilité */}
        <section className="mb-8" aria-labelledby="art5-heading">
          <h2
            id="art5-heading"
            className="mb-4 font-mono text-xl font-bold text-green-400"
          >
            <span className="text-green-600">{'>'}</span> ARTICLE_5 : RESPONSABILITÉ
          </h2>
          <div className="border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="space-y-4 text-zinc-400">
              <div>
                <h3 className="mb-2 font-mono text-base font-semibold text-zinc-200">
                  5.1 Responsabilité de l&apos;utilisateur
                </h3>
                <p>
                  L&apos;utilisateur est seul responsable du contenu de ses messages et de l&apos;usage
                  qu&apos;il fait du service. En cas d&apos;usage illégal, l&apos;utilisateur en assume
                  l&apos;entière responsabilité juridique.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-mono text-base font-semibold text-zinc-200">
                  5.2 Responsabilité de l&apos;éditeur
                </h3>
                <p>
                  L&apos;éditeur agit en qualité d&apos;hébergeur au sens de l&apos;article 6 de la LCEN.
                  Il ne peut être tenu responsable des contenus échangés par les utilisateurs,
                  dont il n&apos;a pas connaissance en raison du chiffrement de bout en bout.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Article 6 - Garanties */}
        <section className="mb-8" aria-labelledby="art6-heading">
          <h2
            id="art6-heading"
            className="mb-4 font-mono text-xl font-bold text-green-400"
          >
            <span className="text-green-600">{'>'}</span> ARTICLE_6 : ABSENCE_DE_GARANTIE
          </h2>
          <div className="border border-amber-500/30 bg-amber-500/5 p-6">
            <p className="mb-4 text-zinc-400">
              Le service est fourni <strong className="text-amber-400">&quot;tel quel&quot;</strong> et
              <strong className="text-amber-400"> &quot;selon disponibilité&quot;</strong>, sans garantie d&apos;aucune sorte.
              L&apos;éditeur ne garantit pas :
            </p>
            <ul className="ml-4 list-disc space-y-2 text-zinc-400">
              <li>La disponibilité continue et ininterrompue du service</li>
              <li>L&apos;absence de bugs ou d&apos;erreurs</li>
              <li>La compatibilité avec tous les appareils ou navigateurs</li>
              <li>La récupération des données après destruction</li>
              <li>La sécurité absolue contre toute forme d&apos;attaque</li>
            </ul>
          </div>
        </section>

        {/* Article 7 - Données */}
        <section className="mb-8" aria-labelledby="art7-heading">
          <h2
            id="art7-heading"
            className="mb-4 font-mono text-xl font-bold text-green-400"
          >
            <span className="text-green-600">{'>'}</span> ARTICLE_7 : DESTRUCTION_DES_DONNÉES
          </h2>
          <div className="border border-zinc-800 bg-zinc-900/50 p-6">
            <p className="mb-4 text-zinc-400">
              L&apos;utilisateur reconnaît et accepte que :
            </p>
            <ul className="ml-4 list-disc space-y-2 text-zinc-400">
              <li>
                Toutes les données (messages, clés) sont automatiquement supprimées à
                l&apos;expiration du TTL de la room
              </li>
              <li>
                La destruction manuelle d&apos;une room supprime immédiatement et définitivement
                toutes les données associées
              </li>
              <li>
                Aucune récupération n&apos;est possible après destruction
              </li>
              <li>
                L&apos;éditeur ne conserve aucune sauvegarde des données
              </li>
            </ul>
          </div>
        </section>

        {/* Article 8 - Modification */}
        <section className="mb-8" aria-labelledby="art8-heading">
          <h2
            id="art8-heading"
            className="mb-4 font-mono text-xl font-bold text-green-400"
          >
            <span className="text-green-600">{'>'}</span> ARTICLE_8 : MODIFICATION_DES_CGU
          </h2>
          <div className="border border-zinc-800 bg-zinc-900/50 p-6">
            <p className="text-zinc-400">
              L&apos;éditeur se réserve le droit de modifier les présentes CGU à tout moment.
              Les modifications entrent en vigueur dès leur publication sur cette page.
              L&apos;utilisation continue du service après modification vaut acceptation
              des nouvelles conditions.
            </p>
          </div>
        </section>

        {/* Article 9 - Résiliation */}
        <section className="mb-8" aria-labelledby="art9-heading">
          <h2
            id="art9-heading"
            className="mb-4 font-mono text-xl font-bold text-green-400"
          >
            <span className="text-green-600">{'>'}</span> ARTICLE_9 : SUSPENSION_ET_RÉSILIATION
          </h2>
          <div className="border border-zinc-800 bg-zinc-900/50 p-6">
            <p className="text-zinc-400">
              L&apos;éditeur se réserve le droit de suspendre ou d&apos;interrompre le service
              à tout moment, avec ou sans préavis, notamment en cas d&apos;abus ou de violation
              des présentes CGU. Aucune indemnité ne sera due en cas de suspension ou
              d&apos;arrêt du service.
            </p>
          </div>
        </section>

        {/* Article 10 - Loi */}
        <section className="mb-8" aria-labelledby="art10-heading">
          <h2
            id="art10-heading"
            className="mb-4 font-mono text-xl font-bold text-green-400"
          >
            <span className="text-green-600">{'>'}</span> ARTICLE_10 : LOI_APPLICABLE
          </h2>
          <div className="border border-zinc-800 bg-zinc-900/50 p-6">
            <p className="text-zinc-400">
              Les présentes CGU sont soumises au droit français. En cas de litige,
              les tribunaux français seront seuls compétents, après tentative de
              résolution amiable.
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
              Pour toute question concernant ces CGU :
            </p>
            <p className="mt-2 font-mono text-green-400">
              <a href="mailto:lastmodel03@gmail.com" className="hover:underline">
                lastmodel03@gmail.com
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
