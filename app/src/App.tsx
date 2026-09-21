import { useEffect, useState } from 'react'
import { uid, useStoredState, type Appointment, type Practice, type Profile } from '@/lib/store'
import Onboarding from '@/pages/Onboarding'
import Home from '@/pages/Home'
import Assistant from '@/pages/Assistant'
import Services from '@/pages/Services'
import ServiceDetail from '@/pages/ServiceDetail'
import Practices from '@/pages/Practices'
import NewPractice from '@/pages/NewPractice'
import Appointments from '@/pages/Appointments'
import ProfilePage from '@/pages/ProfilePage'
import { PageHeader } from '@/components/chrome'
import { FileText, Home as HomeIcon, LayoutGrid, Sparkles, User } from 'lucide-react'
import { cn } from '@/lib/utils'

type View =
  | { name: 'home' }
  | { name: 'services' }
  | { name: 'service'; id: string }
  | { name: 'assistant' }
  | { name: 'practices' }
  | { name: 'practice'; id: string }
  | { name: 'newPractice'; serviceId: string }
  | { name: 'appointments' }
  | { name: 'profile' }

const TAB_TITLES: Record<string, { title: string; subtitle?: string }> = {
  services: { title: 'Catalogo servizi', subtitle: 'CAF · Patronato · Immigrazione' },
  assistant: { title: 'Assistente IA', subtitle: 'Trova il servizio su misura per te' },
  practices: { title: 'Le tue pratiche', subtitle: 'Segui ogni passaggio in tempo reale' },
  appointments: { title: 'Appuntamenti', subtitle: 'In sede o in videochiamata' },
  profile: { title: 'Profilo', subtitle: 'Lingua, accessibilità e privacy' },
}

