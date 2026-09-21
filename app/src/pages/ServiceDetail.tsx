import { CATEGORIES, getService } from '@/data/services'
import { AreaBadge, IconBubble, PageHeader } from '@/components/chrome'
import { ArrowRight, CheckCircle2, Clock, ListChecks, Sparkles, Users } from 'lucide-react'

interface Props {
  serviceId: string
  go: (view: string, id?: string) => void
  onStartPractice: (serviceId: string) => void
}

export default function ServiceDetail({ serviceId, go, onStartPractice }: Props) {
  const service = getService(serviceId)
  if (!service) {
    return (
      <div>
        <PageHeader title="Servizio non trovato" onBack={() => go('services')} />
      </div>
    )
  }
  const cat = CATEGORIES.find((c) => c.id === service.category)

  return (
    <div className="anim-rise pb-24">
      <PageHeader title={service.name} onBack={() => go('services')} />

      <div className="space-y-5">
        <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">
          <div className="flex items-center gap-3">
            {cat && <IconBubble icon={cat.icon} />}
            <div className="flex flex-wrap items-center gap-2">
              {cat && <AreaBadge area={cat.area} />}
              <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                <Clock className="h-3.5 w-3.5" /> {service.time}
              </span>
            </div>
          </div>
          <p className="mt-4 text-[15.5px] leading-relaxed">{service.simple}</p>
        </div>

        <section className="rounded-2xl tint-card p-5">
          <h2 className="flex items-center gap-2 font-bold">
            <Users className="h-4.5 w-4.5 text-primary" /> A chi spetta
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed text-foreground/85">{service.who}</p>
        </section>

        <section className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">
          <h2 className="flex items-center gap-2 font-bold">
            <ListChecks className="h-4.5 w-4.5 text-primary" /> Documenti necessari
          </h2>
          <ul className="mt-3 space-y-2.5">
            {service.docs.map((d) => (
              <li key={d} className="flex items-start gap-2.5 text-[15px] leading-snug">
                <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-primary" strokeWidth={2} />
                {d}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">
          <h2 className="flex items-center gap-2 font-bold">
            <Sparkles className="h-4.5 w-4.5 text-primary" /> Come funziona
          </h2>
          <ol className="mt-3 space-y-0">
            {service.steps.map((step, i) => (
              <li key={step} className="relative flex gap-3.5 pb-4 last:pb-0">
                {i < service.steps.length - 1 && (
                  <span className="absolute left-[13px] top-7 h-full w-0.5 bg-primary/15" />
                )}
                <span className="z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  {i + 1}
                </span>
                <span className="pt-1 text-[15px] leading-snug">{step}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-16 z-30 mx-auto max-w-md px-4 pb-2">
        <button
          onClick={() => onStartPractice(service.id)}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 font-bold text-white shadow-xl shadow-primary/30 transition-transform active:scale-[0.98]"
        >
          Avvia pratica guidata <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
