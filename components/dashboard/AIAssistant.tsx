'use client'
import { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'
import type { Message } from '@/lib/supabase/types'

type MessagePreview = Pick<Message, 'id' | 'role' | 'content'>

type Props = {
  messages: MessagePreview[]
  documentId?: string
}

export default function AIAssistant({ messages: initialMessages, documentId }: Props) {
  const [messages, setMessages] = useState<MessagePreview[]>(initialMessages)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage() {
    if (!input.trim() || loading) return
    const userMessage = input.trim()
    setInput('')
    setMessages((prev) => [...prev, { id: `temp-${Date.now()}`, role: 'user', content: userMessage }])
    setLoading(true)

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, document_id: documentId }),
      })
      const data = await res.json() as { reply: string }
      setMessages((prev) => [...prev, { id: `temp-${Date.now() + 1}`, role: 'assistant', content: data.reply }])
    } catch {
      setMessages((prev) => [...prev, { id: `temp-err-${Date.now()}`, role: 'assistant', content: 'Erreur de connexion. Réessayez.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full bg-[#1B3A6B] rounded-xl flex flex-col overflow-hidden">
      <div className="px-4 py-3 border-b border-white/10 flex-shrink-0">
        <p className="text-white/50 text-xs uppercase tracking-widest">Assistant IA</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 min-h-0">
        {messages.length === 0 && (
          <div className="bg-[#F97316]/20 border border-[#F97316]/30 rounded-lg p-3">
            <p className="text-white text-xs leading-relaxed">
              Bonjour ! Envoyez un document ou posez-moi une question sur l&apos;administration belge 👋
            </p>
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
            <div className={`max-w-[85%] rounded-lg px-3 py-2 text-xs leading-relaxed ${
              msg.role === 'user'
                ? 'bg-[#F97316] text-white'
                : 'bg-white/10 text-white'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/10 rounded-lg px-3 py-2 text-xs text-white/50">En train de répondre…</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-3 border-t border-white/10 flex-shrink-0">
        <div className="flex gap-2 bg-white/10 rounded-lg px-3 py-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
            placeholder="Posez une question…"
            className="flex-1 bg-transparent text-white text-xs placeholder-white/30 outline-none"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            aria-label="Envoyer le message"
            className="text-[#F97316] disabled:text-white/20 transition-colors"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
