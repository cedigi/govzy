import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const BREVO_API_KEY = process.env.BREVO_API_KEY;

const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL ?? "hello.govzy@gmail.com";
const SENDER_NAME = "Govzy";

async function envoyerEmailConfirmation(email: string) {
  if (!BREVO_API_KEY) return;

  await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": BREVO_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: SENDER_NAME, email: SENDER_EMAIL },
      to: [{ email }],
      subject: "Vous êtes sur la liste d'attente Govzy ! 🎉",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #f8fafc;">
          <div style="background: #1B3A6B; border-radius: 16px; padding: 32px; text-align: center; margin-bottom: 24px;">
            <h1 style="color: white; font-size: 28px; margin: 0 0 8px;">Bienvenue chez Govzy ! 🎉</h1>
            <p style="color: rgba(255,255,255,0.8); margin: 0;">Vous êtes officiellement sur la liste d'attente</p>
          </div>

          <div style="background: white; border-radius: 16px; padding: 32px; margin-bottom: 24px;">
            <h2 style="color: #1B3A6B; font-size: 20px; margin: 0 0 16px;">Ce qui vous attend :</h2>
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #475569;">
                🎁 <strong>Accès anticipé gratuit</strong> avant le lancement public
              </li>
              <li style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #475569;">
                ⭐ <strong>Tarif fondateur : 50% de réduction à vie</strong>
              </li>
              <li style="padding: 10px 0; color: #475569;">
                💡 <strong>Influence le développement</strong> des fonctionnalités
              </li>
            </ul>
          </div>

          <div style="background: #FFF4EC; border-radius: 16px; padding: 24px; margin-bottom: 24px; border-left: 4px solid #F97316;">
            <p style="color: #1B3A6B; margin: 0; font-size: 15px;">
              <strong>Govzy</strong>, c'est l'application qui simplifie vos démarches administratives en Belgique.
              Allocations, primes, aides régionales — on s'occupe de tout.
            </p>
          </div>

          <p style="text-align: center; color: #94a3b8; font-size: 13px; margin: 0;">
            Vous recevrez un email dès que Govzy est prêt.<br/>
            <a href="mailto:${SENDER_EMAIL}" style="color: #1B3A6B;">Nous contacter</a> ·
            Désinscription en 1 clic à tout moment
          </p>
        </div>
      `,
    }),
  });
}

export async function POST(req: NextRequest) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return NextResponse.json({ error: "Service indisponible." }, { status: 503 });
  }

  const body = await req.json().catch(() => null);
  if (!body?.email) {
    return NextResponse.json({ error: "Email requis." }, { status: 400 });
  }

  const email: string = body.email.trim().toLowerCase();
  const region: string | null = body.region || null;

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Email invalide." }, { status: 400 });
  }

  const validRegions = ["wallonie", "flandre", "bruxelles"];
  if (region && !validRegions.includes(region)) {
    return NextResponse.json({ error: "Région invalide." }, { status: 400 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    null;

  const response = await fetch(`${SUPABASE_URL}/rest/v1/waitlist`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      email,
      region,
      source: "landing_page",
      ip_address: ip,
      user_agent: req.headers.get("user-agent"),
      consent_marketing: false,
    }),
  });

  if (response.status === 409) {
    return NextResponse.json(
      { error: "Cet email est déjà inscrit." },
      { status: 409 }
    );
  }

  if (!response.ok) {
    return NextResponse.json(
      { error: "Une erreur est survenue. Réessayez." },
      { status: 500 }
    );
  }

  // Envoi email de confirmation en arrière-plan (sans bloquer la réponse)
  envoyerEmailConfirmation(email).catch((err) =>
    console.error("[brevo] Erreur envoi email:", err)
  );

  return NextResponse.json({ success: true }, { status: 201 });
}
