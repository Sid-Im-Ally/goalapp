'use client'

interface SetBoxProps {
  done: boolean
  onClick: () => void
  idx: number
}

export function SetBox({ done, onClick, idx }: SetBoxProps) {
  return (
    <button
      className={`goal-setbox ${done ? 'done' : ''}`}
      onClick={onClick}
      aria-label={`Set ${idx + 1}`}
    >
      {done ? (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <polyline points="2,7 6,11 12,3" stroke="white" strokeWidth="2" strokeLinecap="square" fill="none" />
        </svg>
      ) : (
        <span>{idx + 1}</span>
      )}
    </button>
  )
}
