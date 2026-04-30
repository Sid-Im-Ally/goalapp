'use client'
import { useState, useEffect } from 'react'

interface RestTimerProps {
  seconds: number
  resetKey: string
}

export function RestTimer({ seconds, resetKey }: RestTimerProps) {
  const [running, setRunning] = useState(false)
  const [remain, setRemain] = useState(seconds)

  useEffect(() => {
    setRemain(seconds)
    setRunning(false)
  }, [seconds, resetKey])

  useEffect(() => {
    if (!running) return
    if (remain <= 0) { setRunning(false); return }
    const t = setTimeout(() => setRemain((r) => r - 1), 1000)
    return () => clearTimeout(t)
  }, [running, remain])

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
  const pct = seconds > 0 ? ((seconds - remain) / seconds) * 100 : 0

  return (
    <button
      className={`goal-rest ${running ? 'running' : ''}`}
      onClick={() => {
        if (remain === 0) setRemain(seconds)
        setRunning(!running)
      }}
    >
      <span className="goal-rest-label">REST</span>
      <span className="goal-rest-time">{fmt(remain)}</span>
      {running && <div className="goal-rest-fill" style={{ width: `${pct}%` }} />}
    </button>
  )
}
