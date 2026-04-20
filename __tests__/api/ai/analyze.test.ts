/**
 * @jest-environment node
 */
import { POST } from '@/app/api/ai/analyze/route'
import { NextRequest } from 'next/server'

jest.mock('@/lib/gemini', () => ({
  geminiFlash: {
    generateContent: jest.fn().mockResolvedValue({
      response: { text: () => JSON.stringify({ type: 'fiche_de_paie', resume: 'Fiche de paie de Thomas, mars 2026, salaire net 2 500€.' }) }
    })
  },
  fileToGenerativePart: jest.fn(() => ({ inlineData: { data: 'abc', mimeType: 'image/jpeg' } })),
  SYSTEM_PROMPT: 'system',
}))

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(() => ({
    auth: { getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'user-123' } }, error: null }) },
    from: jest.fn(() => ({
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: { id: 'doc-123', nom: 'test.pdf', type_detecte: 'fiche_de_paie', resume: 'résumé', storage_path: 'user-123/test.pdf', user_id: 'user-123', created_at: new Date().toISOString() }, error: null }),
    })),
    storage: {
      from: jest.fn(() => ({
        upload: jest.fn().mockResolvedValue({ error: null }),
      })),
    },
  })),
}))

describe('POST /api/ai/analyze', () => {
  it('returns 400 if no file provided', async () => {
    const formData = new FormData()
    const req = new NextRequest('http://localhost/api/ai/analyze', {
      method: 'POST',
      body: formData,
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('returns 401 if user not authenticated', async () => {
    const { createClient } = require('@/lib/supabase/server')
    createClient.mockReturnValueOnce({
      auth: { getUser: jest.fn().mockResolvedValue({ data: { user: null }, error: null }) },
      from: jest.fn(),
      storage: { from: jest.fn() },
    })

    const formData = new FormData()
    formData.append('file', new Blob(['test'], { type: 'image/jpeg' }), 'test.jpg')
    const req = new NextRequest('http://localhost/api/ai/analyze', {
      method: 'POST',
      body: formData,
    })
    const res = await POST(req)
    expect(res.status).toBe(401)
  })
})
