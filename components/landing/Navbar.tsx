// === GOVZY - Barre de navigation landing page ===
// Navigation fixe en haut avec logo + CTA
// 2 états visuels :
//   - Transparent (sur hero bleu) → textes blancs, bouton blanc avec contour
//   - Scrollé (fond blanc) → textes foncés, bouton orange plein

"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const [menuOuvert, setMenuOuvert] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const gererScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", gererScroll);
    return () => window.removeEventListener("scroll", gererScroll);
  }, []);

  const liensNav = [
    { label: "Problème", href: "#probleme" },
    { label: "Solution", href: "#solution" },
    { label: "Fonctionnalités", href: "#fonctionnalites" },
    { label: "Comment ça marche", href: "#comment" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo Govzy — version claire sur hero bleu, normale après scroll */}
          <a href="/" className="flex items-center">
            <Image
              src="/logo-govzy.png"
              alt="Govzy"
              width={120}
              height={40}
              className={`h-10 w-auto transition-all duration-300 ${
                scrolled ? "brightness-100" : "brightness-0 invert"
              }`}
              priority
            />
          </a>

          {/* Liens desktop — blancs sur hero, anthracite après scroll */}
          <div className="hidden md:flex items-center gap-6">
            {liensNav.map((lien) => (
              <a
                key={lien.href}
                href={lien.href}
                className={`font-medium transition-colors text-sm ${
                  scrolled
                    ? "text-govzy-text hover:text-govzy-blue"
                    : "text-white/90 hover:text-white"
                }`}
              >
                {lien.label}
              </a>
            ))}
          </div>

          {/* Bouton CTA desktop :
              - Sur hero bleu → contour blanc (visible sur fond sombre)
              - Après scroll → orange plein (visible sur fond blanc) */}
          <div className="hidden md:flex items-center">
            <a
              href="#liste-attente"
              className={`font-semibold px-5 py-2.5 rounded-xl min-h-[44px] flex items-center
                          transition-all duration-200 active:scale-95 text-sm whitespace-nowrap ${
                scrolled
                  ? "bg-govzy-orange text-white hover:bg-orange-500 shadow-md hover:shadow-lg"
                  : "bg-white text-govzy-blue hover:bg-white/90 shadow-lg font-bold"
              }`}
            >
              Rejoindre la liste d&apos;attente
            </a>
          </div>

          {/* Bouton hamburger mobile — blanc sur hero, bleu après scroll */}
          <button
            onClick={() => setMenuOuvert(!menuOuvert)}
            className={`md:hidden p-2 rounded-lg transition-colors min-h-[44px] min-w-[44px]
                        flex items-center justify-center ${
              scrolled ? "hover:bg-gray-100" : "hover:bg-white/10"
            }`}
            aria-label={menuOuvert ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {menuOuvert ? (
              <X className={`w-6 h-6 ${scrolled ? "text-govzy-blue" : "text-white"}`} />
            ) : (
              <Menu className={`w-6 h-6 ${scrolled ? "text-govzy-blue" : "text-white"}`} />
            )}
          </button>
        </div>

        {/* Menu mobile déroulant — toujours fond blanc */}
        {menuOuvert && (
          <div className="md:hidden bg-white border-t border-gray-100 py-4 px-2 shadow-xl rounded-b-2xl">
            {liensNav.map((lien) => (
              <a
                key={lien.href}
                href={lien.href}
                onClick={() => setMenuOuvert(false)}
                className="block py-3 px-4 text-govzy-text hover:text-govzy-blue
                           hover:bg-govzy-bg rounded-xl font-medium transition-colors"
              >
                {lien.label}
              </a>
            ))}
            <div className="mt-4 px-4">
              <a
                href="#liste-attente"
                onClick={() => setMenuOuvert(false)}
                className="block w-full bg-govzy-orange text-white font-bold py-3 px-6
                           rounded-xl text-center hover:bg-orange-500 active:scale-95
                           transition-all duration-200 min-h-[44px]"
              >
                Rejoindre la liste d&apos;attente
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
