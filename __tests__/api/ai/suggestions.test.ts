/**
 * @jest-environment node
 */
import { POST } from '@/app/api/ai/suggestions/route'
import { NextRequest } from 'next/server'

jest.mock('@/lib/gemini', () => ({
  geminiFlash: {
    generateContent: jest.fn().mockResolvedValue({
      response: {
        text: () => JSON.stringify({
          type: 'aides',
          liste: [{ nom: 'Prime énergie', description: 'Aide pour les factures énergétiques', lien: 'https://example.be' }]
        })
      }
    })
  },
  SYSTEM_PROMPT: 'system',
}))

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(() => ({
    auth: { getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'user-123' } }, error: null }) },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      not: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
      insert: jest.fn().mockResolvedValue({ error: null }),
      then: jest.fn((resolve: (value: unknown) => void) => resolve({ data: [
        { nom: 'fiche-paie.pdf', type_detecte: 'fiche_de_paie', resume: 'Salaire net 2500€' }
      ], error: null })),
    })),
  })),
}))

describe('POST /api/ai/suggestions', () => {
  it('returns 401 if not authenticated', async () => {
    const { createClient } = require('@/lib/supabase/server')
    createClient.mockReturnValueOnce({
      auth: { getUser: jest.fn().mockResolvedValue({ data: { user: null }, error: null }) },
      from: jest.fn(),
    })
    const req = new NextRequest('http://localhost/api/ai/suggestions', { method: 'POST' })
    const res = await POST(req)
    expect(res.status).toBe(401)
  })

  it('returns 200 with suggestions for authenticated user', async () => {
    const req = new NextRequest('http://localhost/api/ai/suggestions', { method: 'POST' })
    const res = await POST(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.contenu).toBeDefined()
  })
})
