// === GOVZY - Section "Comment ça marche" ===
// Explique le parcours utilisateur en 4 étapes simples
// Format visuel : timeline horizontale sur desktop, verticale sur mobile

import { Upload, Cpu, Bell, CheckCircle } from "lucide-react";

// Les 4 étapes du parcours utilisateur
const etapes = [
  {
    icon: Upload,
    numero: 1,
    titre: "Uploadez votre document",
    description:
      "Photo avec votre téléphone ou fichier PDF. " +
      "Govzy accepte tous les formats de documents administratifs belges.",
    detail: "Scan, photo, PDF — tout fonctionne",
  },
  {
    icon: Cpu,
    numero: 2,
    titre: "L'IA analyse en secondes",
    description:
      "Notre IA spécialisée identifie le type de document, " +
      "extrait les informations clés et adapte son analyse à votre région.",
    detail: "Wallonie, Bruxelles ou Flandre",
  },
  {
    icon: Bell,
    numero: 3,
    titre: "Recevez votre résumé clair",
    description:
      "En langage simple : ce que le document dit, ce que vous devez faire, " +
      "les délais à respecter et les aides associées.",
    detail: "Zéro jargon administratif",
  },
  {
    icon: CheckCircle,
    numero: 4,
    titre: "Agissez en toute sérénité",
    description:
      "Govzy vous rappelle les échéances et vous guide vers les bons interlocuteurs. " +
      "Vous n'êtes plus jamais seul face à la paperasse.",
    detail: "Rappels automatiques inclus",
  },
];

export default function CommentCaMarche() {
  return (
    <section
      id="comment"
      className="py-16 md:py-24 px-4 md:px-8 bg-white"
    >
      <div className="max-w-6xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block bg-govzy-orange/10 text-govzy-orange font-semibold text-sm px-4 py-2 rounded-full mb-4">
            Simplicité garantie
          </span>
          <h2
            className="text-3xl md:text-4xl font-bold text-govzy-text mb-4"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            4 étapes, et votre document{" "}
            <span className="text-govzy-orange">n&apos;a plus de secrets</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            De l&apos;upload à l&apos;action en moins de 30 secondes.
          </p>
        </div>

        {/* Timeline des étapes */}
        <div className="relative">
          {/* Ligne de connexion desktop - affichée uniquement sur md+ */}
          <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-govzy-blue/20" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {etapes.map((etape, index) => {
              const Icon = etape.icon;
              return (
                <div key={etape.numero} className="relative flex flex-col items-center text-center">
                  {/* Cercle numéroté */}
                  <div className="relative z-10 w-20 h-20 rounded-full bg-govzy-blue flex flex-col items-center justify-center mb-5 shadow-lg">
                    <Icon className="w-7 h-7 text-white mb-0.5" />
                    <span className="text-white/60 text-xs font-bold">
                      0{etape.numero}
                    </span>
                  </div>

                  {/* Connecteur vertical mobile */}
                  {index < etapes.length - 1 && (
                    <div className="md:hidden absolute top-20 left-1/2 w-0.5 h-8 bg-govzy-blue/20 -translate-x-1/2" />
                  )}

                  {/* Contenu de l'étape */}
                  <h3
                    className="font-bold text-govzy-text mb-2 text-lg"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {etape.titre}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-3">
                    {etape.description}
                  </p>
                  {/* Tag détail */}
                  <span className="inline-block bg-govzy-bg text-govzy-blue text-xs font-semibold px-3 py-1 rounded-full">
                    {etape.detail}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA sous les étapes */}
        <div className="text-center mt-12">
          <a
            href="#liste-attente"
            className="inline-flex items-center gap-2 bg-govzy-blue text-white font-semibold px-8 py-4 rounded-xl
                       hover:bg-blue-900 active:scale-95 transition-all duration-200
                       shadow-md hover:shadow-lg text-lg min-h-[44px]"
          >
            Essayer Govzy gratuitement
          </a>
          <p className="text-gray-400 text-sm mt-3">
            Aucune carte bancaire requise · Accès anticipé gratuit
          </p>
        </div>
      </div>
    </section>
  );
}
