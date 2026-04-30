import mobilityData from '@/data/align_8_week_mobility_program.json'
import type { MobilityProgram, MobilitySession } from './types'

const data = mobilityData as unknown as MobilityProgram

export function getAllSessions(): MobilitySession[] {
  const sessions: MobilitySession[] = []
  let idx = 0
  for (const phase of data.phases) {
    for (const day of phase.days) {
      const equipment = Array.isArray(day.equipment)
        ? day.equipment
        : day.equipment
          ? [day.equipment as unknown as string]
          : []
      sessions.push({
        phase: phase.phase,
        weeks: phase.weeks,
        day: day.day,
        focus: day.focus,
        equipment,
        exercises: day.exercises,
        sessionIndex: idx,
      })
      idx++
    }
  }
  return sessions
}

export function getTotalSessionCount(): number {
  return getAllSessions().length
}

const STORAGE_KEY = 'goal_steadier_day'

export function getStoredSessionIndex(): number {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === null) return 0
    const n = parseInt(stored, 10)
    return isNaN(n) ? 0 : n
  } catch {
    return 0
  }
}

export function setStoredSessionIndex(n: number): void {
  try {
    localStorage.setItem(STORAGE_KEY, String(n))
  } catch {
    // server-side or storage unavailable
  }
}
