// === GOVZY - Section Témoignages / Social Proof ===
// Témoignages fictifs représentatifs des profils cibles belges
// IMPORTANT : À remplacer par de vrais témoignages clients après le lancement

import { Star, Quote } from "lucide-react";

// Témoignages représentatifs (fictifs pour le MVP)
const temoignages = [
  {
    nom: "Marie D.",
    localite: "Liège, Wallonie",
    avatar: "MD",
    note: 5,
    texte:
      "Grâce à Govzy, j'ai découvert que j'avais droit à la prime Renolution " +
      "depuis 2 ans sans le savoir ! J'ai récupéré 4 200€ que j'avais ratés.",
    document: "Prime isolation toiture",
  },
  {
    nom: "Thomas V.",
    localite: "Bruxelles",
    avatar: "TV",
    note: 5,
    texte:
      "Mon avertissement-extrait de rôle était incompréhensible. " +
      "Govzy me l'a expliqué en 3 points clairs et m'a rappelé la date limite. " +
      "Fini le stress !",
    document: "Précompte immobilier",
  },
  {
    nom: "Fatima B.",
    localite: "Charleroi, Wallonie",
    avatar: "FB",
    note: 5,
    texte:
      "J'avais peur de mon C4 après mon licenciement. " +
      "Govzy m'a expliqué mes droits ONEM, les délais pour introduire ma demande " +
      "et m'a même rappelé mon rendez-vous.",
    document: "C4 — Chômage ONEM",
  },
];

export default function Temoignages() {
  return (
    <section className="py-16 md:py-24 px-4 md:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-12">
          <span className="inline-block bg-yellow-100 text-yellow-700 font-semibold text-sm px-4 py-2 rounded-full mb-4">
            Ils l&apos;ont testé
          </span>
          <h2
            className="text-3xl md:text-4xl font-bold text-govzy-text mb-4"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Des Belges qui ont repris le{" "}
            <span className="text-govzy-orange">contrôle</span>
          </h2>
          <p className="text-gray-500 text-lg">
            Bêta-testeurs de la première heure
          </p>
        </div>

        {/* Grille des témoignages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {temoignages.map((temoignage) => (
            <div
              key={temoignage.nom}
              className="card relative hover:shadow-md transition-shadow"
            >
              {/* Icône citation */}
              <Quote className="absolute top-4 right-4 w-6 h-6 text-govzy-blue/10" />

              {/* Note étoiles */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: temoignage.note }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Texte du témoignage */}
              <p className="text-gray-600 text-sm leading-relaxed mb-5 italic">
                &ldquo;{temoignage.texte}&rdquo;
              </p>

              {/* Tag document concerné */}
              <div className="bg-govzy-bg rounded-lg px-3 py-2 mb-5">
                <p className="text-govzy-blue text-xs font-semibold">
                  📄 {temoignage.document}
                </p>
              </div>

              {/* Auteur */}
              <div className="flex items-center gap-3">
                {/* Avatar initiales */}
                <div className="w-10 h-10 bg-govzy-blue rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">
                    {temoignage.avatar}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-govzy-text text-sm">
                    {temoignage.nom}
                  </p>
                  <p className="text-gray-400 text-xs">{temoignage.localite}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Note : témoignages fictifs */}
        <p className="text-center text-gray-300 text-xs mt-8">
          * Témoignages représentatifs — à remplacer par de vraies expériences lors du lancement.
        </p>
      </div>
    </section>
  );
}
