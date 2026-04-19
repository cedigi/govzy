import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    brevo_key_set: !!process.env.BREVO_API_KEY,
    brevo_key_length: process.env.BREVO_API_KEY?.length ?? 0,
    sender_email: process.env.BREVO_SENDER_EMAIL ?? "non défini",
  });
}
