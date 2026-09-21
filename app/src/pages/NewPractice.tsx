import { useRef, useState } from 'react'
import { getService } from '@/data/services'
import { uid, type Practice } from '@/lib/store'
import { PageHeader } from '@/components/chrome'
import { Camera, CheckCircle2, FileUp, PartyPopper, Trash2, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  serviceId: string
  onDone: (practice: Practice) => void
  onCancel: () => void
}

export default function NewPractice({ serviceId, onDone, onCancel }: Props) {
  const service = getService(serviceId)
  const [step, setStep] = useState(0)
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [files, setFiles] = useState<string[]>([])
  const fileRef = useRef<HTMLInputElement>(null)

  if (!service) return null

  const toggle = (doc: string) =>
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(doc)) next.delete(doc)
      else next.add(doc)
      return next
    })

  const addFiles = (list: FileList | null) => {
    if (!list) return
    const names = Array.from(list).map((f) => f.name)
    setFiles((prev) => [...new Set([...prev, ...names])])
  }

  const submit = () => {
    onDone({
      id: uid(),
      serviceId: service.id,
      serviceName: service.name,
      createdAt: new Date().toISOString(),
      status: 'inviata',
      docs: files,
    })
  }

  return (
    <div className="anim-rise">
      <PageHeader title={`Pratica: ${service.name}`} onBack={onCancel} />

      <div className="mb-5 flex gap-1.5">
        {['Checklist', 'Documenti', 'Conferma'].map((label, i) => (
          <div key={label} className="flex-1">
            <div className={cn('h-1.5 rounded-full', i <= step ? 'bg-primary' : 'bg-border')} />
            <p className={cn('mt-1.5 text-[11px] font-semibold', i <= step ? 'text-primary' : 'text-muted-foreground')}>{label}</p>
          </div>
        ))}
      </div>

      {step === 0 && (
        <div className="anim-rise">
          <p className="mb-3 text-[15px] leading-relaxed text-muted-foreground">
            Prima di iniziare, verifica di avere questi documenti. Non preoccuparti se ne manca qualcuno: l'operatore ti dirà come recuperarlo.
          </p>
          <div className="space-y-2.5">
            {service.docs.map((doc) => (
              <button
                key={doc}
                onClick={() => toggle(doc)}
                className={cn(
                  'flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-all',
                  checked.has(doc) ? 'border-primary bg-primary/8' : 'border-border bg-card',
                )}
              >
                <span className={cn('mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2', checked.has(doc) ? 'border-primary bg-primary' : 'border-muted-foreground/40')}>
                  {checked.has(doc) && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                </span>
                <span className="text-[15px] font-medium leading-snug">{doc}</span>
              </button>
            ))}
          </div>
          <button
            onClick={() => setStep(1)}
            className="mt-6 w-full rounded-full bg-primary py-4 font-bold text-white shadow-lg shadow-primary/25 transition-transform active:scale-[0.98]"
          >
            Ho i documenti, continua
          </button>
          <button onClick={() => setStep(1)} className="mt-2 w-full py-2 text-sm font-semibold text-muted-foreground">
            Mi manca qualcosa, continuo lo stesso
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="anim-rise">
          <p className="mb-3 text-[15px] leading-relaxed text-muted-foreground">
            Fotografa o carica i documenti. In questa demo i file restano sul dispositivo: salviamo solo i nomi.
          </p>
          <input ref={fileRef} type="file" multiple accept="image/*,.pdf" className="hidden" onChange={(e) => addFiles(e.target.files)} />
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => fileRef.current?.click()}
              className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-primary/40 tint-card p-6 transition-colors hover:bg-primary/10"
            >
              <Camera className="h-7 w-7 text-primary" strokeWidth={1.7} />
              <span className="text-sm font-bold">Scatta foto</span>
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-primary/40 tint-card p-6 transition-colors hover:bg-primary/10"
            >
              <FileUp className="h-7 w-7 text-primary" strokeWidth={1.7} />
              <span className="text-sm font-bold">Carica PDF</span>
            </button>
          </div>

          {files.length > 0 && (
            <ul className="mt-4 space-y-2">
              {files.map((f) => (
                <li key={f} className="flex items-center gap-2.5 rounded-xl bg-card px-3.5 py-3 text-sm font-medium shadow-sm ring-1 ring-border">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  <span className="flex-1 truncate">{f}</span>
                  <button aria-label={`Rimuovi ${f}`} onClick={() => setFiles(files.filter((x) => x !== f))} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <button
            onClick={() => setStep(2)}
            disabled={files.length === 0}
            className="mt-6 w-full rounded-full bg-primary py-4 font-bold text-white shadow-lg shadow-primary/25 transition-all active:scale-[0.98] disabled:opacity-40 disabled:shadow-none"
          >
            Continua
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="anim-rise">
          <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">
            <h2 className="font-bold">Riepilogo</h2>
            <dl className="mt-3 space-y-3 text-[15px]">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Servizio</dt>
                <dd className="font-semibold">{service.name}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Documenti caricati</dt>
                <dd className="font-semibold">{files.length} file</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Prossimi passi</dt>
                <dd className="leading-relaxed">Un operatore verificherà la pratica e ti scriverà se serve altro. Riceverai una notifica a ogni cambio di stato.</dd>
              </div>
            </dl>
          </div>
          <button
            onClick={() => {
              submit()
              setStep(3)
            }}
            className="mt-6 w-full rounded-full bg-primary py-4 font-bold text-white shadow-lg shadow-primary/25 transition-transform active:scale-[0.98]"
          >
            Invia la pratica
          </button>
          <button onClick={() => setStep(1)} className="mt-2 flex w-full items-center justify-center gap-1 py-2 text-sm font-semibold text-muted-foreground">
            <X className="h-4 w-4" /> Modifica documenti
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="anim-pop py-10 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/12">
            <PartyPopper className="h-9 w-9 text-primary" strokeWidth={1.7} />
          </div>
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight">Pratica inviata!</h2>
          <p className="mx-auto mt-2 max-w-xs text-[15px] leading-relaxed text-muted-foreground">
            La tua pratica di <strong>{service.name}</strong> è nelle mani degli operatori. Ti avvisiamo a ogni passaggio.
          </p>
        </div>
      )}
    </div>
  )
}
