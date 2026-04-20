'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import AuthForm from '@/components/auth/AuthForm'

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  async function handleRegister(data: { email: string; password: string }) {
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signUp({
      ...data,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-[#F97316] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <span className="font-bold text-[#1B3A6B] text-lg">Govzy</span>
          </div>
          <h1 className="text-xl font-bold text-slate-800">Créer un compte</h1>
          <p className="text-sm text-slate-500 mt-1">Votre assistant administratif belge</p>
        </div>
        <AuthForm mode="register" onSubmit={handleRegister} loading={loading} error={error} />
        <p className="text-center text-sm text-slate-500 mt-4">
          Déjà un compte ?{' '}
          <Link href="/auth/login" className="text-[#F97316] font-medium hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}