export default function App() {
  const [profile, setProfile] = useStoredState<Profile | null>('caf-profile', null)
  const [practices, setPractices] = useStoredState<Practice[]>('caf-practices', [])
  const [appointments, setAppointments] = useStoredState<Appointment[]>('caf-appointments', [])
  const [view, setView] = useState<View>({ name: 'home' })

  useEffect(() => {
    document.documentElement.style.fontSize = profile?.bigText ? '112.5%' : '100%'
    document.documentElement.dir = profile?.lang === 'ar' ? 'rtl' : 'ltr'
  }, [profile?.bigText, profile?.lang])

  const go = (v: string, id?: string) => {
    if (v === 'service' && id) setView({ name: 'service', id })
    else if (v === 'practice' && id) setView({ name: 'practice', id })
    else setView({ name: v } as View)
    window.scrollTo({ top: 0 })
  }

  if (!profile) {
    return (
      <Onboarding
        onDone={(p) => {
          setProfile(p)
          // Dati dimostrativi per mostrare subito l'esperienza completa
          setPractices([
            {
              id: uid(),
              serviceId: 'naspi',
              serviceName: 'NASpI (disoccupazione)',
              createdAt: new Date(Date.now() - 6 * 864e5).toISOString(),
              status: 'in_verifica',
              docs: ['carta-identita.jpg', 'lettera-licenziamento.pdf', 'ultima-busta-paga.pdf'],
            },
          ])
          const in3 = new Date(Date.now() + 3 * 864e5)
          setAppointments([
            {
              id: uid(),
              reason: 'Verifica documenti NASpI',
              office: 'Sede CAF — Via Roma 12',
              date: in3.toISOString().slice(0, 10),
              slot: '10:00',
              createdAt: new Date().toISOString(),
            },
          ])
        }}
      />
    )
  }

  const tab = ['home', 'services', 'assistant', 'practices', 'profile'].includes(view.name) ? view.name : 'home'

  return (
    <div className={cn('grain mx-auto flex min-h-dvh max-w-md flex-col bg-background', profile.bigText && 'text-[17px]')}>
      <main className="flex-1 px-4 pb-28 pt-2">
        {view.name !== 'home' && view.name !== 'service' && view.name !== 'practice' && view.name !== 'newPractice' && TAB_TITLES[view.name] && (
          <PageHeader title={TAB_TITLES[view.name].title} subtitle={TAB_TITLES[view.name].subtitle} />
        )}

        {view.name === 'home' && <Home profile={profile} practices={practices} appointments={appointments} go={go} />}
        {view.name === 'services' && <Services go={go} />}
        {view.name === 'service' && (
          <ServiceDetail
            serviceId={view.id}
            go={go}
            onStartPractice={(sid) => setView({ name: 'newPractice', serviceId: sid })}
          />
        )}
        {view.name === 'assistant' && <Assistant profile={profile} go={go} />}
        {view.name === 'practices' && <Practices practices={practices} go={go} onNew={() => setView({ name: 'services' })} />}
        {view.name === 'practice' && <Practices practices={practices} selected={view.id} go={go} onNew={() => setView({ name: 'services' })} />}
        {view.name === 'newPractice' && (
          <NewPractice
            serviceId={view.serviceId}
            onCancel={() => setView({ name: 'service', id: view.serviceId })}
            onDone={(practice) => {
              setPractices((prev) => [...prev, practice])
              setTimeout(() => go('practice', practice.id), 1400)
            }}
          />
        )}
        {view.name === 'appointments' && <Appointments appointments={appointments} setAppointments={setAppointments} />}
        {view.name === 'profile' && (
          <ProfilePage
            profile={profile}
            setProfile={(fn) => setProfile((prev) => (prev ? fn(prev) : prev))}
            onReset={() => {
              localStorage.removeItem('caf-profile')
              localStorage.removeItem('caf-practices')
              localStorage.removeItem('caf-appointments')
              window.location.reload()
            }}
          />
        )}
      </main>

      {/* Bottom navigation */}
      <nav className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-background/92 backdrop-blur-lg">
        <div className="mx-auto flex max-w-md items-end justify-around px-2 pb-1.5 pt-1.5">
          <NavItem icon={<HomeIcon className="h-5.5 w-5.5" strokeWidth={1.9} />} label="Home" active={tab === 'home'} onClick={() => setView({ name: 'home' })} />
          <NavItem icon={<LayoutGrid className="h-5.5 w-5.5" strokeWidth={1.9} />} label="Servizi" active={tab === 'services'} onClick={() => setView({ name: 'services' })} />
          <button
            onClick={() => setView({ name: 'assistant' })}
            aria-label="Assistente IA"
            className={cn(
              '-mt-6 flex h-14 w-14 items-center justify-center rounded-full shadow-xl transition-transform active:scale-95',
              tab === 'assistant' ? 'bg-[#181d4a] shadow-[#181d4a]/30' : 'bg-primary shadow-primary/35',
            )}
          >
            <Sparkles className="h-6 w-6 text-white" strokeWidth={2} />
          </button>
          <NavItem icon={<FileText className="h-5.5 w-5.5" strokeWidth={1.9} />} label="Pratiche" active={tab === 'practices'} onClick={() => setView({ name: 'practices' })} badge={practices.filter((p) => p.status !== 'completata').length} />
          <NavItem icon={<User className="h-5.5 w-5.5" strokeWidth={1.9} />} label="Profilo" active={tab === 'profile'} onClick={() => setView({ name: 'profile' })} />
        </div>
      </nav>
    </div>
  )
}

function NavItem({ icon, label, active, onClick, badge }: {
  icon: React.ReactNode
  label: string
  active: boolean
  onClick: () => void
  badge?: number
}) {
  return (
    <button onClick={onClick} className="relative flex w-16 flex-col items-center gap-0.5 py-1" aria-label={label}>
      <span className={cn('flex h-9 w-14 items-center justify-center rounded-full transition-colors', active && 'tint-card-strong text-primary', !active && 'text-muted-foreground')}>
        {icon}
      </span>
      <span className={cn('text-[10.5px] font-semibold', active ? 'text-primary' : 'text-muted-foreground')}>{label}</span>
      {!!badge && (
        <span className="absolute right-1.5 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
          {badge}
        </span>
      )}
    </button>
  )
}
