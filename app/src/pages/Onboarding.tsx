import { useState } from 'react'
import { LANG_LABELS, type Lang, type Profile } from '@/lib/store'
import { MessageCircleHeart, ShieldCheck, Fingerprint, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Onboarding({ onDone }: { onDone: (p: Profile) => void }) {
  const [step, setStep] = useState(0)
  const [lang, setLang] = useState<Lang>('it')
  const [name, setName] = useState('')
  const [consent, setConsent] = useState(false)

  const finish = () => {
    onDone({
      name: name.trim() || 'Ospite',
      lang,
      role: 'cittadino',
      bigText: false,
      onboardedAt: new Date().toISOString(),
    })
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background px-6 pb-8 pt-12 grain">
      <div className="anim-rise mb-8">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-[1.4rem] bg-primary shadow-lg shadow-primary/30">
          <MessageCircleHeart className="h-8 w-8 text-white" strokeWidth={1.8} />
        </div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">CAF & Patronato in Tasca</p>
        <h1 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight text-balance">
          I tuoi servizi, <span className="font-display font-medium text-primary">semplici</span>, nel tuo telefono.
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
          Fisco, pensioni, bonus, permesso di soggiorno: ti aiutiamo passo passo, nella tua lingua.
        </p>
      </div>

      <div className="flex-1">
        {step === 0 && (
          <div className="anim-rise space-y-3">
            <p className="mb-1 flex items-center gap-2 text-sm font-semibold text-foreground">
              <Globe className="h-4 w-4 text-primary" /> Scegli la tua lingua · اختر لغتك · Choisis ta langue
            </p>
            {(Object.keys(LANG_LABELS) as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={cn(
                  'flex w-full items-center justify-between rounded-2xl border px-5 py-4 text-left transition-all',
                  lang === l
                    ? 'border-primary bg-primary/8 shadow-sm'
                    : 'border-border bg-card hover:border-primary/40',
                )}
              >
                <span className="text-[16px] font-semibold">{LANG_LABELS[l].label}</span>
                {lang === l && <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">✓</span>}
              </button>
            ))}
          </div>
        )}

        {step === 1 && (
          <div className="anim-rise space-y-5">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-semibold">Come ti chiami?</label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Il tuo nome"
                className="w-full rounded-2xl border border-input bg-card px-5 py-4 text-[16px] outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <p className="mt-2 text-xs text-muted-foreground">Serve solo per darti il benvenuto. I tuoi dati restano su questo dispositivo.</p>
            </div>
            <div className="rounded-2xl tint-card p-4">
              <p className="flex items-start gap-2 text-[13px] leading-relaxed text-foreground/80">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                Questa è una versione dimostrativa: le pratiche e i dati che inserisci restano sul tuo telefono.
              </p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="anim-rise space-y-3">
            <p className="mb-1 text-sm font-semibold">Come vuoi accedere?</p>
            <button onClick={finish} className="flex w-full items-center gap-4 rounded-2xl bg-[#0066cc] px-5 py-4 text-left text-white transition-transform active:scale-[0.98]">
              <Fingerprint className="h-6 w-6" />
              <span>
                <span className="block font-bold">Entra con SPID</span>
                <span className="block text-xs opacity-80">Identità digitale (demo)</span>
              </span>
            </button>
            <button onClick={finish} className="flex w-full items-center gap-4 rounded-2xl bg-[#181d4a] px-5 py-4 text-left text-white transition-transform active:scale-[0.98]">
              <ShieldCheck className="h-6 w-6" />
              <span>
                <span className="block font-bold">Entra con CIE</span>
                <span className="block text-xs opacity-80">Carta d'identità elettronica (demo)</span>
              </span>
            </button>
            <button onClick={finish} className="w-full rounded-2xl border border-border bg-card px-5 py-4 font-semibold text-foreground transition-colors hover:border-primary/40">
              Continua senza account
            </button>
            <label className="flex items-start gap-3 px-1 pt-2">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-4 w-4 accent-primary" />
              <span className="text-xs leading-relaxed text-muted-foreground">
                Ho letto l'informativa privacy e accetto il trattamento dei dati (GDPR). Demo: nessun dato lascia il dispositivo.
              </span>
            </label>
          </div>
        )}
      </div>

      <div className="mt-8 flex items-center gap-3">
        {step > 0 && (
          <button onClick={() => setStep(step - 1)} className="rounded-full border border-border px-6 py-3.5 font-semibold text-foreground">
            Indietro
          </button>
        )}
        {step < 2 && (
          <button
            onClick={() => setStep(step + 1)}
            className="flex-1 rounded-full bg-primary px-6 py-3.5 font-bold text-white shadow-lg shadow-primary/25 transition-transform active:scale-[0.98]"
          >
            Continua
          </button>
        )}
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className={cn('h-1.5 rounded-full transition-all', i === step ? 'w-6 bg-primary' : 'w-1.5 bg-border')} />
          ))}
        </div>
      </div>
    </div>
  )
}
