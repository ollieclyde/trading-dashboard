import { NavLink } from 'react-router-dom'
import {
  CalendarDays,
  Swords,
  TrendingUp,
  Briefcase,
  BookOpen,
  Filter,
  Settings,
} from 'lucide-react'

const NAV_ITEMS = [
  { to: '/', label: 'Run Explorer', icon: CalendarDays },
  { to: '/debates', label: 'Debates', icon: Swords },
  { to: '/themes', label: 'Themes', icon: TrendingUp },
  { to: '/positions', label: 'Positions', icon: Briefcase },
  { to: '/reflections', label: 'Reflections', icon: BookOpen },
  { to: '/pipeline', label: 'Pipeline', icon: Filter },
  { to: '/system', label: 'System', icon: Settings },
]

export function Sidebar() {
  return (
    <aside className="w-56 shrink-0 border-r border-border bg-card flex flex-col">
      <div className="p-4 border-b border-border">
        <h1 className="text-sm font-semibold tracking-tight text-foreground">
          Trading Dashboard
        </h1>
      </div>
      <nav className="flex-1 p-2 space-y-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                isActive
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
              }`
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
