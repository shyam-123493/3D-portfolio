# Ghanshyam Desale — 3D Portfolio

> **Inside Ghanshyam.exe** — An interactive engineering universe that communicates high-performance digital product development across fintech and enterprise platforms.

Live at: `https://ghanshyam.dev` *(update after deployment)*

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS |
| 3D | React Three Fiber, Three.js, Drei |
| Animation | GSAP, Framer Motion, Lenis |
| State | Zustand |
| Routing | React Router v7 |
| Data fetching | TanStack Query |
| Forms | React Hook Form + Zod |
| Backend | Django 4.2, Django REST Framework |
| Database | PostgreSQL 16 |
| Infrastructure | Docker Compose, WhiteNoise, Gunicorn |
| Testing | Vitest, Playwright, pytest-django |

---

## Quick Start (Docker — Recommended)

```bash
# Clone
git clone <repo-url>
cd 3D_Portfolio

# Copy and edit environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# Start everything
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api/
- Django Admin: http://localhost:8000/admin/

---

## Manual Setup

### Backend

```bash
cd backend

# Create virtualenv
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

pip install -r requirements.txt

# Copy and configure .env
cp .env.example .env
# Edit .env with your SECRET_KEY and DATABASE_URL

# Run migrations
python manage.py migrate

# Load seed data
python manage.py loaddata fixtures/initial_data.json

# Create superuser for admin
python manage.py createsuperuser

# Start dev server
python manage.py runserver
```

### Frontend

```bash
cd frontend

npm install

# Copy env
cp .env.example .env.local

npm run dev
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `SECRET_KEY` | Yes | Django secret key |
| `DEBUG` | Yes | `True` for development |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `ALLOWED_HOSTS` | Yes | Comma-separated hostnames |
| `CORS_ALLOWED_ORIGINS` | Yes | Frontend origin(s) |
| `EMAIL_HOST` | No | SMTP host for contact notifications |
| `EMAIL_HOST_USER` | No | SMTP username |
| `EMAIL_HOST_PASSWORD` | No | SMTP password / app password |
| `CONTACT_NOTIFICATION_EMAIL` | No | Where to send contact alerts |

### Frontend (`frontend/.env.local`)

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Django backend URL |
| `VITE_ENABLE_3D` | Set `false` to disable WebGL globally |

---

## API Reference

### Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/projects/` | List all projects (paginated) |
| GET | `/api/projects/:slug/` | Project detail with contributions, tech, architecture |
| GET | `/api/experience/` | Career timeline entries |
| GET | `/api/achievements/` | Achievements list |
| GET | `/api/certifications/` | Certifications list |
| GET | `/api/site-settings/` | Site metadata (name, email, resume URL) |
| POST | `/api/contact/` | Submit contact form |

### Contact form payload

```json
{
  "name": "string (required, min 2)",
  "email": "string (required, valid email)",
  "company": "string (optional)",
  "message": "string (required, min 20)",
  "website": "string (honeypot, leave blank)"
}
```

---

## Adding a New Project via Django Admin

1. Open `http://localhost:8000/admin/`
2. Navigate to **Projects → Projects → Add Project**
3. Fill in: title, role, domain, description, challenge, solution, color (hex), featured status, order
4. In the **Contributions** inline: add bullet-point contributions in order
5. In the **Technologies** inline: add each tech with its category
6. In the **Architecture Layers** inline (optional): add layered architecture diagram data
7. Save — the API and frontend will reflect changes immediately (TanStack Query has 5-minute stale time)

---

## Running Tests

### Backend

```bash
cd backend
pytest
```

### Frontend unit tests

```bash
cd frontend
npm run test
```

### Frontend e2e (Playwright)

```bash
cd frontend
npx playwright install
npm run test:e2e
```

---

## Deployment

### Frontend → Vercel

1. Connect your GitHub repository to Vercel
2. Set **Root Directory** to `frontend`
3. Add environment variables in Vercel dashboard:
   - `VITE_API_BASE_URL` → your backend URL
4. Deploy — Vercel auto-detects Vite

### Backend → Railway or Render

