import { render, screen } from '@testing-library/react'
import StatsRow from '@/components/dashboard/StatsRow'

describe('StatsRow', () => {
  it('displays document count', () => {
    render(<StatsRow documents={5} aides="1 200€" alertes={2} />)
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('1 200€')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('displays zeros when no data', () => {
    render(<StatsRow documents={0} aides="0€" alertes={0} />)
    expect(screen.getAllByText('0')).toHaveLength(2)
  })
})
