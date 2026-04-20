'use client'
import { useState } from 'react'

type Props = {
  mode: 'login' | 'register'
  onSubmit: (data: { email: string; password: string }) => void
  loading: boolean
  error?: string | null
}

export default function AuthForm({ mode, onSubmit, loading, error }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit({ email, password }) }}
      className="flex flex-col gap-4"
    >
      {error && (
        <div role="alert" className="bg-red-50 text-red-700 text-sm p-3 rounded-lg border border-red-200">
          {error}
        </div>
      )}
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium text-slate-700">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]"
          placeholder="vous@exemple.be"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium text-slate-700">Mot de passe</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]"
          placeholder="••••••••"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-[#F97316] text-white font-semibold py-2.5 rounded-lg text-sm disabled:opacity-60 hover:bg-orange-600 transition-colors"
      >
        {loading
          ? mode === 'login' ? 'Connexion...' : 'Inscription...'
          : mode === 'login' ? 'Connexion' : "S'inscrire"
        }
      </button>
    </form>
  )
}
