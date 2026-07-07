import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppRouter } from '@/app/Router'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      // Enough retries to ride out a Render cold start — queries stay in
      // `isLoading` (skeletons visible) until a retry finally succeeds.
      retry: 3,
      retryDelay: (attempt) => Math.min(2000 * 2 ** attempt, 15000),
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </QueryClientProvider>
  )
}
