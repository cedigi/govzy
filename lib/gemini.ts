// lib/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export const geminiFlash = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

export function fileToGenerativePart(base64: string, mimeType: string) {
  return { inlineData: { data: base64, mimeType } }
}

export const SYSTEM_PROMPT = `Tu es un assistant administratif belge expert.
Tu aides les utilisateurs à comprendre leurs documents administratifs belges.
Réponds toujours en français. Sois concis, clair et bienveillant.
Tu connais parfaitement : les aides sociales belges (CPAS, allocations familiales, primes énergie, etc.),
la fiscalité belge, les droits des travailleurs, et les procédures administratives belges.`
