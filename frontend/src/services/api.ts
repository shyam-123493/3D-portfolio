import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
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
  getProjects: () => apiClient.get('/api/projects/'),
  getProject: (slug: string) => apiClient.get(`/api/projects/${slug}/`),
  getExperience: () => apiClient.get('/api/experience/'),
  getAchievements: () => apiClient.get('/api/achievements/'),
  getCertifications: () => apiClient.get('/api/certifications/'),
  getSiteSettings: () => apiClient.get('/api/site-settings/'),
  submitContact: (data: {
    name: string
    email: string
    company?: string
    message: string
    website?: string
  }) => apiClient.post('/api/contact/', data),
}
