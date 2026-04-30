'use client'
import { useState } from 'react'
import { Header } from '@/components/Header'
import { MobilityTile } from '@/components/MobilityTile'
import {
  getAllSessions,
  getTotalSessionCount,
  getStoredSessionIndex,
  setStoredSessionIndex,
} from '@/lib/steadier'

export default function SteadierTab() {
  const sessions = getAllSessions()
  const total = getTotalSessionCount()
  const [sessionIdx, setSessionIdx] = useState<number>(() => getStoredSessionIndex())

  const session = sessions[sessionIdx]

  const goNext = () => {
    const next = Math.min(sessionIdx + 1, total - 1)
    setStoredSessionIndex(next)
    setSessionIdx(next)
  }

  const goPrev = () => {
    const prev = Math.max(sessionIdx - 1, 0)
    setStoredSessionIndex(prev)
    setSessionIdx(prev)
  }

  if (!session) return null

  const subtitle = `PHASE ${session.phase} · WKS ${session.weeks} · DAY ${session.day}`

  return (
    <div className="goal-tabview goal-theme-steadier">
      <Header
        tab="STEADIER"
        subtitle={subtitle}
        current={sessionIdx + 1}
        total={total}
        accent="#16a34a"
      />

      <div className="goal-workout-meta">
        <div className="goal-workout-title">{session.focus}</div>
        {session.equipment.length > 0 && (
          <div className="goal-workout-dur">{session.equipment.join(', ')}</div>
        )}
      </div>

      <div className="goal-tile-stack">
        {session.exercises.map((ex, i) => (
          <MobilityTile key={`${ex.order}-${ex.movement}`} exercise={ex} idx={i} />
        ))}
      </div>

      <div style={{ display: 'flex', margin: '16px 16px 0', gap: 8 }}>
        <button
          className="goal-next-btn"
          style={{ flex: 1, opacity: sessionIdx === 0 ? 0.4 : 1 }}
          onClick={goPrev}
          disabled={sessionIdx === 0}
        >
          <span>← PREV SESSION</span>
        </button>
        <button
          className="goal-next-btn"
          style={{ flex: 1, opacity: sessionIdx === total - 1 ? 0.4 : 1 }}
          onClick={goNext}
          disabled={sessionIdx === total - 1}
        >
          <span>NEXT SESSION →</span>
        </button>
      </div>

      <div className="goal-bottom-spacer" />
    </div>
  )
}
