import { render, screen, fireEvent } from '@testing-library/react'
import AuthForm from '@/components/auth/AuthForm'

describe('AuthForm', () => {
  it('renders email and password fields', () => {
    render(<AuthForm mode="login" onSubmit={jest.fn()} loading={false} />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument()
  })

  it('calls onSubmit with email and password', () => {
    const onSubmit = jest.fn()
    render(<AuthForm mode="login" onSubmit={onSubmit} loading={false} />)
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@test.com' } })
    fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('button', { name: /connexion/i }))
    expect(onSubmit).toHaveBeenCalledWith({ email: 'test@test.com', password: 'password123' })
  })

  it('disables submit button when loading', () => {
    render(<AuthForm mode="login" onSubmit={jest.fn()} loading={true} />)
    expect(screen.getByRole('button', { name: /connexion/i })).toBeDisabled()
  })
})
