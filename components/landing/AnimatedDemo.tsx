// === GOVZY - Démo animée dans le Hero ===
// Simule l'analyse IA d'un document belge en temps réel
// Les étapes s'affichent une par une avec une animation de fondu

"use client";

import { useState, useEffect } from "react";

// Étapes de l'analyse simulée — reproduit un vrai flux Govzy
const etapesAnalyse = [
  { texte: "Govzy analyse votre document...", icone: "🤖" },
  { texte: "✅ Document : Précompte immobilier 2024", icone: null },
  { texte: "📍 Région : Wallonie détectée", icone: null },
  { texte: "⏰ Échéance : 15 novembre 2024", icone: null },
  { texte: "💡 Éligible au tarif social énergie", icone: null },
];

// Action recommandée finale — s'affiche une fois l'analyse terminée
const actionFinale =
  "Contacter le SPF Finances avant le 15/11. Je vous rappelle 7 jours avant.";

export default function AnimatedDemo() {
  // Index de la dernière étape affichée (les étapes s'accumulent)
  const [etapeActuelle, setEtapeActuelle] = useState(0);
  // Contrôle l'affichage de l'action finale
  const [afficherAction, setAfficherAction] = useState(false);
  // Contrôle le cycle de réinitialisation
  const [reinitialisation, setReinitialisation] = useState(false);

  useEffect(() => {
    if (reinitialisation) {
      // Pause avant de repartir depuis zéro
      const timer = setTimeout(() => {
        setEtapeActuelle(0);
        setAfficherAction(false);
        setReinitialisation(false);
      }, 2000);
      return () => clearTimeout(timer);
    }

    if (etapeActuelle < etapesAnalyse.length - 1) {
      // Avance à l'étape suivante toutes les 1.5s
      const timer = setTimeout(() => {
        setEtapeActuelle((prev) => prev + 1);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      // Analyse terminée : affiche l'action puis repart en boucle
      const timer = setTimeout(() => setAfficherAction(true), 800);
      const timerReset = setTimeout(() => setReinitialisation(true), 4000);
      return () => {
        clearTimeout(timer);
        clearTimeout(timerReset);
      };
    }
  }, [etapeActuelle, reinitialisation]);

  // Progression en % selon l'étape actuelle
  const progression =
    etapeActuelle === 0 && reinitialisation
      ? 0
      : Math.round((etapeActuelle / (etapesAnalyse.length - 1)) * 100);

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20 shadow-2xl">
      {/* En-tête fixe */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-govzy-orange rounded-xl flex items-center justify-center text-lg flex-shrink-0">
          🤖
        </div>
        <div>
          <p className="text-white font-semibold text-sm">Assistant Govzy</p>
          <p className="text-white/50 text-xs">Analyse en cours...</p>
        </div>
        {/* Indicateur "live" clignotant */}
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-emerald-400 text-xs font-medium">Live</span>
        </div>
      </div>

      {/* Zone des étapes — s'accumulent vers le bas */}
      <div className="bg-white/5 rounded-xl p-4 mb-4 border border-white/10 min-h-[130px]">
        <div className="space-y-2.5">
          {etapesAnalyse
            .slice(0, etapeActuelle + 1)
            .map((etape, index) => (
              <div
                key={index}
                // Classe d'animation définie dans globals.css
                className="flex items-start gap-2 animate-fadeIn"
              >
                <span className="text-white/90 text-sm leading-relaxed">
                  {etape.texte}
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* Action recommandée — apparaît à la fin de l'analyse */}
      <div
        className={`bg-govzy-orange/20 rounded-xl p-3 border border-govzy-orange/30 mb-4
                    transition-all duration-500 ${
                      afficherAction
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-2"
                    }`}
      >
        <p className="text-govzy-orange font-semibold text-xs mb-1">
          Action recommandée :
        </p>
        <p className="text-white/80 text-xs leading-relaxed">{actionFinale}</p>
      </div>

      {/* Barre de progression */}
      <div>
        <div className="flex justify-between text-white/40 text-xs mb-1.5">
          <span>Analyse</span>
          <span>{progression}%</span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-govzy-orange rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progression}%` }}
          />
        </div>
      </div>
    </div>
  );
}
