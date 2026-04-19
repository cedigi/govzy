// === GOVZY - API Route : compteur liste d'attente ===
// GET /api/waitlist-count
// Retourne le nombre total d'inscrits depuis Supabase
// Fallback sur 847 si Supabase n'est pas encore configuré

import { NextResponse } from "next/server";

// Nombre de départ affiché avant d'avoir de vrais inscrits
// Donne une impression de traction initiale (social proof)
const FALLBACK_COUNT = 847;

export async function GET() {
  // Si Supabase n'est pas encore configuré → retourne le fallback immédiatement
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { count: FALLBACK_COUNT },
      {
        // Cache 1 minute pour ne pas surcharger l'API
        headers: { "Cache-Control": "public, s-maxage=60" },
      }
    );
  }

  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/public_stats?select=total_inscrits&limit=1`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
        next: { revalidate: 60 },
      }
    );

    if (response.ok) {
      const data = await response.json();
      const total = data?.[0]?.total_inscrits ?? 0;
      const count = Number(total) + FALLBACK_COUNT;
      return NextResponse.json(
        { count },
        { headers: { "Cache-Control": "public, s-maxage=60" } }
      );
    }

    return NextResponse.json({ count: FALLBACK_COUNT });
  } catch (error) {
    console.error("[waitlist-count] Erreur Supabase:", error);
    return NextResponse.json({ count: FALLBACK_COUNT });
  }
}
