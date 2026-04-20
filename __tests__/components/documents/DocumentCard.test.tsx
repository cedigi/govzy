import { render, screen } from '@testing-library/react'
import DocumentCard from '@/components/documents/DocumentCard'
import type { Document } from '@/lib/supabase/types'

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

const mockDoc: Document = {
  id: 'doc-1',
  user_id: 'user-1',
  nom: 'fiche-paie-mars.pdf',
  type_detecte: 'fiche_de_paie',
  resume: 'Fiche de paie du mois de mars 2026.',
  storage_path: 'user-1/1234.pdf',
  created_at: '2026-04-01T00:00:00.000Z',
}

describe('DocumentCard', () => {
  it('renders document name', () => {
    render(<DocumentCard document={mockDoc} />)
    expect(screen.getByText('fiche-paie-mars.pdf')).toBeInTheDocument()
  })

  it('renders correct emoji for fiche_de_paie', () => {
    render(<DocumentCard document={mockDoc} />)
    expect(screen.getByText('💰')).toBeInTheDocument()
  })

  it('links to correct document URL', () => {
    render(<DocumentCard document={mockDoc} />)
    expect(screen.getByRole('link')).toHaveAttribute('href', '/documents/doc-1')
  })
})
