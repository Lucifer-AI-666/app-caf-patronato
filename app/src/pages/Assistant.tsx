import { useEffect, useRef, useState } from 'react'
import { SCENARIOS, analyze, renderBold, scenarioReply, type AssistantReply, type Scenario } from '@/lib/assistant'
import type { Profile } from '@/lib/store'
import { LANG_LABELS } from '@/lib/store'
import { CATEGORIES, type Service } from '@/data/services'
import { AreaBadge, ServiceIcon } from '@/components/chrome'
import { ArrowRight, CalendarDays, Mic, SendHorizontal, Sparkles, UserRound } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Msg {
  id: number
  from: 'user' | 'ai'
  text: string
  reply?: AssistantReply
}

interface Props {
  profile: Profile
  go: (view: string, id?: string) => void
}

let mid = 0

export default function Assistant({ profile, go }: Props) {
  const greeting = LANG_LABELS[profile.lang]?.greeting ?? 'Ciao'
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      id: mid++,
      from: 'ai',
      text: `${greeting} ${profile.name}! Sono la tua assistente. Raccontami la tua situazione con parole semplici — anche nella tua lingua — e ti dico quali servizi fanno per te, con documenti e passaggi. Per esempio: «ho perso il lavoro» oppure «il mio permesso di soggiorno scade presto».`,
    },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [msgs, typing])

  const push = (text: string, reply?: AssistantReply) => {
    setTyping(true)
    setTimeout(() => {
      setMsgs((m) => [...m, { id: mid++, from: 'ai', text, reply }])
      setTyping(false)
    }, 700 + Math.random() * 500)
  }

  const send = (raw?: string) => {
    const text = (raw ?? input).trim()
    if (!text || typing) return
    setMsgs((m) => [...m, { id: mid++, from: 'user', text }])
    setInput('')
    const reply = analyze(text)
    push(reply.text, reply)
  }

  const runScenario = (sc: Scenario) => {
    if (typing) return
    setMsgs((m) => [...m, { id: mid++, from: 'user', text: sc.prompt }])
    const reply = scenarioReply(sc)
    push(reply.text, reply)
  }

  const unusedScenarios = SCENARIOS

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 pb-4">
        {msgs.map((m) => (
          <div key={m.id} className={cn('anim-pop flex', m.from === 'user' ? 'justify-end' : 'justify-start')}>
            <div className="max-w-[88%]">
              <div
                className={cn(
                  'rounded-3xl px-4 py-3 text-[15px] leading-relaxed',
                  m.from === 'user'
                    ? 'rounded-br-lg bg-primary text-white'
                    : 'rounded-bl-lg bg-card shadow-sm ring-1 ring-border',
                )}
              >
                {m.from === 'ai' && (
                  <span className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-primary">
                    <Sparkles className="h-3 w-3" /> Assistente
                  </span>
                )}
                <RichText text={m.text} />
              </div>

              {m.reply && m.reply.matches.length > 0 && (
                <div className="mt-2 space-y-2">
                  {m.reply.matches.map(({ service }) => (
                    <ServiceResultCard key={service.id} service={service} go={go} />
                  ))}
                </div>
              )}
              {m.reply?.suggestOperator && (
                <button
                  onClick={() => go('appointments')}
                  className="mt-2 flex w-full items-center gap-3 rounded-2xl border border-primary/30 tint-card p-3.5 text-left transition-colors hover:bg-primary/10"
                >
                  <UserRound className="h-5 w-5 text-primary" />
                  <span className="flex-1 text-sm font-semibold">Parla con un operatore</span>
                  <CalendarDays className="h-4 w-4 text-primary" />
                </button>
              )}
            </div>
          </div>
        ))}

        {typing && (
          <div className="anim-pop flex justify-start">
            <div className="flex items-center gap-1.5 rounded-3xl rounded-bl-lg bg-card px-5 py-4 shadow-sm ring-1 ring-border">
              <span className="typing-dot h-2 w-2 rounded-full bg-primary" />
              <span className="typing-dot h-2 w-2 rounded-full bg-primary" />
              <span className="typing-dot h-2 w-2 rounded-full bg-primary" />
            </div>
          </div>
        )}

        {msgs.length <= 1 && !typing && (
          <div className="anim-rise pt-2">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Oppure tocca una situazione</p>
            <div className="flex flex-wrap gap-2">
              {unusedScenarios.map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => runScenario(sc)}
                  className="rounded-full border border-primary/25 bg-card px-3.5 py-2 text-[13px] font-semibold text-foreground shadow-sm transition-colors hover:border-primary hover:text-primary"
                >
                  {sc.label}
                </button>
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="sticky bottom-0 -mx-4 border-t border-border/60 bg-background/90 px-4 pb-2 pt-2 backdrop-blur-md">
        <div className="flex items-end gap-2">
          <button
            aria-label="Parla (prossimamente)"
            title="Input vocale — prossimamente"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full tint-card text-primary"
            onClick={() => setInput((v) => v)}
          >
            <Mic className="h-5 w-5" strokeWidth={1.9} />
          </button>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                send()
              }
            }}
            rows={1}
            placeholder="Raccontami la tua situazione…"
            className="max-h-28 flex-1 resize-none rounded-3xl border border-input bg-card px-4 py-3 text-[15px] outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || typing}
            aria-label="Invia"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30 transition-all active:scale-95 disabled:opacity-40 disabled:shadow-none"
          >
            <SendHorizontal className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>
        <p className="mt-1.5 text-center text-[11px] text-muted-foreground">
          Demo: l'assistente lavora sul dispositivo. L'IA completa con fonti ufficiali arriva nella versione cloud.
        </p>
      </div>
    </div>
  )
}

function RichText({ text }: { text: string }) {
  const { parts } = renderBold(text)
  return (
    <span>
      {parts.map((p, i) =>
        p.bold ? (
          <strong key={i} className="font-bold">
            {p.text}
          </strong>
        ) : (
          <span key={i}>{p.text}</span>
        ),
      )}
    </span>
  )
}

function ServiceResultCard({ service, go }: { service: Service; go: Props['go'] }) {
  const cat = CATEGORIES.find((c) => c.id === service.category)
  return (
    <button
      onClick={() => go('service', service.id)}
      className="flex w-full items-center gap-3 rounded-2xl bg-card p-3.5 text-left shadow-sm ring-1 ring-border transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full tint-card-strong">
        <ServiceIcon icon={cat?.icon ?? 'file'} className="h-5 w-5 text-primary" />
      </div>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="truncate font-bold">{service.name}</span>
          {cat && <AreaBadge area={cat.area} />}
        </span>
        <span className="mt-0.5 line-clamp-2 block text-xs leading-relaxed text-muted-foreground">{service.simple}</span>
      </span>
      <ArrowRight className="h-4 w-4 shrink-0 text-primary" />
    </button>
  )
}
