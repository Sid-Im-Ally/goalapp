'use client'
import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { ExerciseTile } from '@/components/ExerciseTile'
import {
  getWorkouts,
  getTotalWorkoutCount,
  getStoredWorkoutId,
  setStoredWorkoutId,
  getNextWorkoutId,
  getPrevWorkoutId,
  getWorkoutById,
  getWorkoutIndex,
} from '@/lib/stronger'

export default function StrongerTab() {
  const total = getTotalWorkoutCount()
  const [workoutId, setWorkoutId] = useState<string>(() => getStoredWorkoutId())

  const workout = getWorkoutById(workoutId) ?? getWorkouts()[0]
  const currentIndex = getWorkoutIndex(workoutId) + 1

  const goNext = () => {
    const nextId = getNextWorkoutId(workoutId)
    setStoredWorkoutId(nextId)
    setWorkoutId(nextId)
  }

  const goPrev = () => {
    const prevId = getPrevWorkoutId(workoutId)
    setStoredWorkoutId(prevId)
    setWorkoutId(prevId)
  }

  if (!workout) return null

  const subtitle = `PHASE ${workout.phase} · WK ${workout.week} · DAY ${workout.day}`

  return (
    <div className="goal-tabview goal-theme-stronger">
      <Header
        tab="STRONGER"
        subtitle={subtitle}
        current={currentIndex}
        total={total}
        accent="#dc2626"
      />

      <div className="goal-workout-meta">
        <div className="goal-workout-title">{workout.title}</div>
        <div className="goal-workout-dur">{workout.id}</div>
      </div>

      {workout.sections.map((section) => (
        <div key={section.name} className="goal-tile-stack">
          <div className="goal-section-header">{section.name}</div>
          {section.exercises.map((ex, i) => (
            <ExerciseTile
              key={`${section.name}-${ex.name}-${i}`}
              exercise={ex}
              idx={i}
              storageKey={`${workoutId}/${section.name}/${i}`}
            />
          ))}
        </div>
      ))}

      <div style={{ display: 'flex', margin: '16px 16px 0', gap: 8 }}>
        <button className="goal-next-btn" style={{ flex: 1 }} onClick={goPrev}>
          <span>← PREV</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, opacity: 0.5 }}>
            {getPrevWorkoutId(workoutId)}
          </span>
        </button>
        <button className="goal-next-btn" style={{ flex: 1 }} onClick={goNext}>
          <span>NEXT →</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, opacity: 0.5 }}>
            {getNextWorkoutId(workoutId)}
          </span>
        </button>
      </div>

      <div className="goal-bottom-spacer" />
    </div>
  )
}
