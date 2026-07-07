import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Copy, Check, ExternalLink, Lock, Loader2, AlertCircle, Plus, Trash2 } from 'lucide-react'
import { useVaultStore } from '@/stores/vaultStore'
import {
  useVaultUnlock,
  useVaultItemCreate,
  useVaultItemDelete,
  type VaultSectionAPI,
  type VaultItemAPI,
} from '@/hooks/usePortfolioData'

const PIN_LENGTH = 4

// ── PIN gate ────────────────────────────────────────────────────────────────
function PinGate({ onUnlock }: { onUnlock: (sections: VaultSectionAPI[], pin: string) => void }) {
  const [pin, setPin]     = useState('')
  const [shake, setShake] = useState(false)
  const close             = useVaultStore((s) => s.close)
  const { mutate, isPending, isError, reset } = useVaultUnlock()

  const attempt = (value: string) => {
    if (value.length < PIN_LENGTH) return
    mutate(value, {
      onSuccess: (sections) => onUnlock(sections, value),
      onError: () => {
        setShake(true)
        setPin('')
        setTimeout(() => { setShake(false); reset() }, 700)
      },
    })
  }

  const handleKey = (k: string) => {
    if (isPending) return
    if (k === 'del') { setPin((p) => p.slice(0, -1)); return }
    const next = pin + k
    if (next.length > PIN_LENGTH) return
    setPin(next)
    if (next.length === PIN_LENGTH) attempt(next)
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8">
      {/* Header */}
      <div className="text-center">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{ background: 'rgba(111,227,210,0.12)', border: '1px solid rgba(111,227,210,0.25)' }}
        >
          <Lock size={22} style={{ color: 'var(--c-teal)' }} />
        </div>
        <p className="font-mono text-[11px] tracking-[0.22em] uppercase mb-1" style={{ color: 'var(--c-text-muted)' }}>
          Vault Access
        </p>
        <p className="font-mono text-xs" style={{ color: 'var(--c-text-muted)' }}>
          Enter PIN to continue
        </p>
      </div>

      {/* PIN dots */}
      <motion.div
        className="flex gap-3"
        animate={shake ? { x: [0, -8, 8, -6, 6, 0] } : {}}
        transition={{ duration: 0.5 }}
      >
        {Array.from({ length: PIN_LENGTH }).map((_, i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-full transition-all duration-200"
            style={{
              background: i < pin.length
                ? (isError ? '#EF4444' : 'var(--c-teal)')
                : 'rgba(255,255,255,0.12)',
              boxShadow: i < pin.length && !isError
                ? '0 0 12px rgba(111,227,210,0.6)'
                : 'none',
            }}
          />
        ))}
      </motion.div>

      {/* Error / loading hint */}
      <AnimatePresence>
        {isError && (
          <motion.div
            className="flex items-center gap-2 font-mono text-[11px]"
            style={{ color: '#EF4444' }}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <AlertCircle size={13} />
            Wrong PIN — try again
          </motion.div>
        )}
      </AnimatePresence>

      {/* Numpad */}
      <div className="grid grid-cols-3 gap-3">
        {['1','2','3','4','5','6','7','8','9','','0','del'].map((k) => (
          <button
            key={k}
            disabled={!k || isPending}
            onClick={() => k && handleKey(k)}
            className="w-16 h-16 rounded-xl font-mono text-base font-medium transition-all duration-150 disabled:opacity-40"
            style={{
              background: k === 'del' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: k === 'del' ? 'var(--c-text-muted)' : 'var(--c-text)',
            }}
            onMouseEnter={(e) => {
              if (!k) return
              ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(111,227,210,0.12)'
              ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(111,227,210,0.3)'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.background =
                k === 'del' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.07)'
              ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.1)'
            }}
          >
            {isPending && k === '0' ? <Loader2 size={16} className="animate-spin mx-auto" /> : k === 'del' ? '⌫' : k}
          </button>
        ))}
      </div>

      <button
        onClick={close}
        className="font-mono text-[10px] tracking-widest uppercase transition-colors"
        style={{ color: 'var(--c-text-muted)' }}
      >
        Cancel
      </button>
    </div>
  )
}

