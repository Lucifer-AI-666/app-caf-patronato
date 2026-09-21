import { SERVICES, type Service } from '@/data/services'

// ── Motore dell'Assistente (prototipo locale) ────────────────
// Matching cognitivo on-device: normalizza il testo, cerca corrispondenze
// con le keyword dei servizi e con scenari tipici. In produzione: LLM + RAG
// su fonti ufficiali, con gli stessi guardrail descritti in docs/08.

export interface AssistantMatch {
  service: Service
  score: number
}

export interface AssistantReply {
  text: string
  matches: AssistantMatch[]
  suggestOperator?: boolean
}

export interface Scenario {
  id: string
  label: string
  prompt: string
  serviceIds: string[]
  reply: string
}

export const SCENARIOS: Scenario[] = [
  {
    id: 'lavoro-perso',
    label: 'Ho perso il lavoro',
    prompt: 'Ho perso il lavoro e non so come fare',
    serviceIds: ['naspi', 'adi', 'isee'],
    reply:
      'Mi dispiace per questo momento, ma ci sono aiuti concreti per te. La cosa più urgente è la NASpI: hai 68 giorni di tempo dalla fine del lavoro. Con l\'ISEE puoi anche valutare l\'Assegno di Inclusione e altri bonus. Da dove vuoi partire?',
  },
  {
    id: 'permesso-scade',
    label: 'Devo rinnovare il permesso di soggiorno',
    prompt: 'Il mio permesso di soggiorno sta per scadere',
    serviceIds: ['permesso', 'carta-soggiorno', 'test-italiano'],
    reply:
      'Bene che ci pensi in anticipo: il rinnovo va avviato idealmente 60 giorni prima della scadenza. E se vivi in Italia da almeno 5 anni, potresti avere diritto alla carta di soggiorno UE, che non scade più. Guardiamo le opzioni.',
  },
  {
    id: 'bambino',
    label: 'Aspetto un bambino',
    prompt: 'Aspetto un bambino, a cosa ho diritto?',
    serviceIds: ['maternita', 'assegno-unico', 'bonus-bebe'],
    reply:
      'Congratulazioni! 🎉 Ci sono tre cose importanti per te: la maternità (mesi pagati prima e dopo la nascita), l\'assegno unico per il bambino, e l\'ISEE che serve per quasi tutto. Ti spiego ognuna.',
  },
  {
    id: 'genitore-anziano',
    label: 'Un familiare anziano non è autosufficiente',
    prompt: 'Mia madre è anziana e non è più autosufficiente',
    serviceIds: ['invalidita', 'colf-badanti', 'assegno-sociale'],
    reply:
      'Capisco, non è facile. Ci sono tre strade concrete: la domanda di invalidità civile / Legge 104 (con eventuale accompagnamento), l\'assunzione regolare di una badante, e — se ha più di 67 anni e reddito basso — l\'assegno sociale.',
  },
  {
    id: 'lavorato-estero',
    label: 'Ho lavorato anche all\'estero',
    prompt: 'Ho lavorato tanti anni nel mio paese e ora lavoro in Italia: perderò quei contributi?',
    serviceIds: ['totalizzazione', 'pensione', 'estratto-conto'],
    reply:
      'Buona notizia: i contributi versati all\'estero non vanno persi. Con la totalizzazione si uniscono a quelli italiani per la pensione. Prima verifichiamo il tuo estratto conto e gli accordi con il tuo paese.',
  },
  {
    id: 'tasse',
    label: 'Devo fare la dichiarazione dei redditi',
    prompt: 'Devo fare la dichiarazione dei redditi',
    serviceIds: ['730', 'redditi-pf', 'cu'],
    reply:
      'Perfetto, ci pensiamo noi. Se sei lavoratore dipendente o pensionato serve il 730 — e spesso c\'è un rimborso. Se hai partita IVA o redditi particolari, il modello Redditi PF. Ti serve anche la CU: dimmi cosa hai e ti dico cosa manca.',
  },
  {
    id: 'affitto',
    label: 'Casa e affitto',
    prompt: 'Devo registrare un contratto di affitto / cerco aiuto per la casa',
    serviceIds: ['locazioni', 'isee', 'imu'],
    reply:
      'Per la casa possiamo aiutarti in due modi: registrare il contratto di affitto (con cedolare secca se conviene) e, con l\'ISEE, accedere a bonus e agevolazioni. Cosa ti serve?',
  },
  {
    id: 'documento-difficile',
    label: 'Non capisco un documento',
    prompt: 'Ho ricevuto un documento che non capisco',
    serviceIds: ['aiuto-digitale', 'spid-cie'],
    reply:
      'Nessun problema: nella prossima versione potrai fotografare il documento e te lo spiego in parole semplici. Per ora, scrivimi di cosa si tratta o prenota un appuntamento: un operatore lo legge con te.',
  },
]

