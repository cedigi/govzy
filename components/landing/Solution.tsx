// === GOVZY - Section Solution ===
// Présente les 3 piliers de la solution Govzy
// Contraste avec la section Problème : "avant / après"

import { Brain, Bell, FolderOpen, CheckCircle } from "lucide-react";

// Les 3 piliers de la solution
const piliers = [
  {
    icon: Brain,
    numero: "01",
    titre: "Comprend vos documents",
    description:
      "Scannez ou uploadez n'importe quel document belge. " +
      "Govzy l'analyse, le traduit en langage simple et vous explique " +
      "exactement ce que vous devez faire.",
    avantages: [
      "Avertissement-extrait de rôle",
      "Précompte immobilier",
      "Documents ONSS/INAMI",
      "C4 et attestations chômage",
    ],
    couleur: "bg-govzy-blue",
    accent: "border-govzy-blue",
  },
  {
    icon: Bell,
    numero: "02",
    titre: "Détecte vos aides",
    description:
      "En fonction de votre profil et de votre région, " +
      "Govzy identifie automatiquement toutes les aides auxquelles " +
      "vous avez droit mais que vous ne connaissez pas encore.",
    avantages: [
      "Primes Renolution (Wallonie)",
      "Chèques habitat (Bruxelles)",
      "Tarif social énergie",
      "Réductions fiscales personnalisées",
    ],
    couleur: "bg-govzy-orange",
    accent: "border-govzy-orange",
  },
  {
    icon: FolderOpen,
    numero: "03",
    titre: "Organise et alerte",
    description:
      "Tous vos documents au même endroit, classés automatiquement. " +
      "Rappels intelligents avant chaque échéance. " +
      "Ne ratez plus jamais une date limite.",
    avantages: [
      "Coffre-fort documentaire sécurisé",
      "Rappels SMS/email personnalisés",
      "Calendrier administratif intelligent",
      "Export et partage facilités",
    ],
    couleur: "bg-emerald-600",
    accent: "border-emerald-500",
  },
];

export default function Solution() {
  return (
    <section
      id="solution"
      className="py-16 md:py-24 px-4 md:px-8 bg-govzy-bg"
    >
      <div className="max-w-6xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block bg-govzy-blue/10 text-govzy-blue font-semibold text-sm px-4 py-2 rounded-full mb-4">
            La solution
          </span>
          <h2
            className="text-3xl md:text-4xl font-bold text-govzy-text mb-4"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Govzy transforme votre chaos{" "}
            <span className="text-govzy-blue">en clarté totale</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Un assistant IA entraîné sur l&apos;administration belge.
            Il comprend ce que vous ne comprenez pas, trouve ce que vous ne savez
            pas chercher, et vous rappelle ce que vous oubliez.
          </p>
        </div>

        {/* Grille des 3 piliers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {piliers.map((pilier) => {
            const Icon = pilier.icon;
            return (
              <div
                key={pilier.numero}
                className={`card border-t-4 ${pilier.accent} hover:shadow-lg transition-shadow`}
              >
                {/* Numéro + icône */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-12 h-12 ${pilier.couleur} rounded-xl flex items-center justify-center`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-3xl font-bold text-gray-200">
                    {pilier.numero}
                  </span>
                </div>

                {/* Contenu */}
                <h3
                  className="text-xl font-bold text-govzy-text mb-3"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {pilier.titre}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-5">
                  {pilier.description}
                </p>

                {/* Liste des fonctionnalités incluses */}
                <ul className="space-y-2">
                  {pilier.avantages.map((avantage) => (
                    <li key={avantage} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 text-sm">{avantage}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
