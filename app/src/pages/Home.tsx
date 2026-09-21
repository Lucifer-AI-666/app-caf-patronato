import type { Appointment, Practice, Profile } from '@/lib/store'
import { LANG_LABELS, STATUS_STEPS } from '@/lib/store'
import { CATEGORIES, SERVICES } from '@/data/services'
import { IconBubble } from '@/components/chrome'
import { ArrowRight, Bell, CalendarDays, MessageCircleHeart, Sparkles } from 'lucide-react'

interface Props {
  profile: Profile
  practices: Practice[]
  appointments: Appointment[]
  go: (view: string, id?: string) => void
}

export default function Home({ profile, practices, appointments, go }: Props) {
  const greeting = LANG_LABELS[profile.lang]?.greeting ?? 'Ciao'
  const hour = new Date().getHours()
  const dayPart = hour < 13 ? 'buongiorno' : hour < 19 ? 'buon pomeriggio' : 'buonasera'
  const active = practices.filter((p) => p.status !== 'completata')
  const nextAppointment = appointments
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))[0]

  const quick = SERVICES.filter((s) => s.mvp).slice(0, 6)

  return (
    <div className="anim-rise space-y-7">
      <div className="flex items-start justify-between pt-2">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {greeting}, {dayPart}
          </p>
          <h1 className="mt-0.5 text-2xl font-extrabold tracking-tight">{profile.name}</h1>
        </div>
        <button
          onClick={() => go('appointments')}
          aria-label="Notifiche e scadenze"
          className="relative flex h-11 w-11 items-center justify-center rounded-full bg-card shadow-sm ring-1 ring-border"
        >
          <Bell className="h-5 w-5 text-foreground" strokeWidth={1.9} />
          {nextAppointment && <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-primary" />}
        </button>
      </div>

      <button
        onClick={() => go('assistant')}
        className="group relative block w-full overflow-hidden rounded-[1.6rem] bg-primary p-[1px] text-left shadow-xl shadow-primary/25 transition-transform active:scale-[0.99]"
      >
        <div className="rounded-[1.55rem] bg-gradient-to-br from-primary to-[#a754f0] p-5 text-white">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] opacity-85">
            <Sparkles className="h-4 w-4" /> Assistente IA
          </div>
          <p className="mt-2 text-xl font-bold leading-snug text-balance">
            Raccontami la tua situazione, trovo io il servizio giusto.
          </p>
          <p className="mt-1.5 text-sm leading-relaxed opacity-85">
            Scrivi o parla nella tua lingua: ti spiego tutto con parole semplici.
          </p>
          <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/18 px-4 py-2 text-sm font-semibold backdrop-blur-sm transition-colors group-hover:bg-white/25">
            Inizia a parlare <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </button>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight">Le tue pratiche</h2>
          <button onClick={() => go('practices')} className="text-sm font-semibold text-primary">
            Vedi tutte
          </button>
        </div>
        {active.length === 0 ? (
          <button
            onClick={() => go('services')}
            className="w-full rounded-2xl border border-dashed border-primary/40 tint-card p-5 text-left transition-colors hover:bg-primary/10"
          >
            <p className="font-semibold text-foreground">Nessuna pratica attiva</p>
            <p className="mt-0.5 text-sm text-muted-foreground">Scegli un servizio dal catalogo o chiedi all'assistente.</p>
          </button>
        ) : (
          <div className="space-y-3">
            {active.slice(0, 2).map((p) => {
              const stepIdx = STATUS_STEPS.findIndex((s) => s.id === p.status)
              return (
                <button
                  key={p.id}
                  onClick={() => go('practice', p.id)}
                  className="w-full rounded-2xl bg-card p-4 text-left shadow-sm ring-1 ring-border transition-shadow hover:shadow-md"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-bold">{p.serviceName}</p>
                    <span className="rounded-full tint-card-strong px-2.5 py-1 text-[11px] font-bold text-primary">
                      {STATUS_STEPS[stepIdx]?.label}
                    </span>
                  </div>
                  <div className="mt-3 flex gap-1.5">
                    {STATUS_STEPS.map((s, i) => (
                      <span
                        key={s.id}
                        className={`h-1.5 flex-1 rounded-full ${i <= stepIdx ? 'bg-primary' : 'bg-border'}`}
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{STATUS_STEPS[stepIdx]?.hint}</p>
                </button>
              )
            })}
          </div>
        )}
      </section>

      {nextAppointment && (
        <section>
          <h2 className="mb-3 text-lg font-bold tracking-tight">Prossimo appuntamento</h2>
          <div className="flex items-center gap-4 rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border">
            <div className="flex h-12 w-12 items-center justify-center rounded-full tint-card-strong">
              <CalendarDays className="h-5 w-5 text-primary" strokeWidth={1.8} />
            </div>
            <div className="flex-1">
              <p className="font-bold">{nextAppointment.reason}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(nextAppointment.date + 'T00:00').toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })} · {nextAppointment.slot} · {nextAppointment.office}
              </p>
            </div>
          </div>
        </section>
      )}

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight">Servizi più richiesti</h2>
          <button onClick={() => go('services')} className="text-sm font-semibold text-primary">
            Catalogo
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {quick.map((s) => (
            <button
              key={s.id}
              onClick={() => go('service', s.id)}
              className="flex flex-col items-center gap-2 rounded-2xl bg-card px-2 py-4 text-center shadow-sm ring-1 ring-border transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <IconBubble icon={categoryIcon(s.category)} className="h-11 w-11" iconClassName="h-5 w-5" />
              <span className="text-[12px] font-semibold leading-tight">{s.name}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="flex items-center gap-4 rounded-2xl bg-[#181d4a] p-5 text-white">
        <MessageCircleHeart className="h-8 w-8 shrink-0 opacity-90" strokeWidth={1.6} />
        <div>
          <p className="font-bold">Preferisci parlare con una persona?</p>
          <p className="mt-0.5 text-sm opacity-80">Prenota un appuntamento in sede o in videochiamata.</p>
          <button onClick={() => go('appointments')} className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-[#d9b3ff]">
            Prenota ora <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  )
}

function categoryIcon(catId: string): string {
  return CATEGORIES.find((c) => c.id === catId)?.icon ?? 'file'
}
