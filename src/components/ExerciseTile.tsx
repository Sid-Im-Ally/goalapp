'use client'
import { useState } from 'react'
import { SetBox } from './SetBox'
import { RestTimer } from './RestTimer'
import type { MinimaliftExercise } from '@/lib/types'

interface ExerciseTileProps {
  exercise: MinimaliftExercise
  idx: number
  storageKey: string
}

function parseSetCount(sets: string): number {
  const n = parseInt(sets, 10)
  return isNaN(n) ? 1 : n
}

function parseRestSeconds(rest: string): number {
  if (!rest || rest === '-' || rest === '0s') return 0
  const match = rest.match(/(\d+)/)
  return match ? parseInt(match[1], 10) : 0
}

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw !== null ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function writeStorage(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
}

export function ExerciseTile({ exercise, idx, storageKey }: ExerciseTileProps) {
  const setCount = parseSetCount(exercise.sets)
  const restSeconds = parseRestSeconds(exercise.rest)

  const [done, setDone] = useState<boolean[]>(() =>
    readStorage<boolean[]>(`goal_done_${storageKey}`, Array(setCount).fill(false))
  )
  const [showSubs, setShowSubs] = useState(false)
  const [restingFor, setRestingFor] = useState<number | null>(null)
  const [load, setLoad] = useState<string>(() =>
    readStorage<string>(`goal_load_${storageKey}`, '')
  )

  const toggle = (i: number) => {
    const next = [...done]
    next[i] = !next[i]
    setDone(next)
    writeStorage(`goal_done_${storageKey}`, next)
    if (next[i]) setRestingFor(i)
  }

  const handleLoadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoad(e.target.value)
    writeStorage(`goal_load_${storageKey}`, e.target.value)
  }

  const completed = done.filter(Boolean).length
  const allDone = completed === setCount

  return (
    <div className={`goal-extile ${allDone ? 'complete' : ''}`}>
      <div className="goal-extile-head">
        <div className="goal-extile-num">{String(idx + 1).padStart(2, '0')}</div>
        <div className="goal-extile-name">{exercise.name}</div>
        <div className="goal-extile-progress">{completed}/{setCount}</div>
      </div>

      <div className="goal-extile-stats">
        <div className="goal-stat">
          <div className="goal-stat-label">SETS×REPS</div>
          <div className="goal-stat-val">
            {exercise.sets}<span className="goal-stat-x">×</span>{exercise.reps}
          </div>
        </div>
        <div className="goal-stat">
          <div className="goal-stat-label">REST</div>
          <div className="goal-stat-val">{exercise.rest || '—'}</div>
        </div>
        <div className="goal-stat">
          <div className="goal-stat-label">LOAD</div>
          <input
            type="text"
            inputMode="decimal"
            value={load}
            onChange={handleLoadChange}
            placeholder="—"
            className="goal-stat-val goal-load-input"
          />
        </div>
      </div>

      <div className="goal-extile-sets">
        {done.map((d, i) => (
          <SetBox key={i} idx={i} done={d} onClick={() => toggle(i)} />
        ))}
        {restSeconds > 0 && (
          <RestTimer
            seconds={restSeconds}
            resetKey={`${idx}-${restingFor}`}
          />
        )}
      </div>

      {exercise.notes && (
        <div className="goal-extile-notes">
          <span className="goal-notes-label">NOTE</span>
          <span>{exercise.notes}</span>
        </div>
      )}

      {exercise.substitutes && exercise.substitutes.length > 0 && (
        <>
          <button className="goal-subs-toggle" onClick={() => setShowSubs(!showSubs)}>
            <span>SUBSTITUTES</span>
            <span className="goal-chev">{showSubs ? '−' : '+'}</span>
          </button>
          {showSubs && (
            <ul className="goal-subs-list">
              {exercise.substitutes.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          )}
        </>
      )}

      {exercise.youtube_url && (
        <a
          href={exercise.youtube_url}
          target="_blank"
          rel="noopener noreferrer"
          className="goal-mobility-link"
          style={{ marginTop: 8, display: 'inline-block' }}
        >
          ▶ VIDEO
        </a>
      )}
    </div>
  )
}
