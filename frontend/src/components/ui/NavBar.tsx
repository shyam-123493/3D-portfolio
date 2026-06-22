import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { useUIStore } from '@/stores/uiStore'
import { useSiteSettings } from '@/hooks/usePortfolioData'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '#projects',    label: 'Work',       id: 'projects' },
  { href: '#engineering', label: 'Services',   id: 'engineering' },
  { href: '#journey',     label: 'About',      id: 'journey' },
  { href: '#journey',     label: 'Experience', id: 'journey' },
]

function useActiveSection() {
  const [active, setActive] = useState('hero')

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]')
    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-30% 0px -70% 0px', threshold: 0 },
    )

    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  return active
}

export function NavBar() {
  const { navOpen, toggleNav, setNavOpen, scrollY, bootComplete, theme, toggleTheme } = useUIStore()
  const navRef = useRef<HTMLElement>(null)
  const location = useLocation()
  const { data: settings } = useSiteSettings()
  const activeSection = useActiveSection()

  const firstName = settings?.name?.split(' ')[0] ?? 'Ghanshyam'
  const scrolled = scrollY > 60

  useEffect(() => {
    setNavOpen(false)
  }, [location, setNavOpen])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setNavOpen(false)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [setNavOpen])

  if (!bootComplete) return null

  return (
    <header
      ref={navRef}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-400',
        scrolled
          ? 'bg-bg-primary/94 backdrop-blur-md border-b border-border-subtle'
          : 'bg-transparent',
      )}
      role="banner"
    >
      <nav
        className="section-padding flex items-center justify-between h-14 sm:h-16"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          to="/"
          className="font-serif italic text-lg text-text-primary hover:text-accent-teal transition-colors flex-shrink-0"
          aria-label={`${settings?.name ?? 'Ghanshyam Desale'} — Home`}
        >
          {firstName}
        </Link>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-1" role="list">
          {NAV_LINKS.map((link, i) => {
            const isActive = activeSection === link.id
            return (
              <li key={link.label + i}>
                <a
                  href={link.href}
                  className={cn(
                    'font-sans text-[13px] px-4 py-2 rounded-lg transition-colors duration-150',
                    isActive
                      ? 'text-text-primary'
                      : 'text-text-muted hover:text-text-primary hover:bg-bg-surface/50',
                  )}
                >
                  {link.label}
                </a>
              </li>
            )
          })}
        </ul>

        {/* Right side: theme toggle + CTA */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          >
            {theme === 'dark'
              ? <Sun size={15} strokeWidth={1.8} />
              : <Moon size={15} strokeWidth={1.8} />
            }
          </button>

          {/* Let's talk CTA — hidden on small mobile */}
          <a
            href="#contact"
            className="hidden sm:inline-flex font-sans text-[12px] font-semibold rounded-full px-4 py-2 hover:opacity-90 transition-opacity"
            style={{ background: 'var(--c-teal)', color: 'var(--c-bg)' }}
          >
            Let's talk
          </a>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden text-text-secondary hover:text-text-primary transition-colors p-1"
            onClick={toggleNav}
            aria-expanded={navOpen}
            aria-controls="mobile-nav"
            aria-label={navOpen ? 'Close menu' : 'Open menu'}
          >
            {navOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {navOpen && (
        <div
          id="mobile-nav"
          className="lg:hidden bg-bg-secondary border-b border-border-subtle"
          role="dialog"
          aria-label="Mobile navigation"
        >
          <ul className="section-padding py-5 flex flex-col gap-3" role="list">
            {NAV_LINKS.map((link, i) => (
              <li key={link.label + i}>
                <a
                  href={link.href}
                  className={cn(
                    'font-sans text-[15px] transition-colors block py-1',
                    activeSection === link.id
                      ? 'text-text-primary font-medium'
                      : 'text-text-secondary hover:text-text-primary',
                  )}
                  onClick={() => setNavOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="pt-3 border-t border-border-subtle">
              <a
                href="#contact"
                onClick={() => setNavOpen(false)}
                className="font-sans text-sm font-semibold rounded-full px-5 py-2.5 inline-block transition-opacity hover:opacity-90"
                style={{ background: 'var(--c-teal)', color: 'var(--c-bg)' }}
              >
                Let's talk
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
