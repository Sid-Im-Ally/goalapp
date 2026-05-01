'use client'
import { useState } from 'react'
import { Header } from '@/components/Header'
import { ActivityTile } from '@/components/ActivityTile'
import ctData from '@/data/cross_training_library.json'
import type { CrossTrainingLibrary, CTCategory } from '@/lib/types'

const library = ctData as CrossTrainingLibrary

// Color and icon per category
const CATEGORY_META: Record<string, { color: string; icon: React.ReactNode }> = {
  squash: {
    color: '#f97316',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        {/* racquet head */}
        <ellipse cx="9" cy="9" rx="6" ry="6" />
        {/* strings */}
        <line x1="9" y1="3" x2="9" y2="15" />
        <line x1="3" y1="9" x2="15" y2="9" />
        {/* handle */}
        <line x1="13.5" y1="13.5" x2="21" y2="21" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
  },
  running: {
    color: '#2563eb',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {/* head */}
        <circle cx="14" cy="4" r="1.5" fill="currentColor" stroke="none" />
        {/* torso + arms */}
        <path d="M12 7l-2 5 4 2" />
        {/* legs */}
        <path d="M10 12l-2 5h3l1-3" />
        <path d="M14 14l1 4h-2.5" />
        {/* forward lean lines */}
        <path d="M16 9l2-2" />
      </svg>
    ),
  },
  core: {
    color: '#7c3aed',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  plyometrics: {
    color: '#dc2626',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {/* upward arrow */}
        <line x1="12" y1="20" x2="12" y2="5" />
        <polyline points="6,11 12,5 18,11" />
        {/* ground */}
        <line x1="4" y1="20" x2="20" y2="20" />
      </svg>
    ),
  },
  stretching: {
    color: '#0891b2',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {/* person in lateral stretch */}
        <circle cx="12" cy="4" r="1.5" fill="currentColor" stroke="none" />
        {/* torso */}
        <line x1="12" y1="5.5" x2="12" y2="13" />
        {/* arms wide */}
        <line x1="3" y1="10" x2="21" y2="10" />
        {/* legs spread */}
        <line x1="12" y1="13" x2="7" y2="20" />
        <line x1="12" y1="13" x2="17" y2="20" />
      </svg>
    ),
  },
  recovery: {
    color: '#16a34a',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {/* heart with pulse line */}
        <path d="M12 21s-7-4.5-7-11a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 6.5-7 11-7 11z" />
        {/* inner pulse */}
        <polyline points="8,12 10,10 12,14 14,11 16,12" strokeWidth="1.4" />
      </svg>
    ),
  },
}

export default function FasterTab() {
  const [openCategory, setOpenCategory] = useState<string | null>(null)

  return (
    <div className="goal-tabview goal-theme-faster">
      <Header
        tab="FASTER"
        subtitle="ENERGY SYSTEMS · PERFORMANCE"
        current={0}
        total={0}
        accent="#2563eb"
      />

      <div style={{ padding: '12px 16px 8px' }}>
        {library.categories.map((cat: CTCategory) => {
          const meta = CATEGORY_META[cat.id]
          const isOpen = openCategory === cat.id
          const color = meta?.color ?? '#888'

          return (
            <div
              key={cat.id}
              style={{
                marginBottom: 12,
                border: '1.5px solid var(--ink)',
                borderLeft: `4px solid ${color}`,
              }}
            >
              <button
                onClick={() => setOpenCategory(isOpen ? null : cat.id)}
                style={{
                  padding: '12px 14px',
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  borderBottom: isOpen ? '1.5px solid var(--ink)' : 'none',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {/* category icon */}
                    <span style={{ color, display: 'flex', alignItems: 'center' }}>
                      {meta?.icon}
                    </span>
                    <div>
                      <div className="goal-category-name">{cat.name}</div>
                      <div className="goal-category-desc" style={{ marginTop: 1 }}>
                        {cat.activities.length} ACTIVITIES
                      </div>
                    </div>
                  </div>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 16, color: 'var(--muted)' }}>
                    {isOpen ? '−' : '+'}
                  </span>
                </div>
              </button>

              {isOpen && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 12 }}>
                  {cat.activities.map((activity) => (
                    <ActivityTile key={activity.id} activity={activity} accent={color} />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="goal-bottom-spacer" />
    </div>
  )
}
