// === GOVZY - Footer ===
// Pied de page avec liens légaux, réseaux sociaux et mentions RGPD

import { Mail, ExternalLink } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  const annee = new Date().getFullYear();

  return (
    <footer className="bg-govzy-text text-white py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

          {/* Logo + description */}
          <div>
            <div className="mb-4">
              <Image
                src="/logo-govzy.png"
                alt="Govzy"
                width={100}
                height={34}
                className="h-9 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              L&apos;assistant administratif intelligent pour citoyens belges.
              Simplifier, comprendre, agir.
            </p>
            {/* Badge conformité */}
            <div className="flex flex-wrap gap-2">
              <span className="bg-white/10 text-white/70 text-xs px-2 py-1 rounded-full">
                🇧🇪 Made in Belgium
              </span>
              <span className="bg-white/10 text-white/70 text-xs px-2 py-1 rounded-full">
                🔒 RGPD Compliant
              </span>
            </div>
          </div>

          {/* Liens utiles */}
          <div>
            <h3
              className="font-semibold mb-4 text-white/90"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Liens utiles
            </h3>
            <ul className="space-y-2">
              {[
                { label: "SPF Finances", href: "https://finances.belgium.be" },
                { label: "ONSS", href: "https://www.onss.be" },
                { label: "INAMI", href: "https://www.riziv.fgov.be" },
                { label: "Primes Wallonie", href: "https://www.wallonie.be/aides" },
                { label: "Actiris (Bruxelles)", href: "https://www.actiris.brussels" },
              ].map((lien) => (
                <li key={lien.label}>
                  <a
                    href={lien.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/60 hover:text-white text-sm flex items-center gap-1 transition-colors"
                  >
                    {lien.label}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + légal */}
          <div>
            <h3
              className="font-semibold mb-4 text-white/90"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Govzy
            </h3>
            <ul className="space-y-2 mb-6">
              {[
                { label: "À propos", href: "/a-propos" },
                { label: "Politique de confidentialité", href: "/confidentialite" },
                { label: "Conditions d'utilisation", href: "/conditions" },
                { label: "Mentions légales", href: "/mentions-legales" },
              ].map((lien) => (
                <li key={lien.label}>
                  <a
                    href={lien.href}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {lien.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Email de contact */}
            <a
              href="mailto:hello@govzy.be"
              className="inline-flex items-center gap-2 text-govzy-orange hover:text-orange-400 text-sm font-medium transition-colors"
            >
              <Mail className="w-4 h-4" />
              hello@govzy.be
            </a>
          </div>
        </div>

        {/* Ligne de séparation + copyright */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm">
            © {annee} Govzy — Tous droits réservés
          </p>
          <p className="text-white/40 text-xs text-center md:text-right">
            Govzy n&apos;est pas un service officiel du gouvernement belge.
            <br />
            Aucun conseil fiscal ou juridique définitif ne peut être fourni.
          </p>
        </div>
      </div>
    </footer>
  );
}
