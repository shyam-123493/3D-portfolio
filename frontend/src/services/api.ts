import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

export const apiClient = axios.create({
  baseURL: BASE_URL,
  // Render's free tier spins the backend down when idle; the first request
  // after a sleep takes ~50s to answer, so the timeout must outlast a cold
  // start or every first visit fails before the server even wakes up.
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status >= 500) {
      console.error('[API] Server error:', err.response.status)
    }
    return Promise.reject(err)
  },
)

export const api = {
  getProjects:         () => apiClient.get('/api/projects/'),
  getProject:          (slug: string) => apiClient.get(`/api/projects/${slug}/`),
  getExperience:       () => apiClient.get('/api/experience/'),
  getAchievements:     () => apiClient.get('/api/achievements/'),
  getCertifications:   () => apiClient.get('/api/certifications/'),
  getSiteSettings:     () => apiClient.get('/api/site-settings/'),
  getPersonalProjects: () => apiClient.get('/api/personal-projects/'),
  unlockVault:         (pin: string) => apiClient.post('/api/vault/unlock/', { pin }),
  createVaultItem: (pin: string, data: {
    section: string
    title: string
    value?: string
    url?: string
    notes?: string
    tags?: string[]
    order?: number
  }) => apiClient.post('/api/vault/items/', data, { headers: { 'X-Vault-Pin': pin } }),
  deleteVaultItem: (pin: string, id: number) =>
    apiClient.delete(`/api/vault/items/${id}/`, { headers: { 'X-Vault-Pin': pin } }),
  submitContact: (data: {
    name: string
    email: string
    company?: string
    message: string
    website?: string
  }) => apiClient.post('/api/contact/', data),
  bookMeeting: (data: {
    name: string
    email: string
    date: string
    time: string
    duration: string
    topic: string
    notes?: string
  }) => apiClient.post('/api/meeting/', data),
}
