'use client'
import type { MobilityExercise } from '@/lib/types'

interface MobilityTileProps {
  exercise: MobilityExercise
  idx: number
}

export function MobilityTile({ exercise, idx }: MobilityTileProps) {
  return (
    <div className="goal-mobility-tile">
      <div className="goal-mobility-head">
        <div className="goal-mobility-order">{exercise.order}</div>
        <div className="goal-mobility-name">{exercise.movement}</div>
        <div className="goal-mobility-reps">{exercise.sets_reps}</div>
      </div>

      {exercise.notes && (
        <div className="goal-mobility-notes">{exercise.notes}</div>
      )}

      {exercise.video && (
        <a
          href={exercise.video}
          target="_blank"
          rel="noopener noreferrer"
          className="goal-mobility-link"
        >
          ▶ VIDEO
        </a>
      )}
    </div>
  )
}
