// === GOVZY - Section Fonctionnalités ===
// Grille de features avec icônes — format épuré pour scan rapide
// Mobile : 2 colonnes, Desktop : 3 colonnes

import {
  ScanLine,
  MapPin,
  Calendar,
  MessageSquare,
  Lock,
  Zap,
  Euro,
  FileCheck,
} from "lucide-react";

// Toutes les fonctionnalités de la Phase 1-4
const fonctionnalites = [
  {
    icon: ScanLine,
    titre: "OCR intelligent",
    description: "Extraction automatique de texte depuis vos photos et PDF.",
    badge: null,
    couleur: "bg-blue-50 text-govzy-blue",
  },
  {
    icon: MapPin,
    titre: "Adapté à votre région",
    description: "Wallonie, Bruxelles ou Flandre — les bons organismes, les bonnes aides.",
    badge: "🇧🇪",
    couleur: "bg-orange-50 text-govzy-orange",
  },
  {
    icon: Calendar,
    titre: "Calendrier des échéances",
    description: "Toutes vos dates limites visualisées et rappelées automatiquement.",
    badge: null,
    couleur: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: MessageSquare,
    titre: "Assistant conversationnel",
    description: "Posez vos questions en français naturel, obtenez des réponses claires.",
    badge: "IA",
    couleur: "bg-purple-50 text-purple-600",
  },
  {
    icon: Euro,
    titre: "Détection des aides",
    description: "Primes, réductions, allocations — Govzy trouve tout pour vous.",
    badge: "Nouveau",
    couleur: "bg-yellow-50 text-yellow-600",
  },
  {
    icon: FileCheck,
    titre: "Coffre-fort documentaire",
    description: "Tous vos documents classés, sécurisés, accessibles partout.",
    badge: null,
    couleur: "bg-indigo-50 text-indigo-600",
  },
  {
    icon: Lock,
    titre: "RGPD & Sécurité",
    description: "Données chiffrées AES-256 au repos et hébergées en Europe.",
    badge: "RGPD",
    couleur: "bg-gray-50 text-gray-600",
  },
  {
    icon: Zap,
    titre: "PWA Mobile",
    description: "Fonctionne comme une app native. Installez-la sur votre téléphone.",
    badge: null,
    couleur: "bg-cyan-50 text-cyan-600",
  },
];

export default function Fonctionnalites() {
  return (
    <section
      id="fonctionnalites"
      className="py-16 md:py-24 px-4 md:px-8 bg-govzy-bg"
    >
      <div className="max-w-6xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-12">
          <span className="inline-block bg-govzy-blue/10 text-govzy-blue font-semibold text-sm px-4 py-2 rounded-full mb-4">
            Fonctionnalités
          </span>
          <h2
            className="text-3xl md:text-4xl font-bold text-govzy-text mb-4"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Tout ce dont vous avez besoin{" "}
            <span className="text-govzy-blue">en un seul endroit</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Govzy centralise et simplifie toute votre vie administrative.
          </p>
        </div>

        {/* Grille de fonctionnalités */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {fonctionnalites.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.titre}
                className="card hover:shadow-md transition-shadow relative"
              >
                {/* Badge optionnel */}
                {feature.badge && (
                  <span className="absolute top-4 right-4 bg-govzy-orange text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {feature.badge}
                  </span>
                )}

                {/* Icône */}
                <div
                  className={`w-11 h-11 ${feature.couleur} rounded-xl flex items-center justify-center mb-3`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* Texte */}
                <h3
                  className="font-semibold text-govzy-text text-sm mb-1.5"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {feature.titre}
                </h3>
                <p className="text-gray-400 text-xs leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
