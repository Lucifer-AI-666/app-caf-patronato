import { useState } from 'react'
import { CATEGORIES, SERVICES, servicesByCategory, type Service } from '@/data/services'
import { AreaBadge, IconBubble } from '@/components/chrome'
import { ChevronDown, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  go: (view: string, id?: string) => void
}

export default function Services({ go }: Props) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState<string | null>(CATEGORIES[0].id)

  const q = query.trim().toLowerCase()
  const searching = q.length > 1
  const results: Service[] = searching
    ? SERVICES.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.simple.toLowerCase().includes(q) ||
          s.keywords.some((k) => k.toLowerCase().includes(q)),
      )
    : []

  return (
    <div className="anim-rise">
      <div className="relative mb-5">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" strokeWidth={2} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cerca un servizio… (es. permesso, 730, bonus)"
          className="w-full rounded-2xl border border-input bg-card py-3.5 pl-12 pr-4 text-[15px] outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {searching ? (
        <div className="space-y-2.5">
          <p className="text-sm font-semibold text-muted-foreground">
            {results.length} risultat{results.length === 1 ? 'o' : 'i'} per “{query}”
          </p>
          {results.map((s) => (
            <ServiceRow key={s.id} service={s} go={go} />
          ))}
          {results.length === 0 && (
            <div className="rounded-2xl tint-card p-5 text-center">
              <p className="font-semibold">Nessun servizio trovato</p>
              <p className="mt-1 text-sm text-muted-foreground">Prova con parole diverse, o chiedi all'Assistente IA.</p>
              <button onClick={() => go('assistant')} className="mt-3 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white">
                Chiedi all'assistente
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {CATEGORIES.map((cat) => {
            const list = servicesByCategory(cat.id)
            const isOpen = open === cat.id
            return (
              <div key={cat.id} className="overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-border">
                <button
                  onClick={() => setOpen(isOpen ? null : cat.id)}
                  className="flex w-full items-center gap-3.5 p-4 text-left"
                  aria-expanded={isOpen}
                >
                  <IconBubble icon={cat.icon} />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="font-bold">{cat.name}</span>
                      <AreaBadge area={cat.area} />
                    </span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">{cat.blurb} · {list.length} servizi</span>
                  </span>
                  <ChevronDown className={cn('h-5 w-5 text-muted-foreground transition-transform', isOpen && 'rotate-180')} />
                </button>
                {isOpen && (
                  <div className="anim-rise space-y-2 border-t border-border/60 p-3">
                    {list.map((s) => (
                      <ServiceRow key={s.id} service={s} go={go} compact />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function ServiceRow({ service, go, compact }: { service: Service; go: Props['go']; compact?: boolean }) {
  return (
    <button
      onClick={() => go('service', service.id)}
      className={cn(
        'flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors hover:bg-primary/5',
        compact ? '' : 'bg-card shadow-sm ring-1 ring-border',
      )}
    >
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="font-semibold">{service.name}</span>
          {service.mvp && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">PIÙ RICHIESTO</span>}
        </span>
        {!compact && <span className="mt-0.5 line-clamp-2 block text-xs leading-relaxed text-muted-foreground">{service.simple}</span>}
      </span>
      <ChevronDown className="h-4 w-4 -rotate-90 text-muted-foreground" />
    </button>
  )
}
