import { LANG_LABELS, type Lang, type Profile } from '@/lib/store'
import { Accessibility, Bell, Globe, LogOut, ShieldCheck, Type, UserRound } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  profile: Profile
  setProfile: (fn: (p: Profile) => Profile) => void
  onReset: () => void
}

export default function ProfilePage({ profile, setProfile, onReset }: Props) {
  return (
    <div className="anim-rise space-y-5">
      <div className="flex items-center gap-4 rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-extrabold text-white">
          {profile.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-lg font-bold">{profile.name}</p>
          <p className="text-sm text-muted-foreground">Cittadino · dal {new Date(profile.onboardedAt).toLocaleDateString('it-IT')}</p>
        </div>
      </div>

      <section className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">
        <h2 className="flex items-center gap-2 font-bold">
          <Globe className="h-4.5 w-4.5 text-primary" /> Lingua
        </h2>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {(Object.keys(LANG_LABELS) as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => setProfile((p) => ({ ...p, lang: l }))}
              className={cn(
                'rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all',
                profile.lang === l ? 'border-primary bg-primary/8 text-primary' : 'border-border',
              )}
            >
              {LANG_LABELS[l].label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">L'interfaccia completa multilingua arriva con la versione cloud.</p>
      </section>

      <section className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">
        <h2 className="flex items-center gap-2 font-bold">
          <Accessibility className="h-4.5 w-4.5 text-primary" /> Accessibilità
        </h2>
        <button
          onClick={() => setProfile((p) => ({ ...p, bigText: !p.bigText }))}
          className="mt-3 flex w-full items-center justify-between rounded-xl border border-border px-4 py-3"
        >
          <span className="flex items-center gap-2.5 text-sm font-semibold">
            <Type className="h-4.5 w-4.5 text-primary" /> Testo grande
          </span>
          <span className={cn('relative h-6 w-11 rounded-full transition-colors', profile.bigText ? 'bg-primary' : 'bg-border')}>
            <span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all', profile.bigText ? 'left-[22px]' : 'left-0.5')} />
          </span>
        </button>
      </section>

      <section className="rounded-2xl tint-card p-5">
        <h2 className="flex items-center gap-2 font-bold">
          <ShieldCheck className="h-4.5 w-4.5 text-primary" /> Privacy e dati
        </h2>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-foreground/85">
          <li className="flex gap-2"><UserRound className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> In questa demo i tuoi dati restano solo su questo dispositivo.</li>
          <li className="flex gap-2"><Bell className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> Le notifiche saranno attivabili dalla versione cloud, sempre con il tuo consenso.</li>
          <li className="flex gap-2"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> Il progetto è sviluppato secondo GDPR e privacy by design.</li>
        </ul>
      </section>

      <button
        onClick={onReset}
        className="flex w-full items-center justify-center gap-2 rounded-full border border-destructive/30 py-3.5 font-bold text-destructive transition-colors hover:bg-destructive/5"
      >
        <LogOut className="h-4.5 w-4.5" /> Esci e cancella i dati demo
      </button>

      <p className="pb-2 text-center text-xs text-muted-foreground">
        CAF & Patronato in Tasca · Prototipo v0.1 · Un'amministrazione più vicina a te
      </p>
    </div>
  )
}
