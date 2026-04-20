'use client'
import EmptyState from './EmptyState'

export default function EmptyStateWrapper() {
  return (
    <EmptyState onUploadClick={() => {
      document.getElementById('govzy-upload-input')?.click()
    }} />
  )
}