// ── Vault item row ──────────────────────────────────────────────────────────
function ItemRow({ item, onDelete, isDeleting }: {
  item: VaultItemAPI
  onDelete: () => void
  isDeleting: boolean
}) {
  const [copied, setCopied] = useState(false)
  const [armed, setArmed] = useState(false)

  // Two-click delete: first click arms (turns red), second click deletes.
  // Auto-disarms after 2.5s so a stray click can't linger.
  useEffect(() => {
    if (!armed) return
    const t = setTimeout(() => setArmed(false), 2500)
    return () => clearTimeout(t)
  }, [armed])

  const handleDeleteClick = () => {
    if (isDeleting) return
    if (!armed) { setArmed(true); return }
    setArmed(false)
    onDelete()
  }

  const copy = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div
      className="flex items-start gap-3 px-4 py-3 rounded-lg group transition-all duration-150"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLDivElement).style.background = 'rgba(111,227,210,0.05)'
        ;(e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(111,227,210,0.15)'
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.03)'
        ;(e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.05)'
      }}
    >
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <span className="font-mono text-[13px] font-medium" style={{ color: 'var(--c-text)' }}>
            {item.title}
          </span>
          {item.tags?.map((t) => (
            <span
              key={t}
              className="font-mono text-[9px] px-1.5 py-0.5 rounded"
              style={{ background: 'rgba(111,227,210,0.1)', color: 'var(--c-teal)', letterSpacing: '0.1em' }}
            >
              {t}
            </span>
          ))}
        </div>
        {item.value && (
          <p className="font-mono text-[11px] mt-0.5" style={{ color: 'var(--c-teal)' }}>
            {item.value}
          </p>
        )}
        {item.notes && (
          <p className="font-mono text-[11px] mt-0.5" style={{ color: 'var(--c-text-muted)' }}>
            {item.notes}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        {item.value && (
          <button
            onClick={() => copy(item.value)}
            aria-label="Copy value"
            className="w-7 h-7 rounded-md flex items-center justify-center transition-all hover:bg-white/10"
          >
            {copied ? (
              <Check size={12} style={{ color: 'var(--c-teal)' }} />
            ) : (
              <Copy size={12} style={{ color: 'var(--c-text-muted)' }} />
            )}
          </button>
        )}
        {item.url && (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open link"
            className="w-7 h-7 rounded-md flex items-center justify-center transition-all hover:bg-white/10"
          >
            <ExternalLink size={12} style={{ color: 'var(--c-text-muted)' }} />
          </a>
        )}
        <button
          onClick={handleDeleteClick}
          aria-label={armed ? 'Click again to confirm delete' : `Delete ${item.title}`}
          title={armed ? 'Click again to confirm' : 'Delete item'}
          className="rounded-md flex items-center justify-center transition-all duration-150"
          style={{
            width: armed ? 'auto' : 28,
            height: 28,
            padding: armed ? '0 8px' : 0,
            background: armed ? 'rgba(239,68,68,0.15)' : 'transparent',
            border: armed ? '1px solid rgba(239,68,68,0.4)' : '1px solid transparent',
            color: armed ? '#EF4444' : 'var(--c-text-muted)',
          }}
        >
          {isDeleting ? (
            <Loader2 size={12} className="animate-spin" />
          ) : armed ? (
            <span className="font-mono text-[9px] tracking-wider uppercase whitespace-nowrap flex items-center gap-1">
              <Trash2 size={11} /> sure?
            </span>
          ) : (
            <Trash2 size={12} />
          )}
        </button>
      </div>
    </div>
  )
}

