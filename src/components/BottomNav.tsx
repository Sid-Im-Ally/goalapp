'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { href: '/stronger', label: 'STRONGER', color: '#dc2626', icon: <IconStronger /> },
  { href: '/faster',   label: 'FASTER',   color: '#2563eb', icon: <IconFaster /> },
  { href: '/steadier', label: 'STEADIER', color: '#16a34a', icon: <IconSteadier /> },
  { href: '/wiah-wib', label: 'WIAHWIB',  color: '#d97706', icon: <IconWhy /> },
]

export function BottomNav() {
  const pathname = usePathname()
  return (
    <div className="goal-bottomnav">
      {tabs.map((t) => {
        const active = pathname.startsWith(t.href)
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`goal-navbtn ${active ? 'active' : ''}`}
            style={active ? { color: t.color } as React.CSSProperties : undefined}
          >
            <div className="goal-navicon">{t.icon}</div>
            <div className="goal-navlabel">{t.label}</div>
          </Link>
        )
      })}
    </div>
  )
}

function IconStronger() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square">
      <line x1="2" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="22" y2="12" />
      <rect x="6" y="8" width="2.5" height="8" fill="currentColor" stroke="none" />
      <rect x="15.5" y="8" width="2.5" height="8" fill="currentColor" stroke="none" />
      <line x1="8.5" y1="12" x2="15.5" y2="12" />
    </svg>
  )
}
function IconFaster() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square">
      <polyline points="3,18 8,11 13,14 21,5" />
      <polyline points="16,5 21,5 21,10" />
    </svg>
  )
}
function IconSteadier() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" strokeLinejoin="miter">
      <line x1="12" y1="3" x2="12" y2="15" />
      <line x1="3" y1="20" x2="21" y2="20" />
      <polyline points="6,15 12,15 18,15" />
      <line x1="6" y1="15" x2="4" y2="20" />
      <line x1="18" y1="15" x2="20" y2="20" />
    </svg>
  )
}
function IconWhy() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square">
      <path d="M12 21s-7-4.5-7-11a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 6.5-7 11-7 11z" />
    </svg>
  )
}
