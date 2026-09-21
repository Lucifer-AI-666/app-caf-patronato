import { STATUS_STEPS, type Practice } from '@/lib/store'
import { PageHeader } from '@/components/chrome'
import { CheckCircle2, FileText, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  practices: Practice[]
  selected?: string
  go: (view: string, id?: string) => void
  onNew: () => void
}

export default function Practices({ practices, selected, go, onNew }: Props) {
  const detail = selected ? practices.find((p) => p.id === selected) : undefined

  if (detail) {
    const stepIdx = STATUS_STEPS.findIndex((s) => s.id === detail.status)
    return (
      <div className="anim-rise">
        <PageHeader title={detail.serviceName} subtitle={`Pratica del ${new Date(detail.createdAt).toLocaleDateString('it-IT')}`} onBack={() => go('practices')} />

        <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">
          <h2 className="font-bold">Stato della pratica</h2>
          <ol className="mt-4 space-y-0">
            {STATUS_STEPS.map((s, i) => {
              const done = i < stepIdx
              const current = i === stepIdx
              return (
                <li key={s.id} className="relative flex gap-3.5 pb-5 last:pb-0">
                  {i < STATUS_STEPS.length - 1 && (
                    <span className={cn('absolute left-[13px] top-7 h-full w-0.5', done ? 'bg-primary' : 'bg-border')} />
                  )}
                  <span
                    className={cn(
                      'z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                      done && 'bg-primary text-white',
                      current && 'bg-primary text-white ring-4 ring-primary/20',
                      !done && !current && 'bg-border text-muted-foreground',
                    )}
                  >
                    {done ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                  </span>
                  <div className="pt-0.5">
                    <p className={cn('font-semibold', !done && !current && 'text-muted-foreground')}>{s.label}</p>
                    {current && <p className="text-xs text-muted-foreground">{s.hint}</p>}
                  </div>
                </li>
              )
            })}
          </ol>
        </div>

        <div className="mt-4 rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">
          <h2 className="font-bold">Documenti caricati ({detail.docs.length})</h2>
          {detail.docs.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">Nessun documento ancora caricato.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {detail.docs.map((d) => (
                <li key={d} className="flex items-center gap-2.5 rounded-xl tint-card px-3.5 py-2.5 text-sm font-medium">
                  <FileText className="h-4 w-4 shrink-0 text-primary" />
                  <span className="truncate">{d}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {detail.note && (
          <div className="mt-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
            <p className="text-sm font-semibold text-amber-800">Nota dell'operatore</p>
            <p className="mt-1 text-sm leading-relaxed text-amber-900/90">{detail.note}</p>
          </div>
        )}

        <button
          onClick={() => go('assistant')}
          className="mt-5 w-full rounded-full border border-primary/30 py-3.5 font-bold text-primary transition-colors hover:bg-primary/5"
        >
          Hai domande? Chiedi all'assistente
        </button>
      </div>
    )
  }

  return (
    <div className="anim-rise">
      {practices.length === 0 ? (
        <div className="mt-10 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full tint-card-strong">
            <FileText className="h-9 w-9 text-primary" strokeWidth={1.6} />
          </div>
          <p className="mt-4 text-lg font-bold">Nessuna pratica ancora</p>
          <p className="mx-auto mt-1 max-w-xs text-sm text-muted-foreground">
            Avvia la tua prima pratica dal catalogo, oppure lascia che l'assistente trovi il servizio giusto per te.
          </p>
          <button onClick={() => go('services')} className="mt-5 rounded-full bg-primary px-6 py-3 font-bold text-white shadow-lg shadow-primary/25">
            Esplora i servizi
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {practices
            .slice()
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
            .map((p) => {
              const stepIdx = STATUS_STEPS.findIndex((s) => s.id === p.status)
              return (
                <button
                  key={p.id}
                  onClick={() => go('practice', p.id)}
                  className="w-full rounded-2xl bg-card p-4 text-left shadow-sm ring-1 ring-border transition-shadow hover:shadow-md"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-bold">{p.serviceName}</p>
                    <span className={cn('rounded-full px-2.5 py-1 text-[11px] font-bold', p.status === 'completata' ? 'bg-emerald-600/10 text-emerald-700' : 'tint-card-strong text-primary')}>
                      {STATUS_STEPS[stepIdx]?.label}
                    </span>
                  </div>
                  <div className="mt-3 flex gap-1.5">
                    {STATUS_STEPS.map((s, i) => (
                      <span key={s.id} className={cn('h-1.5 flex-1 rounded-full', i <= stepIdx ? 'bg-primary' : 'bg-border')} />
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Aperta il {new Date(p.createdAt).toLocaleDateString('it-IT')} · {p.docs.length} documenti
                  </p>
                </button>
              )
            })}
        </div>
      )}

      {practices.length > 0 && (
        <button
          onClick={onNew}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full border border-dashed border-primary/40 py-3.5 font-bold text-primary transition-colors hover:bg-primary/5"
        >
          <Plus className="h-5 w-5" /> Nuova pratica
        </button>
      )}
    </div>
  )
}
