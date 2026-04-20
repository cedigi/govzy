import { render, screen } from '@testing-library/react'
import DocumentUpload from '@/components/documents/DocumentUpload'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
}))

describe('DocumentUpload', () => {
  it('renders upload button in button variant', () => {
    render(<DocumentUpload variant="button" />)
    expect(screen.getByRole('button', { name: /scanner un doc/i })).toBeInTheDocument()
  })

  it('renders hidden file input with id govzy-upload-input', () => {
    render(<DocumentUpload variant="button" />)
    const input = document.getElementById('govzy-upload-input')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'file')
  })

  it('file input accepts PDF, JPG, PNG', () => {
    render(<DocumentUpload variant="button" />)
    const input = document.getElementById('govzy-upload-input')
    expect(input).toHaveAttribute('accept', '.pdf,.jpg,.jpeg,.png')
  })
})
