// === GOVZY - Section Problème ===
// Montre les douleurs réelles des citoyens belges face à l'administration
// Crée l'empathie avant de présenter la solution

import { AlertCircle, Clock, FileX, HelpCircle } from "lucide-react";

// Points de douleur identifiés pour les citoyens belges
const douleurs = [
  {
    icon: FileX,
    titre: "Documents incompréhensibles",
    description:
      "Avertissement-extrait de rôle, précompte immobilier, attestation de composition de ménage... " +
      "Le jargon administratif belge est un labyrinthe.",
    couleur: "text-red-500",
    bg: "bg-red-50",
  },
  {
    icon: HelpCircle,
    titre: "Aides ratées par méconnaissance",
    description:
      "Des milliers d'euros de primes Renolution, chèques habitat, réductions fiscales " +
      "qui existent mais que personne ne connaît.",
    couleur: "text-orange-500",
    bg: "bg-orange-50",
  },
  {
    icon: Clock,
    titre: "Délais et échéances manqués",
    description:
      "Taxation d'office, amendes, perte de droits... " +
      "Les conséquences d'une date oubliée peuvent coûter très cher.",
    couleur: "text-yellow-600",
    bg: "bg-yellow-50",
  },
  {
    icon: AlertCircle,
    titre: "3 niveaux de pouvoir, 1 chaos total",
    description:
      "Fédéral, régional, communal : à qui s'adresser ? " +
      "SPF, ONSS, INAMI, Actiris, Forem, VDAB... quel organisme pour quel problème ?",
    couleur: "text-purple-500",
    bg: "bg-purple-50",
  },
];

export default function Probleme() {
  return (
    <section
      id="probleme"
      className="py-16 md:py-24 px-4 md:px-8 bg-white"
    >
      <div className="max-w-6xl mx-auto">
        {/* En-tête de section */}
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block bg-red-100 text-red-600 font-semibold text-sm px-4 py-2 rounded-full mb-4">
            Le problème
          </span>
          <h2
            className="text-3xl md:text-4xl font-bold text-govzy-text mb-4"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            L&apos;administration belge paralyse{" "}
            <span className="text-govzy-orange">des millions de citoyens</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Ce n&apos;est pas votre faute. Le système administratif belge est
            objectivement l&apos;un des plus complexes d&apos;Europe.
          </p>
        </div>

        {/* Statistique choc */}
        <div className="bg-govzy-blue rounded-2xl p-6 md:p-8 mb-12 text-center">
          <p className="text-white/70 text-sm font-medium mb-2">
            Saviez-vous que...
          </p>
          <p className="text-white text-2xl md:text-3xl font-bold mb-3">
            <span className="text-govzy-orange">73%</span> des Belges ont raté
            au moins une aide financière
          </p>
          <p className="text-white/60 text-sm">
            par manque d&apos;information — en moyenne{" "}
            <strong className="text-white">2 400€ perdus par ménage et par an</strong>
          </p>
        </div>

        {/* Grille des douleurs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {douleurs.map((douleur) => {
            const Icon = douleur.icon;
            return (
              <div
                key={douleur.titre}
                className="card flex gap-4 hover:shadow-md transition-shadow"
              >
                {/* Icône */}
                <div
                  className={`w-12 h-12 ${douleur.bg} rounded-xl flex items-center justify-center flex-shrink-0`}
                >
                  <Icon className={`w-6 h-6 ${douleur.couleur}`} />
                </div>
                {/* Texte */}
                <div>
                  <h3
                    className="font-semibold text-govzy-text mb-2"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {douleur.titre}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {douleur.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
