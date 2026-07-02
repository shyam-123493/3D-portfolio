import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { ContactSection } from './ContactSection'

vi.mock('@/services/api', () => ({
  api: {
    submitContact: vi.fn().mockResolvedValue({ data: { detail: 'Message received.' } }),
    submitMeeting: vi.fn().mockResolvedValue({ data: { detail: 'Meeting booked.' } }),
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
  it('renders the section heading and intro copy', () => {
    render(<ContactSection />, { wrapper: Wrapper })
    expect(screen.getByRole('region', { name: /contact/i })).toBeInTheDocument()
    expect(screen.getByText(/07 · let's talk/i)).toBeInTheDocument()
    expect(screen.getByText(/book a 30-minute intro call/i)).toBeInTheDocument()
  })

  it('renders the meeting booking widget', () => {
    render(<ContactSection />, { wrapper: Wrapper })
    // Booking card shows the host identity and meeting length
    expect(screen.getByText('GD')).toBeInTheDocument()
    expect(screen.getAllByText(/30 min/i).length).toBeGreaterThan(0)
  })
})
