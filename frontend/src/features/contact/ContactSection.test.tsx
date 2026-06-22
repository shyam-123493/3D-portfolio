import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { ContactSection } from './ContactSection'

vi.mock('@/services/api', () => ({
  api: {
    submitContact: vi.fn().mockResolvedValue({ data: { detail: 'Message received.' } }),
  },
}))

function Wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return (
    <QueryClientProvider client={qc}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  )
}

describe('ContactSection', () => {
  it('renders the contact form fields', () => {
    render(<ContactSection />, { wrapper: Wrapper })
    expect(screen.getByLabelText(/name \*/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email \*/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/message \*/i)).toBeInTheDocument()
  })

  it('shows validation error for short name on submit', async () => {
    render(<ContactSection />, { wrapper: Wrapper })
    const submit = screen.getByRole('button', { name: /send message/i })
    await userEvent.click(submit)
    await waitFor(() => {
      expect(screen.getByText(/at least 2 characters/i)).toBeInTheDocument()
    })
  })
})
