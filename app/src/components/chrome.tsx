import type { LucideIcon } from 'lucide-react'
import {
  Briefcase, FileText, Gift, Globe, Heart, Home, Landmark,
  Receipt, Smartphone, Sunset,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Category } from '@/data/services'

const ICONS: Record<string, LucideIcon> = {
  receipt: Receipt,
  gift: Gift,
  home: Home,
  sunset: Sunset,
  briefcase: Briefcase,
  heart: Heart,
  globe: Globe,
  smartphone: Smartphone,
  file: FileText,
  landmark: Landmark,
}

export function ServiceIcon({ icon, className }: { icon: string; className?: string }) {
  const Icon = ICONS[icon] ?? FileText
  return <Icon className={className} strokeWidth={1.8} />
}

export function IconBubble({ icon, className, iconClassName }: { icon: string; className?: string; iconClassName?: string }) {
  return (
    <div className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-full tint-card-strong', className)}>
      <ServiceIcon icon={icon} className={cn('h-5.5 w-5.5 text-primary', iconClassName)} />
    </div>
  )
}

export function AreaBadge({ area }: { area: Category['area'] }) {
  const styles: Record<Category['area'], string> = {
    CAF: 'bg-primary/10 text-primary',
    Patronato: 'bg-[#181d4a]/8 text-[#181d4a]',
    Immigrazione: 'bg-emerald-600/10 text-emerald-700',
    Digitale: 'bg-sky-600/10 text-sky-700',
  }
  return (
    <span className={cn('rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide', styles[area])}>
      {area}
    </span>
  )
}

export function PageHeader({ title, subtitle, onBack, right }: {
  title: string
  subtitle?: string
  onBack?: () => void
  right?: React.ReactNode
}) {
  return (
    <header className="sticky top-0 z-20 -mx-4 mb-4 border-b border-border/60 bg-background/85 px-4 pb-3 pt-4 backdrop-blur-md">
      <div className="flex items-center gap-3">
        {onBack && (
          <button
            onClick={onBack}
            aria-label="Indietro"
            className="flex h-10 w-10 items-center justify-center rounded-full tint-card text-primary transition-colors hover:bg-primary/15"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {right}
      </div>
    </header>
  )
}