const STOPWORDS = new Set([
  'il', 'lo', 'la', 'i', 'gli', 'le', 'un', 'una', 'di', 'a', 'da', 'in', 'con', 'su', 'per', 'tra', 'fra',
  'e', 'o', 'ma', 'che', 'non', 'mi', 'ti', 'si', 'ci', 'vi', 'ho', 'hai', 'ha', 'sono', 'è', 'del', 'della',
  'dei', 'delle', 'al', 'alla', 'nel', 'nella', 'sul', 'sulla', 'mio', 'mia', 'miei', 'tuo', 'tua', 'come',
  'cosa', 'devo', 'posso', 'vorrei', 'fare', 'serve', 'serve?', 'quando', 'dove', 'quanto',
])

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zàèéìòù0-9\s']/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOPWORDS.has(t))
}

function scoreService(service: Service, tokens: string[], rawLower: string): number {
  let score = 0
  for (const kw of service.keywords) {
    const kwNorm = kw.toLowerCase()
    if (kwNorm.includes(' ')) {
      if (rawLower.includes(kwNorm)) score += 6
    } else if (tokens.some((t) => t === kwNorm || t.startsWith(kwNorm) || kwNorm.startsWith(t))) {
      score += 3
    }
  }
  if (rawLower.includes(service.name.toLowerCase().split(' ')[0])) score += 2
  return score
}

const OPENERS = [
  'Grazie per avermelo raccontato.',
  'Capisco bene la tua situazione.',
  'Sono qui per aiutarti.',
]

export function analyze(input: string): AssistantReply {
  const rawLower = input.toLowerCase()
  const tokens = tokenize(input)

  const scored: AssistantMatch[] = SERVICES.map((service) => ({
    service,
    score: scoreService(service, tokens, rawLower),
  }))
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)

  const opener = OPENERS[Math.floor(Math.random() * OPENERS.length)]

  if (scored.length === 0 || scored[0].score < 3) {
    return {
      text: `${opener} Non sono sicura di aver capito bene quale servizio ti serve. Puoi raccontarmi la tua situazione con altre parole? Per esempio: «ho perso il lavoro», «devo rinnovare un documento», «mi serve aiuto per le tasse». Oppure ti metto in contatto con un operatore.`,
      matches: [],
      suggestOperator: true,
    }
  }

  const [first, second] = scored
  let text: string
  if (scored.length === 1 || first.score >= second.score * 2) {
    text = `${opener} Quello che fa per te è **${first.service.name}**: ${first.service.simple} Sotto trovi la scheda completa con documenti e passaggi.`
  } else {
    text = `${opener} Per la tua situazione ti consiglio questi servizi. Il più adatto mi sembra **${first.service.name}**, ma valuta anche gli altri: spesso si fanno insieme. Tocca una scheda per vedere documenti e passaggi.`
  }
  return { text, matches: scored }
}

export function scenarioReply(scenario: Scenario): AssistantReply {
  const matches: AssistantMatch[] = scenario.serviceIds
    .map((id) => SERVICES.find((s) => s.id === id))
    .filter((s): s is Service => Boolean(s))
    .map((service, i) => ({ service, score: 10 - i }))
  return { text: scenario.reply, matches }
}

// Render minimale del grassetto **testo**
export function renderBold(text: string): { parts: { text: string; bold: boolean }[] } {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).map((chunk) => {
    if (chunk.startsWith('**') && chunk.endsWith('**')) {
      return { text: chunk.slice(2, -2), bold: true }
    }
    return { text: chunk, bold: false }
  })
  return { parts }
}
