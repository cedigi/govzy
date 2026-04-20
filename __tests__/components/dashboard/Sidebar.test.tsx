import { render, screen } from '@testing-library/react'
import Sidebar from '@/components/dashboard/Sidebar'

jest.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
}))

describe('Sidebar', () => {
  it('renders all navigation items', () => {
    render(<Sidebar prenom="Thomas" />)
    expect(screen.getByText('Accueil')).toBeInTheDocument()
    expect(screen.getByText('Documents')).toBeInTheDocument()
    expect(screen.getByText('Aides')).toBeInTheDocument()
    expect(screen.getByText('Alertes')).toBeInTheDocument()
  })

  it('highlights active route', () => {
    render(<Sidebar prenom="Thomas" />)
    const accueil = screen.getByText('Accueil').closest('a')
    expect(accueil).toHaveClass('bg-white/15')
  })
})