// ── Inline add-item form ────────────────────────────────────────────────────
function AddItemForm({ sectionSlug, pin, nextOrder, onAdded }: {
  sectionSlug: string
  pin: string
  nextOrder: number
  onAdded: (item: VaultItemAPI) => void
}) {
  const [open, setOpen]   = useState(false)
  const [title, setTitle] = useState('')
  const [value, setValue] = useState('')
  const [url, setUrl]     = useState('')
  const [notes, setNotes] = useState('')
  const [tags, setTags]   = useState('')
  const { mutate, isPending, isError, reset } = useVaultItemCreate()

  const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'var(--c-text)',
  }

  const clear = () => {
    setTitle(''); setValue(''); setUrl(''); setNotes(''); setTags('')
    reset()
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || isPending) return
    mutate(
      {
        pin,
        data: {
          section: sectionSlug,
          title: title.trim(),
          value: value.trim(),
          url: url.trim(),
          notes: notes.trim(),
          tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
          order: nextOrder,
        },
      },
      {
        onSuccess: (item) => {
          onAdded(item)
          clear()
          setOpen(false)
        },
      },
    )
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-mono text-[11px] tracking-wider uppercase transition-all duration-150"
        style={{
          border: '1px dashed rgba(111,227,210,0.25)',
          color: 'rgba(111,227,210,0.7)',
          background: 'rgba(111,227,210,0.03)',
        }}
      >
        <Plus size={12} /> Add item
      </button>
    )
  }

  return (
    <motion.form
      onSubmit={submit}
      className="rounded-lg p-4 space-y-2.5"
      style={{ background: 'rgba(111,227,210,0.04)', border: '1px solid rgba(111,227,210,0.18)' }}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title *"
        maxLength={200}
        className="w-full px-3 py-2 rounded-md font-mono text-[12px] outline-none focus:border-teal-400/40"
        style={inputStyle}
      />
      <div className="grid grid-cols-2 gap-2.5">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Value (copyable)"
          maxLength={500}
          className="px-3 py-2 rounded-md font-mono text-[12px] outline-none"
          style={inputStyle}
        />
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="URL (https://…)"
          className="px-3 py-2 rounded-md font-mono text-[12px] outline-none"
          style={inputStyle}
        />
      </div>
      <input
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notes"
        className="w-full px-3 py-2 rounded-md font-mono text-[12px] outline-none"
        style={inputStyle}
      />
      <input
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Tags — comma separated"
        className="w-full px-3 py-2 rounded-md font-mono text-[12px] outline-none"
        style={inputStyle}
      />

      {isError && (
        <p className="font-mono text-[10px] flex items-center gap-1.5" style={{ color: '#EF4444' }}>
          <AlertCircle size={11} /> Failed to add — check the fields (URL must be valid).
        </p>
      )}

      <div className="flex items-center gap-2 pt-1">
        <button
          type="submit"
          disabled={!title.trim() || isPending}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-md font-mono text-[11px] tracking-wider uppercase transition-all disabled:opacity-40"
          style={{ background: 'rgba(111,227,210,0.15)', border: '1px solid rgba(111,227,210,0.35)', color: 'var(--c-teal)' }}
        >
          {isPending ? <Loader2 size={11} className="animate-spin" /> : <Plus size={11} />}
          Save
        </button>
        <button
          type="button"
          onClick={() => { clear(); setOpen(false) }}
          className="px-3 py-1.5 rounded-md font-mono text-[11px] tracking-wider uppercase transition-colors"
          style={{ color: 'var(--c-text-muted)' }}
        >
          Cancel
        </button>
      </div>
    </motion.form>
  )
}

