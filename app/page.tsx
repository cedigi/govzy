// === GOVZY - Landing Page principale ===
// Assemble tous les composants de la landing page dans l'ordre optimal
// pour la conversion : Navbar > Hero > Problème > Solution > Comment > Features > CTA > Footer

import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Probleme from "@/components/landing/Probleme";
import Solution from "@/components/landing/Solution";
import CommentCaMarche from "@/components/landing/CommentCaMarche";
import Fonctionnalites from "@/components/landing/Fonctionnalites";
import Temoignages from "@/components/landing/Temoignages";
import ListeAttente from "@/components/landing/ListeAttente";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      {/* Navigation fixe en haut */}
      <Navbar />

      {/* 1. Hero : première impression + tagline */}
      <Hero />

      {/* 2. Problème : empathie avec les douleurs des citoyens belges */}
      <Probleme />

      {/* 3. Solution : les 3 piliers de Govzy */}
      <Solution />

      {/* 4. Comment ça marche : 4 étapes simples */}
      <CommentCaMarche />

      {/* 5. Fonctionnalités : grille complète des features */}
      <Fonctionnalites />

      {/* 6. Témoignages : social proof */}
      <Temoignages />

      {/* 7. Liste d'attente : CTA principal de conversion */}
      <ListeAttente />

      {/* 8. Footer : liens légaux et contact */}
      <Footer />
    </main>
  );
}
