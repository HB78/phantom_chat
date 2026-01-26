import Link from 'next/link';

export function Footer() {

  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 px-4 py-12 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="font-mono text-lg font-bold text-green-400 transition-colors hover:text-green-300"
            >
              PHANTOM<span className="text-zinc-500">_</span>CHAT
            </Link>
            <p className="mt-2 text-sm text-zinc-400">
              Self-destructing encrypted chat rooms.
              <br />
              No accounts. No logs. No traces.
            </p>
          </div>

          {/* Resources */}
          <div>
            <h2 className="mb-4 font-mono text-sm font-bold text-zinc-200">
              RESOURCES
            </h2>
            <nav aria-label="Resources">
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/chat/guide"
                    className="text-zinc-400 transition-colors hover:text-green-400 focus:text-green-400 focus:outline-none"
                  >
                    User Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/chat/faq"
                    className="text-zinc-400 transition-colors hover:text-green-400 focus:text-green-400 focus:outline-none"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/chat/security"
                    className="text-zinc-400 transition-colors hover:text-green-400 focus:text-green-400 focus:outline-none"
                  >
                    Security
                  </Link>
                </li>
                <li>
                  <Link
                    href="/chat/encryption"
                    className="text-zinc-400 transition-colors hover:text-green-400 focus:text-green-400 focus:outline-none"
                  >
                    Encryption
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Legal */}
          <div>
            <h2 className="mb-4 font-mono text-sm font-bold text-zinc-200">
              LEGAL
            </h2>
            <nav aria-label="Legal">
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/legal"
                    className="text-zinc-400 transition-colors hover:text-green-400 focus:text-green-400 focus:outline-none"
                  >
                    Legal Notice
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-zinc-400 transition-colors hover:text-green-400 focus:text-green-400 focus:outline-none"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cookies"
                    className="text-zinc-400 transition-colors hover:text-green-400 focus:text-green-400 focus:outline-none"
                  >
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-zinc-400 transition-colors hover:text-green-400 focus:text-green-400 focus:outline-none"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-zinc-800 pt-8 text-center">
          <p className="font-mono text-xs text-zinc-500">
            <span className="text-green-500" aria-hidden="true">$</span> 2026 Phantom Chat.
            All rights reserved.
          </p>
          <p className="mt-2 font-mono text-xs text-zinc-600">
            Built with privacy in mind.
          </p>
        </div>
      </div>
    </footer>
  );
}
