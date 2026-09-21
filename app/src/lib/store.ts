import { useCallback, useState } from 'react'

// Persistenza locale del prototipo (localStorage del dispositivo).
// In produzione: backend cloud + sincronizzazione multi-dispositivo.

export type Lang = 'it' | 'ar' | 'fr' | 'en'

export interface Profile {
  name: string
  lang: Lang
  role: 'cittadino' | 'operatore'
  bigText: boolean
  onboardedAt: string
}

export type PracticeStatus = 'inviata' | 'in_verifica' | 'integrazione' | 'completata'

export interface Practice {
  id: string
  serviceId: string
  serviceName: string
  createdAt: string
  status: PracticeStatus
  note?: string
  docs: string[]
  data?: Record<string, string>
}

export interface Appointment {
  id: string
  reason: string
  office: string
  date: string
  slot: string
  createdAt: string
}

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function useStoredState<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => read(key, fallback))
  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const v = typeof next === 'function' ? (next as (p: T) => T)(prev) : next
        try {
          localStorage.setItem(key, JSON.stringify(v))
        } catch {
          /* storage pieno o privato: ignora */
        }
        return v
      })
    },
    [key],
  )
  return [value, set] as const
}

export const STATUS_STEPS: { id: PracticeStatus; label: string; hint: string }[] = [
  { id: 'inviata', label: 'Inviata', hint: 'La pratica è arrivata al CAF' },
  { id: 'in_verifica', label: 'In verifica', hint: 'Un operatore controlla i documenti' },
  { id: 'integrazione', label: 'Integrazione', hint: 'Potrebbero servirti altri documenti' },
  { id: 'completata', label: 'Completata', hint: 'Pratica chiusa' },
]

export function uid(): string {
  return Math.random().toString(36).slice(2, 9)
}

export const LANG_LABELS: Record<Lang, { label: string; greeting: string; dir?: 'rtl' }> = {
  it: { label: 'Italiano', greeting: 'Ciao' },
  ar: { label: 'العربية', greeting: 'مرحبا', dir: 'rtl' },
  fr: { label: 'Français', greeting: 'Bonjour' },
  en: { label: 'English', greeting: 'Hello' },
}
