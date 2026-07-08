import { useState, useMemo, CSSProperties } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Clock, Video, Globe, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react'
import { useMeetingMutation } from '@/hooks/usePortfolioData'
import { useUIStore } from '@/stores/uiStore'

// ── Theme helper ──────────────────────────────────────────────────────────────
function useBookingColors() {
  const theme = useUIStore((s) => s.theme)
  const d = theme === 'dark'
  return {
    bg:              d ? '#111114' : '#ffffff',
    bgPanel:         d ? '#0B0B0D' : '#f9fafb',
    text:            d ? '#F0EFE9' : '#111111',
    textMuted:       d ? '#9CA3AF' : '#6b7280',
    textFaint:       d ? '#6B7280' : '#9ca3af',
    border:          d ? '#27272C' : '#e5e7eb',
    dayHover:        d ? 'rgba(111,227,210,0.09)' : '#f3f4f6',
    daySelected:     d ? '#6FE3D2' : '#111111',
    daySelectedText: d ? '#050506' : '#ffffff',
    dayTodayBorder:  d ? '#6FE3D2' : '#111111',
    durationActive:  d ? '#6FE3D2' : '#111111',
    durationActText: d ? '#050506' : '#ffffff',
    durationInact:   d ? 'transparent' : 'transparent',
    durationInactText:d? '#9CA3AF'   : '#6b7280',
    durationBorder:  d ? '#27272C' : '#d1d5db',
    timeHoverBorder: d ? '#6FE3D2' : '#374151',
    timeSelected:    d ? '#6FE3D2' : '#111111',
    timeSelectedText:d ? '#050506' : '#ffffff',
    inputBg:         d ? '#0B0B0D' : '#ffffff',
    inputBorder:     d ? '#27272C' : '#e5e7eb',
    inputFocus:      d ? '#6FE3D2' : '#374151',
    inputPlaceholder:d ? '#4B5563' : '#9ca3af',
    submitBg:        d ? '#6FE3D2' : '#111111',
    submitText:      d ? '#050506' : '#ffffff',
    labelColor:      d ? '#9CA3AF' : '#4b5563',
    iconColor:       d ? '#6B7280' : '#9ca3af',
    shadow:          d ? '0 24px 64px rgba(0,0,0,0.55)' : '0 24px 64px rgba(0,0,0,0.1)',
    confirmGreen:    d ? 'rgba(16,185,129,0.12)' : '#f0fdf4',
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAYS   = ['SUN','MON','TUE','WED','THU','FRI','SAT']
const DURATIONS = [{ label: '30m', value: '30' }, { label: '45m', value: '45' }, { label: '1h', value: '60' }]

function getCalendarCells(year: number, month: number) {
  const firstDay    = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const prevDays    = new Date(year, month, 0).getDate()
  const cells: { day: number; inMonth: boolean; date: Date | null }[] = []

  for (let i = 0; i < firstDay; i++)
    cells.push({ day: prevDays - firstDay + 1 + i, inMonth: false, date: null })
  for (let d = 1; d <= daysInMonth; d++)
    cells.push({ day: d, inMonth: true, date: new Date(year, month, d) })
  while (cells.length % 7 !== 0)
    cells.push({ day: cells.length - (firstDay + daysInMonth) + 1, inMonth: false, date: null })

  return cells
}

function getTimeSlots(date: Date): string[] {
  const dow = date.getDay()
  const isWeekend = dow === 0 || dow === 6
  const start = isWeekend ? 11 : 10
  const end   = isWeekend ? 15 : 18
  const now   = new Date()
  const isToday = date.toDateString() === now.toDateString()
  const slots: string[] = []

  for (let h = start; h < end; h++) {
    for (const m of [0, 30]) {
      if (isToday && (h < now.getHours() || (h === now.getHours() && m <= now.getMinutes()))) continue
      const h12  = h > 12 ? h - 12 : h === 0 ? 12 : h
      const ampm = h >= 12 ? 'pm' : 'am'
      slots.push(`${h12}:${m === 0 ? '00' : '30'}${ampm}`)
    }
  }
  return slots
}

function formatDateLong(d: Date) {
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

// ── Step 1: Calendar ──────────────────────────────────────────────────────────
function CalendarStep({ onSelect }: { onSelect: (date: Date, time: string, duration: string) => void }) {
  const c = useBookingColors()
  const now     = new Date()
  const [year, setYear]     = useState(now.getFullYear())
  const [month, setMonth]   = useState(now.getMonth())
  const [duration, setDuration] = useState('30')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  const cells     = useMemo(() => getCalendarCells(year, month), [year, month])
  const timeSlots = useMemo(() => selectedDate ? getTimeSlots(selectedDate) : [], [selectedDate])

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
    setSelectedDate(null); setSelectedTime(null)
  }
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
    setSelectedDate(null); setSelectedTime(null)
  }

  const isPast = (date: Date | null) => {
    if (!date) return true
    const d = new Date(date); d.setHours(23, 59, 59, 999)
    return d < now
  }
  const isToday = (date: Date | null) => date?.toDateString() === now.toDateString()

  const handleTimeSelect = (t: string) => {
    setSelectedTime(t)
    if (selectedDate) onSelect(selectedDate, t, duration)
  }

  return (
    <div
      className="flex flex-col sm:flex-row rounded-2xl overflow-hidden"
      style={{ background: c.bg, color: c.text, boxShadow: c.shadow }}
    >
      {/* ── Left panel ── */}
      <div
        className="sm:w-[240px] flex-shrink-0 p-6 flex flex-col gap-5 border-b sm:border-b-0 sm:border-r"
        style={{ background: c.bgPanel, borderColor: c.border }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, var(--c-teal), var(--c-violet))', color: '#050506' }}
          >
            GD
          </div>
          <div>
            <p className="font-semibold text-sm" style={{ color: c.text }}>Ghanshyam Desale</p>
            <p className="text-xs" style={{ color: c.textMuted }}>Angular Developer</p>
          </div>
        </div>

        <div>
          <p className="font-bold text-lg leading-tight" style={{ color: c.text }}>Book a Meeting</p>
          <div className="flex gap-2 mt-3">
            {DURATIONS.map(d => (
              <button
                key={d.value}
                onClick={() => setDuration(d.value)}
                className="text-xs px-3 py-1 rounded-full border transition-all"
                style={duration === d.value
                  ? { background: c.durationActive, color: c.durationActText, borderColor: c.durationActive }
                  : { background: c.durationInact, color: c.durationInactText, borderColor: c.durationBorder }
                }
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 text-sm">
          {[
            { icon: Clock,  text: `${duration} min` },
            { icon: Video,  text: 'Google Meet' },
            { icon: Globe,  text: 'Asia/Kolkata' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2">
              <Icon size={14} style={{ color: c.iconColor, flexShrink: 0 }} />
              <span style={{ color: c.textMuted }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Center: Calendar ── */}
      <div
        className="flex-1 p-6 border-b sm:border-b-0 sm:border-r"
        style={{ borderColor: c.border }}
      >
        <div className="flex items-center justify-between mb-5">
          <span className="font-semibold" style={{ color: c.text }}>
            <span className="font-bold">{MONTHS[month]}</span>{' '}
            <span style={{ color: c.textFaint, fontWeight: 400 }}>{year}</span>
          </span>
          <div className="flex gap-1">
            <button
              onClick={prevMonth}
              disabled={year === now.getFullYear() && month <= now.getMonth()}
              className="p-1.5 rounded-lg transition-colors disabled:opacity-30"
              style={{ color: c.textMuted }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = c.dayHover }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-lg transition-colors"
              style={{ color: c.textMuted }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = c.dayHover }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {DAYS.map(d => (
            <div key={d} className="text-center text-[10px] font-semibold pb-2" style={{ color: c.textFaint }}>{d}</div>
          ))}
        </div>

        {/* Date grid */}
        <div className="grid grid-cols-7 gap-y-1">
          {cells.map((cell, i) => {
            const disabled = !cell.inMonth || isPast(cell.date)
            const today    = isToday(cell.date)
            const selected = cell.date?.toDateString() === selectedDate?.toDateString()

            const baseStyle: CSSProperties = selected
              ? { background: c.daySelected, color: c.daySelectedText, borderRadius: '50%' }
              : today
              ? { background: 'transparent', color: c.text, outline: `2px solid ${c.dayTodayBorder}`, outlineOffset: -2, borderRadius: '50%' }
              : disabled
              ? { color: c.textFaint, cursor: 'default', borderRadius: '50%' }
              : { color: c.text, borderRadius: '50%' }

            return (
              <div key={i} className="flex justify-center py-0.5">
                <button
                  disabled={disabled}
                  onClick={() => { if (cell.date) { setSelectedDate(cell.date); setSelectedTime(null) } }}
                  className="w-9 h-9 text-sm font-medium transition-all relative"
                  style={baseStyle}
                  onMouseEnter={e => { if (!disabled && !selected) (e.currentTarget as HTMLButtonElement).style.background = c.dayHover }}
                  onMouseLeave={e => { if (!disabled && !selected) (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
                >
                  {cell.day}
                  {today && !selected && (
                    <span
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                      style={{ background: c.dayTodayBorder }}
                    />
                  )}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Right: Time slots ── */}
      <AnimatePresence>
        {selectedDate && (
          <motion.div
            className="sm:w-[230px] flex-shrink-0 p-5 flex flex-col"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold text-sm" style={{ color: c.text }}>
                {selectedDate.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' })}
              </p>
              <span className="text-xs font-medium" style={{ color: c.textMuted }}>12h</span>
            </div>

            <div data-lenis-prevent className="flex flex-col gap-2 overflow-y-auto max-h-80 pr-1">
              {timeSlots.length === 0 ? (
                <p className="text-sm text-center py-4" style={{ color: c.textFaint }}>No slots available</p>
              ) : timeSlots.map(t => (
                <button
                  key={t}
                  onClick={() => handleTimeSelect(t)}
                  className="w-full py-3 rounded-xl border text-sm font-medium transition-all"
                  style={selectedTime === t
                    ? { background: c.timeSelected, color: c.timeSelectedText, borderColor: c.timeSelected }
                    : { borderColor: c.border, color: c.text }
                  }
                  onMouseEnter={e => { if (selectedTime !== t) (e.currentTarget as HTMLButtonElement).style.borderColor = c.timeHoverBorder }}
                  onMouseLeave={e => { if (selectedTime !== t) (e.currentTarget as HTMLButtonElement).style.borderColor = c.border }}
                >
                  {t}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Step 2: Meeting details form ──────────────────────────────────────────────
interface FormStepProps {
  date: Date; time: string; duration: string
  onBack: () => void; onConfirmed: () => void
}

function FormStep({ date, time, duration, onBack, onConfirmed }: FormStepProps) {
  const c = useBookingColors()
  const [name, setName]   = useState('')
  const [email, setEmail] = useState('')
  const [topic, setTopic] = useState('')
  const [notes, setNotes] = useState('')
  const [err, setErr]     = useState('')
  const mutation = useMeetingMutation()

  const inputStyle: CSSProperties = {
    width: '100%',
    background: c.inputBg,
    border: `1px solid ${c.inputBorder}`,
    borderRadius: '0.75rem',
    padding: '0.75rem 1rem',
    color: c.text,
    fontSize: '0.875rem',
    outline: 'none',
    transition: 'border-color 0.15s ease',
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = c.inputFocus
  }
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = c.inputBorder
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr('')
    if (!name.trim() || !email.trim() || !topic.trim()) {
      setErr('Please fill in all required fields.'); return
    }
    try {
      await mutation.mutateAsync({
        name: name.trim(), email: email.trim(),
        date: formatDateLong(date), time, duration,
        topic: topic.trim(), notes: notes.trim(),
      })
      onConfirmed()
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Something went wrong. Please try again.')
    }
  }

  return (
    <motion.div
      className="rounded-2xl overflow-hidden"
      style={{ background: c.bg, color: c.text, boxShadow: c.shadow }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Header */}
      <div className="border-b px-6 py-5 flex items-center gap-3" style={{ borderColor: c.border }}>
        <button
          onClick={onBack}
          className="p-1.5 rounded-lg transition-colors"
          style={{ color: c.textMuted }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = c.dayHover }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <p className="font-bold" style={{ color: c.text }}>Enter meeting details</p>
          <p className="text-sm flex items-center gap-2 mt-0.5" style={{ color: c.textMuted }}>
            <Clock size={12} />
            {duration} min · {formatDateLong(date)} · {time} IST
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 grid sm:grid-cols-2 gap-4">
        {[
          { label: 'Your name *',     value: name,  onChange: setName,  type: 'text',  placeholder: 'Full name' },
          { label: 'Email address *', value: email, onChange: setEmail, type: 'email', placeholder: 'you@example.com' },
        ].map(({ label, value, onChange, type, placeholder }) => (
          <div key={label}>
            <label className="block text-xs font-medium mb-1.5" style={{ color: c.labelColor }}>{label}</label>
            <input
              type={type}
              placeholder={placeholder}
              value={value}
              onChange={e => onChange(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              style={{ ...inputStyle, '::placeholder': { color: c.inputPlaceholder } } as CSSProperties}
            />
          </div>
        ))}

        <div className="sm:col-span-2">
          <label className="block text-xs font-medium mb-1.5" style={{ color: c.labelColor }}>Meeting topic *</label>
          <input
            type="text"
            placeholder="e.g. Frontend role discussion, collaboration idea…"
            value={topic}
            onChange={e => setTopic(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={inputStyle}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-medium mb-1.5" style={{ color: c.labelColor }}>
            Additional notes <span style={{ color: c.textFaint }}>(optional)</span>
          </label>
          <textarea
            rows={3}
            placeholder="Anything you'd like Ghanshyam to know beforehand…"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={{ ...inputStyle, resize: 'none' }}
          />
        </div>

        {err && (
          <div className="sm:col-span-2 flex items-center gap-2 text-sm" style={{ color: '#ef4444' }}>
            <AlertCircle size={14} /> {err}
          </div>
        )}

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-60"
            style={{ background: c.submitBg, color: c.submitText }}
          >
            {mutation.isPending ? 'Scheduling…' : 'Confirm Meeting Request →'}
          </button>
          <p className="text-xs text-center mt-3" style={{ color: c.textFaint }}>
            A confirmation email will be sent to you and Ghanshyam.
          </p>
        </div>
      </form>
    </motion.div>
  )
}

// ── Step 3: Confirmed ─────────────────────────────────────────────────────────
function ConfirmedStep({ date, time, onReset }: { date: Date; time: string; onReset: () => void }) {
  const c = useBookingColors()

  return (
    <motion.div
      className="rounded-2xl p-10 text-center flex flex-col items-center gap-4"
      style={{ background: c.bg, color: c.text, boxShadow: c.shadow }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center"
        style={{ background: c.confirmGreen }}
      >
        <CheckCircle2 size={28} style={{ color: '#10B981' }} />
      </div>
      <div>
        <h3 className="font-bold text-xl" style={{ color: c.text }}>Meeting Requested!</h3>
        <p className="text-sm mt-1" style={{ color: c.textMuted }}>
          {formatDateLong(date)} at {time} IST
        </p>
      </div>
      <p className="text-sm max-w-xs" style={{ color: c.textMuted }}>
        Confirmation emails have been sent to you and Ghanshyam. He'll confirm the slot shortly.
      </p>
      <button
        onClick={onReset}
        className="text-sm mt-2 underline underline-offset-2 transition-colors"
        style={{ color: c.textFaint }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = c.text }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = c.textFaint }}
      >
        Schedule another meeting
      </button>
    </motion.div>
  )
}

// ── Exported orchestrator ─────────────────────────────────────────────────────
export function MeetingBooking() {
  const [step, setStep]       = useState<'calendar' | 'form' | 'confirmed'>('calendar')
  const [booking, setBooking] = useState<{ date: Date; time: string; duration: string } | null>(null)

  const handleCalendarSelect = (date: Date, time: string, duration: string) => {
    setBooking({ date, time, duration })
    setStep('form')
  }
  const reset = () => { setStep('calendar'); setBooking(null) }

  return (
    <AnimatePresence mode="wait">
      {step === 'calendar' && (
        <motion.div key="calendar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }}>
          <CalendarStep onSelect={handleCalendarSelect} />
        </motion.div>
      )}
      {step === 'form' && booking && (
        <motion.div key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
          <FormStep
            date={booking.date}
            time={booking.time}
            duration={booking.duration}
            onBack={() => setStep('calendar')}
            onConfirmed={() => setStep('confirmed')}
          />
        </motion.div>
      )}
      {step === 'confirmed' && booking && (
        <motion.div key="confirmed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <ConfirmedStep date={booking.date} time={booking.time} onReset={reset} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
