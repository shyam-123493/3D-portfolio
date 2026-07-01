// ──────────────────────────────────────────────────────────────────────────────
// Personal / side-project data — edit freely, all types are inferred below.
// media.src  →  path relative to /public  e.g. "/projects/my-app.png"
// ──────────────────────────────────────────────────────────────────────────────

export interface PersonalProject {
  id: string
  title: string
  tagline: string
  description: string
  tech: string[]
  color: string
  media?: { type: 'image' | 'video'; src: string; alt?: string }
  links?: { github?: string; live?: string; demo?: string }
  status: 'live' | 'wip' | 'archived'
  year: number
}

export const personalProjects: PersonalProject[] = [
  {
    id: '3d-portfolio',
    title: '3D Portfolio',
    tagline: "The one you're looking at",
    description:
      'Full-stack personal portfolio with React Three Fiber 3D scenes, glassmorphism UI, Django REST backend, and real-time contact form.',
    tech: ['React 18', 'Three.js', 'Django', 'TypeScript', 'Framer Motion', 'Vite'],
    color: '#6FE3D2',
    status: 'live',
    year: 2025,
    links: { github: 'https://github.com/ghanshyam' },
  },
  {
    id: 'ai-chat-tool',
    title: 'AI Chat Tool',
    tagline: 'GPT-powered workspace assistant',
    description:
      'Lightweight OpenAI-powered chat assistant with streaming responses, markdown rendering, and conversation history.',
    tech: ['React', 'OpenAI API', 'Node.js', 'TailwindCSS', 'Zustand'],
    color: '#8B7DFF',
    status: 'wip',
    year: 2025,
    links: {},
  },
  {
    id: 'expense-tracker',
    title: 'Expense Tracker',
    tagline: 'Angular PWA for daily budgets',
    description:
      'Offline-first Progressive Web App built with Angular 17 and IndexedDB, with charts, category filters, and export to CSV.',
    tech: ['Angular 17', 'IndexedDB', 'PWA', 'Chart.js', 'SCSS'],
    color: '#F59E0B',
    status: 'live',
    year: 2024,
    links: { github: 'https://github.com/ghanshyam' },
  },
  {
    id: 'devtools-ext',
    title: 'DevTools Extension',
    tagline: 'Browser extension for rapid snippets',
    description:
      'Chrome extension that stores code snippets, terminal commands, and API endpoints in categorised local storage with quick-copy.',
    tech: ['Manifest V3', 'Vanilla JS', 'Chrome Extension API', 'IndexedDB'],
    color: '#38BDF8',
    status: 'wip',
    year: 2025,
    links: {},
  },
]
