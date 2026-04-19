// === GOVZY - Section Hero (bannière principale) ===
// Première impression : tagline, valeur principale, CTA liste d'attente
// Mobile-first : stack vertical, desktop : deux colonnes

import { ArrowRight, Shield, Clock, Sparkles } from "lucide-react";
import AnimatedDemo from "@/components/landing/AnimatedDemo";
import WaitlistCounter from "@/components/landing/WaitlistCounter";

export default function Hero() {
  return (
    <section className="relative bg-govzy-blue overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24">
      {/* Arrière-plan décoratif : cercles flous */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-govzy-blue-light/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-govzy-orange/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">

          {/* Colonne texte (gauche sur desktop) */}
          <div className="flex-1 text-center md:text-left">
            {/* Badge "Nouveau" */}
            <div className="inline-flex items-center gap-2 bg-white/10 text-white/90 text-sm font-medium px-4 py-2 rounded-full mb-6 border border-white/20">
              <Sparkles className="w-4 h-4 text-govzy-orange" />
              Assistant IA pour citoyens belges
            </div>

            {/* Titre principal */}
            <h1
              className="text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              L&apos;administration belge
              <span className="text-govzy-orange block mt-2">enfin sous contrôle</span>
            </h1>

            {/* Sous-titre */}
            <p className="text-white/80 text-lg md:text-xl mb-8 max-w-xl mx-auto md:mx-0 leading-relaxed">
              Govzy comprend vos documents administratifs, détecte les aides
              auxquelles vous avez droit et vous rappelle vos échéances.{" "}
              <strong className="text-white">
                Plus de stress, plus de délais ratés.
              </strong>
            </p>

            {/* Compteur social proof — chiffre réel depuis Supabase */}
            <p className="text-white/60 text-sm mb-6">
              🇧🇪 Déjà <WaitlistCounter /> sur la liste d&apos;attente
            </p>

            {/* CTA principal */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a
                href="#liste-attente"
                className="bg-govzy-orange text-white font-semibold px-8 py-4 rounded-xl
                           min-h-[44px] flex items-center justify-center gap-2
                           hover:bg-orange-500 active:scale-95 transition-all duration-200
                           shadow-lg hover:shadow-xl text-lg"
              >
                Rejoindre gratuitement
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="#comment"
                className="border-2 border-white/40 text-white font-semibold px-8 py-4 rounded-xl
                           min-h-[44px] flex items-center justify-center gap-2
                           hover:bg-white/10 transition-all duration-200 text-lg"
              >
                Comment ça marche ?
              </a>
            </div>

            {/* Garanties */}
            <div className="flex flex-wrap gap-4 justify-center md:justify-start mt-8">
              {[
                { icon: Shield, texte: "100% gratuit" },
                { icon: Clock, texte: "Accès anticipé" },
                { icon: Sparkles, texte: "IA belge spécialisée" },
              ].map(({ icon: Icon, texte }) => (
                <div
                  key={texte}
                  className="flex items-center gap-2 text-white/70 text-sm"
                >
                  <Icon className="w-4 h-4 text-govzy-orange" />
                  {texte}
                </div>
              ))}
            </div>
          </div>

          {/* Colonne visuel (droite sur desktop) — Démo animée */}
          <div className="flex-1 w-full max-w-md mx-auto md:mx-0">
            <AnimatedDemo />
          </div>
        </div>
      </div>
    </section>
  );
}
