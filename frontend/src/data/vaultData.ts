// ──────────────────────────────────────────────────────────────────────────────
// VAULT — Personal data store (not public-facing, accessed via Easter egg).
// Add / remove items freely. Tags are optional labels shown as badges.
// ──────────────────────────────────────────────────────────────────────────────

export interface VaultItem {
  title: string
  value?: string    // short copyable value (shortcut key, ID, version, etc.)
  url?: string      // opens in new tab on click
  notes?: string    // small hint text shown below
  tags?: string[]
}

export interface VaultSection {
  id: string
  label: string
  emoji: string
  items: VaultItem[]
}

// ─── CHANGE THIS to lock the vault ──────────────────────────────────────────
export const VAULT_PIN = '2025'

export const vaultSections: VaultSection[] = [
  // ── Browser Extensions ────────────────────────────────────────────────────
  {
    id: 'extensions',
    label: 'Extensions',
    emoji: '🧩',
    items: [
      {
        title: 'Redux DevTools',
        url: 'https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd',
        tags: ['Chrome', 'React', 'Debug'],
      },
      {
        title: 'React Developer Tools',
        url: 'https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi',
        tags: ['Chrome', 'React'],
      },
      {
        title: 'Angular DevTools',
        url: 'https://chrome.google.com/webstore/detail/angular-devtools/ienfalfjdbdpebioblfackkekamfmbnh',
        tags: ['Chrome', 'Angular'],
      },
      {
        title: 'Wappalyzer',
        url: 'https://www.wappalyzer.com/',
        tags: ['Chrome', 'Recon'],
        notes: 'Detect tech stack of any site',
      },
      {
        title: 'JSON Formatter',
        url: 'https://chrome.google.com/webstore/detail/json-formatter/bcjindcccaagfpapjjmafapmmgkkhgoa',
        tags: ['Chrome', 'API'],
      },
      {
        title: 'Pesticide',
        url: 'https://chrome.google.com/webstore/detail/pesticide-for-chrome-with/neonnmdfbnmpaldkpadhljgklajlmhkc',
        tags: ['Chrome', 'CSS', 'Debug'],
        notes: 'Outline all elements for layout debugging',
      },
      {
        title: 'VisBug',
        url: 'https://chrome.google.com/webstore/detail/visbug/cdockenadnadldjbbgcallicgledbeoc',
        tags: ['Chrome', 'Design'],
        notes: 'Design tools directly in the browser',
      },
      {
        title: 'uBlock Origin',
        url: 'https://chrome.google.com/webstore/detail/ublock-origin/cjpalhdlnbpafiamejdnhcphjbkeiagm',
        tags: ['Chrome', 'Privacy'],
      },
    ],
  },

  // ── Certificates ─────────────────────────────────────────────────────────
  {
    id: 'certs',
    label: 'Certificates',
    emoji: '📜',
    items: [
      {
        title: 'Angular Certification',
        value: 'Add your cert ID here',
        notes: 'Add expiry / issuer info here',
        tags: ['Angular', 'Google'],
      },
      {
        title: 'AWS Cloud Practitioner',
        value: 'Add your cert ID here',
        notes: 'Add expiry date here',
        tags: ['AWS', 'Cloud'],
      },
      {
        title: 'Add more certificates here',
        notes: 'Edit vaultData.ts to fill in your real certificates',
        tags: [],
      },
    ],
  },

  // ── Keyboard Shortcuts ────────────────────────────────────────────────────
  {
    id: 'shortcuts',
    label: 'Shortcuts',
    emoji: '⌨️',
    items: [
      { title: 'VS Code — Format Document',        value: 'Shift + Alt + F',      tags: ['VSCode'] },
      { title: 'VS Code — Open Terminal',           value: 'Ctrl + `',             tags: ['VSCode'] },
      { title: 'VS Code — Multi-cursor',            value: 'Ctrl + Alt + ↑/↓',    tags: ['VSCode'] },
      { title: 'VS Code — Rename Symbol',           value: 'F2',                   tags: ['VSCode'] },
      { title: 'VS Code — Go to Definition',        value: 'F12',                  tags: ['VSCode'] },
      { title: 'VS Code — Quick Fix',               value: 'Ctrl + .',             tags: ['VSCode'] },
      { title: 'VS Code — Toggle Sidebar',          value: 'Ctrl + B',             tags: ['VSCode'] },
      { title: 'Chrome — Open DevTools',            value: 'F12 / Ctrl+Shift+I',   tags: ['Chrome'] },
      { title: 'Chrome — Network tab throttle',     value: 'DevTools → Network',   tags: ['Chrome'] },
      { title: 'Git — Amend last commit msg',       value: 'git commit --amend',   tags: ['Git'] },
      { title: 'Git — Stash with message',          value: 'git stash push -m "msg"', tags: ['Git'] },
      { title: 'Git — Interactive rebase',          value: 'git rebase -i HEAD~N', tags: ['Git'] },
      { title: 'Windows — Snap left/right',         value: 'Win + ←/→',            tags: ['Windows'] },
      { title: 'Windows — Virtual desktop',         value: 'Win + Ctrl + D',       tags: ['Windows'] },
    ],
  },

  // ── Git Repositories ─────────────────────────────────────────────────────
  {
    id: 'repos',
    label: 'Git Repos',
    emoji: '📦',
    items: [
      {
        title: '3D Portfolio',
        url: 'https://github.com/shyam-123493',
        value: 'main',
        notes: 'This project — React + Django',
        tags: ['Personal'],
      },
      {
        title: 'Add your repos here',
        notes: 'Edit vaultData.ts → repos section',
        tags: [],
      },
    ],
  },

  // ── Useful Links ─────────────────────────────────────────────────────────
  {
    id: 'links',
    label: 'Links',
    emoji: '🔗',
    items: [
      { title: 'TailwindCSS Docs',      url: 'https://tailwindcss.com/docs',                       tags: ['CSS'] },
      { title: 'React Three Fiber',     url: 'https://docs.pmnd.rs/react-three-fiber',             tags: ['3D'] },
      { title: 'Framer Motion API',     url: 'https://www.framer.com/motion/',                     tags: ['Animation'] },
      { title: 'GSAP Docs',             url: 'https://gsap.com/docs/v3/',                          tags: ['Animation'] },
      { title: 'Three.js Examples',     url: 'https://threejs.org/examples/',                      tags: ['3D'] },
      { title: 'Lucide Icons',          url: 'https://lucide.dev/icons/',                          tags: ['Icons'] },
      { title: 'Coolors Palette',       url: 'https://coolors.co/',                                tags: ['Design'] },
      { title: 'Can I Use',             url: 'https://caniuse.com/',                               tags: ['CSS'] },
      { title: 'Bundlephobia',          url: 'https://bundlephobia.com/',                          tags: ['Perf'] },
      { title: 'regex101',              url: 'https://regex101.com/',                              tags: ['Tools'] },
      { title: 'JWT Decoder',           url: 'https://jwt.io/',                                    tags: ['Auth', 'Tools'] },
      { title: 'TanStack Query Docs',   url: 'https://tanstack.com/query/latest/docs',             tags: ['React'] },
      { title: 'Zustand Docs',          url: 'https://docs.pmnd.rs/zustand/getting-started/introduction', tags: ['React'] },
      { title: 'MDN Web Docs',          url: 'https://developer.mozilla.org/',                     tags: ['Reference'] },
      { title: 'shadcn/ui Components',  url: 'https://ui.shadcn.com/docs/components',              tags: ['UI'] },
    ],
  },

  // ── Notes / Misc ─────────────────────────────────────────────────────────
  {
    id: 'notes',
    label: 'Notes',
    emoji: '📝',
    items: [
      {
        title: 'Local dev ports',
        value: 'Frontend: 5173 | Backend: 8000',
        notes: 'npm run dev  |  python manage.py runserver 0.0.0.0:8000',
        tags: ['Dev'],
      },
      {
        title: 'Railway deploy',
        notes: 'Push to main → Railway auto-deploys backend',
        tags: ['Deploy'],
      },
      {
        title: 'Vercel deploy',
        notes: 'Push to main → Vercel auto-deploys frontend',
        tags: ['Deploy'],
      },
      {
        title: 'Add your own notes here',
        notes: 'Edit vaultData.ts → notes section',
        tags: [],
      },
    ],
  },
]
