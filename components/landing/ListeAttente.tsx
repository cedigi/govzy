// === GOVZY - Section Liste d'attente (CTA principal) ===
// Formulaire d'inscription via Tally.so intégré en iframe
// C'est la conversion principale de la landing page

"use client";

import { useState } from "react";
import { CheckCircle, Users, Gift, Star } from "lucide-react";

// Avantages de s'inscrire sur la liste d'attente
const avantages = [
  {
    icon: Gift,
    texte: "Accès anticipé gratuit avant le lancement public",
  },
  {
    icon: Star,
    texte: "Tarif fondateur : 50% de réduction à vie",
  },
  {
    icon: Users,
    texte: "Influence le développement des fonctionnalités",
  },
  {
    icon: CheckCircle,
    texte: "Aucun engagement, désinscription en 1 clic",
  },
];

export default function ListeAttente() {
  // État du formulaire : en cours, succès, ou erreur
  const [emailSoumis, setEmailSoumis] = useState(false);
  const [email, setEmail] = useState("");
  const [region, setRegion] = useState("");
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);

  const gererSoumission = async (e: React.FormEvent) => {
    e.preventDefault();
    setErreur("");
    setChargement(true);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), region }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErreur(data.error ?? "Une erreur est survenue. Réessayez.");
        return;
      }

      setEmailSoumis(true);
    } catch {
      setErreur("Erreur réseau. Vérifiez votre connexion.");
    } finally {
      setChargement(false);
    }
  };

  return (
    <section
      id="liste-attente"
      className="py-16 md:py-24 px-4 md:px-8 bg-govzy-blue"
    >
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">

          {/* Colonne gauche : avantages */}
          <div className="text-center md:text-left">
            {/* Badge */}
            <span className="inline-block bg-govzy-orange text-white font-semibold text-sm px-4 py-2 rounded-full mb-6">
              Lancement bientôt
            </span>

            <h2
              className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Soyez parmi les premiers à
              <span className="text-govzy-orange"> maîtriser </span>
              votre administration
            </h2>

            <p className="text-white/70 text-lg mb-8 leading-relaxed">
              Govzy est en cours de développement. Rejoignez les{" "}
              <strong className="text-white">premiers pionniers</strong> qui bénéficieront
              d&apos;un accès anticipé et d&apos;un tarif exclusif.
            </p>

            {/* Liste d'avantages */}
            <ul className="space-y-4">
              {avantages.map((avantage) => {
                const Icon = avantage.icon;
                return (
                  <li key={avantage.texte} className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-govzy-orange" />
                    </div>
                    <p className="text-white/80 text-sm">{avantage.texte}</p>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Colonne droite : formulaire */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl">
            {emailSoumis ? (
              /* État succès */
              <div className="py-2">
                <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-4">
                  <div className="flex items-center justify-center mb-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <h3
                    className="text-xl font-bold text-green-800 mb-2 text-center"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Inscription confirmée ! 🎉
                  </h3>
                  <p className="text-green-700 text-sm text-center">
                    Bienvenue parmi les pionniers Govzy !
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-blue-800 text-sm font-medium flex items-start gap-2">
                    <span className="text-lg flex-shrink-0">📧</span>
                    <span>
                      <strong>Email de bienvenue envoyé à {email} !</strong>
                      <br />
                      Si vous ne le voyez pas dans votre boîte principale,
                      vérifiez vos{" "}
                      <u>spams/courriers indésirables</u> et marquez-le
                      comme &quot;non spam&quot;.
                    </span>
                  </p>
                </div>
              </div>
            ) : (
              /* Formulaire d'inscription */
              <form onSubmit={gererSoumission}>
                <h3
                  className="text-xl font-bold text-govzy-text mb-2"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Rejoindre la liste d&apos;attente
                </h3>
                <p className="text-gray-400 text-sm mb-6">
                  Gratuit et sans engagement
                </p>

                {/* Champ email */}
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-govzy-text mb-2"
                  >
                    Votre adresse email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vous@exemple.be"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-govzy-text
                               focus:border-govzy-blue focus:outline-none transition-colors text-base
                               min-h-[44px]"
                  />
                </div>

                {/* Champ région */}
                <div className="mb-5">
                  <label
                    htmlFor="region"
                    className="block text-sm font-semibold text-govzy-text mb-2"
                  >
                    Votre région (optionnel)
                  </label>
                  <select
                    id="region"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-govzy-text
                               focus:border-govzy-blue focus:outline-none transition-colors text-base
                               min-h-[44px] bg-white"
                  >
                    <option value="">Sélectionner votre région</option>
                    <option value="wallonie">Wallonie</option>
                    <option value="bruxelles">Bruxelles-Capitale</option>
                    <option value="flandre">Flandre</option>
                  </select>
                </div>

                {/* Message d'erreur */}
                {erreur && (
                  <p className="text-red-500 text-sm mb-4">{erreur}</p>
                )}

                {/* Bouton soumettre */}
                <button
                  type="submit"
                  disabled={chargement}
                  className="w-full bg-govzy-orange text-white font-bold py-4 rounded-xl
                             hover:bg-orange-500 active:scale-95 transition-all duration-200
                             text-base min-h-[44px] shadow-md hover:shadow-lg
                             disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {chargement ? "Inscription en cours..." : "Je rejoins la liste d'attente →"}
                </button>

                {/* Mention RGPD */}
                <p className="text-gray-400 text-xs text-center mt-4 leading-relaxed">
                  🔒 Vos données sont protégées (RGPD). Nous ne les vendons jamais.
                  <br />
                  Désinscription en 1 clic à tout moment.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