**Railway:**
```bash
# In Railway dashboard:
# - New project from GitHub → select backend folder
# - Set environment variables from .env.example
# - Add a PostgreSQL database and copy DATABASE_URL
# - Railway auto-detects the Dockerfile
```

**Render:**
- New Web Service → Docker → select `./backend`
- Add environment variables
- Attach a Render PostgreSQL database

### Database → Managed PostgreSQL

- **Railway:** Add PostgreSQL plugin, copy `DATABASE_URL`
- **Render:** Render PostgreSQL service
- **Supabase / Neon:** External PostgreSQL, update `DATABASE_URL`

### After first deployment

```bash
# Run once after deploy to seed data
python manage.py migrate
python manage.py loaddata fixtures/initial_data.json
python manage.py createsuperuser
```

---

## Project Structure

```
3D_Portfolio/
├── frontend/
│   ├── public/                  # Static assets, favicon
│   └── src/
│       ├── app/                 # Router
│       ├── components/
│       │   ├── layout/          # Layout wrapper + Lenis scroll
│       │   └── ui/              # NavBar, SectionHeading, Button
│       ├── features/
│       │   ├── hero/            # Boot sequence + hero section
│       │   ├── journey/         # Career timeline
│       │   ├── project-universe/ # 3D project explorer + detail panel
│       │   ├── engineering-systems/ # Problem→Approach→Outcome grid
│       │   ├── ai-lab/          # AI tools showcase
│       │   ├── achievements/    # Achievement archive
│       │   ├── contact/         # Contact form + info
│       │   └── recruiter-view/  # Slide-in recruiter summary
│       ├── three/
│       │   ├── scenes/          # HeroScene, JourneyScene, ProjectUniverseScene
│       │   ├── hooks/           # useWebGL detection
│       │   └── utils/           # performance helpers
│       ├── services/            # Axios API client
│       ├── stores/              # Zustand (uiStore, sceneStore)
│       ├── types/               # TypeScript interfaces
│       ├── data/                # Local seed data (used before API is connected)
│       └── styles/              # Tailwind + CSS custom properties
│
├── backend/
│   ├── portfolio_backend/       # Django project
│   │   └── settings/            # base / development / production
│   ├── apps/
│   │   ├── core/                # SiteSettings singleton
│   │   ├── projects/            # Project, Contribution, Technology, Architecture
│   │   ├── experience/          # Career timeline entries
│   │   ├── achievements/        # Achievements + Certifications
│   │   └── contact/             # Contact submission with honeypot + rate limit
│   ├── fixtures/                # Seed data
│   └── pytest.ini
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## 3D Performance Notes

- WebGL support is detected at startup; a clean 2D fallback renders if unsupported
- Device pixel ratio is capped (high: 2×, medium: 1.5×, low: 1×)
- Particle counts scale with quality level (high/medium/low)
- `prefers-reduced-motion` disables all 3D and animation
- Three.js scenes lazy-load behind `React.Suspense`
- All geometries, materials, and event listeners are disposed on unmount

---

## Accessibility

- All content is readable as semantic HTML independent of WebGL
- Focus management and keyboard navigation throughout
- ARIA roles on dialogs, navigation, and alerts
- Honeypot spam protection on contact form
- Form errors announced via `role="alert"`
- Target: Lighthouse accessibility ≥ 90

---

## Known Limitations & Recommended Improvements

| Area | Current State | Improvement |
|------|--------------|-------------|
| Authentication | No admin JWT | Add `simplejwt` for protected write endpoints |
| Resume | Static file reference | Upload via Django Admin with Cloudinary/S3 |
| Search/SEO | No SSR | Add Vite SSR or migrate to Next.js for meta/OG |
| CI/CD | Manual deploy | Add GitHub Actions → Vercel + Railway |
| Monitoring | None | Add Sentry (frontend + backend) |
| Caching | None | Add Redis + Django cache framework |
| Analytics | None | Add Plausible or PostHog (privacy-first) |
| 3D assets | Procedural only | Add compressed GLTF models with DRACO |

---

*Built by Ghanshyam Desale · Mumbai, India · 2025*
