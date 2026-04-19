// === GOVZY - Compteur dynamique liste d'attente ===
// Affiche le vrai nombre d'inscrits depuis la base de données
// Fallback sur 847 si l'API est indisponible

"use client";

import { useEffect, useState } from "react";

export default function WaitlistCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/waitlist-count")
      .then((res) => res.json())
      .then((data) => setCount(data.count))
      .catch(() => setCount(847)); // Fallback si API indisponible
  }, []);

  // Pendant le chargement : affiche un placeholder animé
  if (count === null) {
    return (
      <span className="inline-block w-16 h-5 bg-white/20 rounded animate-pulse" />
    );
  }

  return (
    <span className="text-govzy-orange font-bold">
      {count.toLocaleString("fr-BE")} Belges
    </span>
  );
}
