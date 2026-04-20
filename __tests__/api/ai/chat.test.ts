/**
 * @jest-environment node
 */
import { POST } from '@/app/api/ai/chat/route'
import { NextRequest } from 'next/server'

jest.mock('@/lib/gemini', () => ({
  geminiFlash: {
    generateContent: jest.fn().mockResolvedValue({
      response: { text: () => 'Voici ma réponse.' }
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
      is: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
      insert: jest.fn().mockResolvedValue({ error: null }),
    })),
  })),
}))

describe('POST /api/ai/chat', () => {
  it('returns 400 if no message', async () => {
    const req = new NextRequest('http://localhost/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('returns 400 if message is empty string', async () => {
    const req = new NextRequest('http://localhost/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message: '   ' }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('returns 200 with reply for valid message', async () => {
    const req = new NextRequest('http://localhost/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message: 'Bonjour' }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
    const data = await res.json() as { reply: string }
    expect(data.reply).toBe('Voici ma réponse.')
  })
})