// ── Main vault panel ────────────────────────────────────────────────────────
function VaultPanel({ sections, pin, onSectionsChange }: {
  sections: VaultSectionAPI[]
  pin: string
  onSectionsChange: (updater: (prev: VaultSectionAPI[]) => VaultSectionAPI[]) => void
}) {
  const close      = useVaultStore((s) => s.close)
  const [activeTab, setActiveTab] = useState(sections[0]?.slug ?? '')
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const deleteItem = useVaultItemDelete()

  const section = sections.find((s) => s.slug === activeTab) ?? sections[0]

  const handleDelete = (id: number) => {
    setDeletingId(id)
    deleteItem.mutate(
      { pin, id },
      {
        onSuccess: () =>
          onSectionsChange((prev) =>
            prev.map((s) => ({ ...s, items: s.items.filter((i) => i.id !== id) })),
          ),
        onSettled: () => setDeletingId(null),
      },
    )
  }

  const handleAdded = (slug: string, item: VaultItemAPI) => {
    onSectionsChange((prev) =>
      prev.map((s) => (s.slug === slug ? { ...s, items: [...s.items, item] } : s)),
    )
  }

  // An unlocked-but-empty vault (fresh database, no sections seeded yet) must
  // still render the panel chrome — returning null here leaves the user staring
  // at a bare backdrop with no feedback and no close button.
  if (!section) {
    return (
      <div
        className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-8"
        onClick={(e) => { if (e.target === e.currentTarget) close() }}
      >
        <motion.div
          className="relative w-full max-w-md rounded-2xl overflow-hidden"
          style={{
            background: '#0A0A0E',
            border: '1px solid rgba(111,227,210,0.18)',
            boxShadow: '0 0 80px rgba(111,227,210,0.06), 0 40px 100px rgba(0,0,0,0.6)',
          }}
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
          >
            <span className="font-mono text-[11px] tracking-[0.2em] uppercase" style={{ color: 'var(--c-text-muted)' }}>
              Personal Vault
            </span>
            <button
              onClick={close}
              aria-label="Close vault"
              className="w-7 h-7 rounded-md flex items-center justify-center transition-all hover:bg-white/10"
              style={{ color: 'var(--c-text-muted)' }}
            >
              <X size={14} />
            </button>
          </div>
          <div className="p-8 text-center space-y-3">
            <p className="font-mono text-sm" style={{ color: 'var(--c-text)' }}>
              Vault unlocked — but it's empty.
            </p>
            <p className="font-mono text-[11px] leading-relaxed" style={{ color: 'var(--c-text-muted)' }}>
              No sections exist in the database yet. Seed them with
              <span style={{ color: 'var(--c-teal)' }}> python manage.py seed_vault </span>
              or add sections in the Django admin.
            </p>
            <button
              onClick={close}
              className="mt-2 px-5 py-2 rounded-md font-mono text-[11px] tracking-wider uppercase transition-all"
              style={{ background: 'rgba(111,227,210,0.15)', border: '1px solid rgba(111,227,210,0.35)', color: 'var(--c-teal)' }}
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-8"
      onClick={(e) => { if (e.target === e.currentTarget) close() }}
    >
      <motion.div
        className="relative w-full max-w-3xl max-h-[88vh] flex flex-col rounded-2xl overflow-hidden"
        style={{
          background: '#0A0A0E',
          border: '1px solid rgba(111,227,210,0.18)',
          boxShadow: '0 0 80px rgba(111,227,210,0.06), 0 40px 100px rgba(0,0,0,0.6)',
        }}
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Title bar */}
        <div
          className="flex items-center justify-between px-5 py-4 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: '#FF5F57' }} />
              <div className="w-3 h-3 rounded-full" style={{ background: '#FFBD2E' }} />
              <div className="w-3 h-3 rounded-full" style={{ background: '#28CA42' }} />
            </div>
            <span className="font-mono text-[11px] tracking-[0.2em] uppercase ml-2" style={{ color: 'var(--c-text-muted)' }}>
              Personal Vault
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[9px] tracking-widest uppercase" style={{ color: 'rgba(111,227,210,0.5)' }}>
              ● SECURE
            </span>
            <button
              onClick={close}
              aria-label="Close vault"
              className="w-7 h-7 rounded-md flex items-center justify-center transition-all hover:bg-white/10"
              style={{ color: 'var(--c-text-muted)' }}
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div
          className="flex items-center gap-1 px-4 py-2 overflow-x-auto no-scrollbar flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          {sections.map((sec) => (
            <button
              key={sec.slug}
              onClick={() => setActiveTab(sec.slug)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-[11px] whitespace-nowrap transition-all duration-150"
              style={{
                background: activeTab === sec.slug ? 'rgba(111,227,210,0.12)' : 'transparent',
                color:      activeTab === sec.slug ? 'var(--c-teal)'           : 'var(--c-text-muted)',
                border:     activeTab === sec.slug ? '1px solid rgba(111,227,210,0.25)' : '1px solid transparent',
              }}
            >
              <span>{sec.emoji}</span>
              <span>{sec.label}</span>
            </button>
          ))}
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              className="space-y-2"
            >
              {section.items.length === 0 && (
                <p className="font-mono text-[11px] text-center py-6" style={{ color: 'rgba(255,255,255,0.2)' }}>
                  No items yet — add one below.
                </p>
              )}
              {section.items.map((item) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  onDelete={() => handleDelete(item.id)}
                  isDeleting={deletingId === item.id}
                />
              ))}
              <AddItemForm
                key={section.slug}
                sectionSlug={section.slug}
                pin={pin}
                nextOrder={section.items.length}
                onAdded={(item) => handleAdded(section.slug, item)}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer bar */}
        <div
          className="flex items-center justify-between px-5 py-3 flex-shrink-0"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <p className="font-mono text-[9px] tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.18)' }}>
            {section.items.length} items · {section.label}
          </p>
          <p className="font-mono text-[9px] tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.18)' }}>
            ESC to close
          </p>
        </div>
      </motion.div>
    </div>
  )
}

// ── Root export ─────────────────────────────────────────────────────────────
export function Vault() {
  const { isOpen, close } = useVaultStore()
  const [sections, setSections] = useState<VaultSectionAPI[] | null>(null)
  // PIN kept in memory only, for authenticating add/delete requests —
  // wiped together with the data when the vault closes
  const [pin, setPin] = useState('')

  // Reset sections when vault closes so user must PIN again next time
  useEffect(() => {
    if (!isOpen) {
      setSections(null)
      setPin('')
    }
  }, [isOpen])

  // Escape lives here, not in the panel, so it closes the vault from every
  // state — PIN gate, item panel, or the empty-vault notice
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, close])

  // Portalled to <body>: inside <main> (zIndex: 1 stacking context) the
  // overlay would sit below the fixed NavBar regardless of its own z-index
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="vault-backdrop"
          className="fixed inset-0 z-[99998]"
          style={{ background: 'rgba(5,5,6,0.82)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {sections ? (
            <VaultPanel
              sections={sections}
              pin={pin}
              onSectionsChange={(updater) => setSections((prev) => (prev ? updater(prev) : prev))}
            />
          ) : (
            <PinGate onUnlock={(s, p) => { setSections(s); setPin(p) }} />
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
