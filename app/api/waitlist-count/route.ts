import { NextResponse } from "next/server";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { count: 0 },
      { headers: { "Cache-Control": "public, s-maxage=60" } }
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
      const count = Number(data?.[0]?.total_inscrits ?? 0);
      return NextResponse.json(
        { count },
        { headers: { "Cache-Control": "public, s-maxage=60" } }
      );
    }

    return NextResponse.json({ count: 0 });
  } catch (error) {
    console.error("[waitlist-count] Erreur Supabase:", error);
    return NextResponse.json({ count: 0 });
  }
}
