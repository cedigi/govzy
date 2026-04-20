'use client'
import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload } from 'lucide-react'

type Props = {
  variant: 'button' | 'full'
  onSuccess?: (documentId: string) => void
}

export default function DocumentUpload({ variant, onSuccess }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      setError('Fichier trop volumineux (max 10 Mo)')
      return
    }

    setUploading(true)
    setError(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/ai/analyze', { method: 'POST', body: formData })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error ?? 'Erreur lors de l\'analyse')

      if (onSuccess) {
        onSuccess(data.document.id)
      } else {
        router.push(`/documents/${data.document.id}`)
      }
      router.refresh()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue'
      setError(message)
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        id="govzy-upload-input"
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />

      {error && (
        <p role="alert" className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
          {error}
        </p>
      )}

      {variant === 'button' && (
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="btn-shimmer disabled:opacity-60"
        >
          <Upload size={16} />
          {uploading ? 'Analyse en cours…' : 'Scanner un doc'}
        </button>
      )}
    </>
  )
}
