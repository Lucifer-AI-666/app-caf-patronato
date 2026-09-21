import { useState } from 'react'
import { uid, type Appointment } from '@/lib/store'
import { CalendarDays, CheckCircle2, MapPin, Trash2, Video } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  appointments: Appointment[]
  setAppointments: (fn: (prev: Appointment[]) => Appointment[]) => void
}

const OFFICES = [
  { id: 'sede', name: 'Sede CAF — Via Roma 12', icon: 'pin' },
  { id: 'video', name: 'Videochiamata', icon: 'video' },
]

const SLOTS = ['09:00', '10:00', '11:30', '14:30', '16:00', '17:30']

function nextDays(n: number): { iso: string; label: string; short: string }[] {
  const out = []
  const d = new Date()
  while (out.length < n) {
    d.setDate(d.getDate() + 1)
    if (d.getDay() === 0) continue
    out.push({
      iso: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' }),
      short: d.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric' }),
    })
  }
  return out
}

export default function Appointments({ appointments, setAppointments }: Props) {
  const [booking, setBooking] = useState(false)
  const [reason, setReason] = useState('')
  const [office, setOffice] = useState(OFFICES[0].name)
  const [date, setDate] = useState<string | null>(null)
  const [slot, setSlot] = useState<string | null>(null)
  const days = nextDays(8)

  const canConfirm = reason.trim() && date && slot

  const confirm = () => {
    if (!canConfirm) return
    setAppointments((prev) => [
      ...prev,
      { id: uid(), reason: reason.trim(), office, date: date!, slot: slot!, createdAt: new Date().toISOString() },
    ])
    setBooking(false)
    setReason('')
    setDate(null)
    setSlot(null)
  }

  const upcoming = appointments.slice().sort((a, b) => (a.date + a.slot).localeCompare(b.date + b.slot))

  return (
    <div className="anim-rise">
      {!booking ? (
        <>
          {upcoming.length === 0 ? (
            <div className="mt-10 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full tint-card-strong">
                <CalendarDays className="h-9 w-9 text-primary" strokeWidth={1.6} />
              </div>
              <p className="mt-4 text-lg font-bold">Nessun appuntamento</p>
              <p className="mx-auto mt-1 max-w-xs text-sm text-muted-foreground">
                Prenota un colloquio con un operatore, in sede o in videochiamata.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.map((a) => (
                <div key={a.id} className="rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold">{a.reason}</p>
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                        <CalendarDays className="h-4 w-4 text-primary" />
                        {new Date(a.date + 'T00:00').toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })} · {a.slot}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                        {a.office.includes('Video') ? <Video className="h-4 w-4 text-primary" /> : <MapPin className="h-4 w-4 text-primary" />}
                        {a.office}
                      </p>
                    </div>
                    <button
                      aria-label="Annulla appuntamento"
                      onClick={() => setAppointments((prev) => prev.filter((x) => x.id !== a.id))}
                      className="text-muted-foreground transition-colors hover:text-destructive"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button
            onClick={() => setBooking(true)}
            className="mt-6 w-full rounded-full bg-primary py-4 font-bold text-white shadow-lg shadow-primary/25 transition-transform active:scale-[0.98]"
          >
            Prenota appuntamento
          </button>
        </>
      ) : (
        <div className="anim-rise space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold">Per cosa vuoi l'appuntamento?</label>
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Es. Aiuto con la NASpI"
              className="w-full rounded-2xl border border-input bg-card px-4 py-3.5 text-[15px] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">Dove?</label>
            <div className="grid grid-cols-2 gap-2.5">
              {OFFICES.map((o) => (
                <button
                  key={o.id}
                  onClick={() => setOffice(o.name)}
                  className={cn(
                    'flex items-center gap-2.5 rounded-2xl border p-3.5 text-left text-sm font-semibold transition-all',
                    office === o.name ? 'border-primary bg-primary/8' : 'border-border bg-card',
                  )}
                >
                  {o.icon === 'video' ? <Video className="h-5 w-5 text-primary" /> : <MapPin className="h-5 w-5 text-primary" />}
                  {o.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">Che giorno?</label>
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {days.map((d) => (
                <button
                  key={d.iso}
                  onClick={() => setDate(d.iso)}
                  className={cn(
                    'shrink-0 rounded-2xl border px-4 py-2.5 text-sm font-semibold capitalize transition-all',
                    date === d.iso ? 'border-primary bg-primary text-white' : 'border-border bg-card',
                  )}
                >
                  {d.short}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">A che ora?</label>
            <div className="grid grid-cols-3 gap-2.5">
              {SLOTS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSlot(s)}
                  className={cn(
                    'rounded-2xl border py-3 text-sm font-bold transition-all',
                    slot === s ? 'border-primary bg-primary text-white' : 'border-border bg-card',
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => setBooking(false)} className="rounded-full border border-border px-6 py-3.5 font-semibold">
              Annulla
            </button>
            <button
              onClick={confirm}
              disabled={!canConfirm}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary py-3.5 font-bold text-white shadow-lg shadow-primary/25 transition-all active:scale-[0.98] disabled:opacity-40 disabled:shadow-none"
            >
              <CheckCircle2 className="h-5 w-5" /> Conferma
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
