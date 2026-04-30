import programData from '@/data/minimalift_program.json'
import type { MinimaliftWorkout, MinimaliftProgram } from './types'

const data = programData as MinimaliftProgram

export function getWorkouts(): MinimaliftWorkout[] {
  return data.workouts
}

export function getTotalWorkoutCount(): number {
  return data.workouts.length
}

export function getWorkoutById(id: string): MinimaliftWorkout | undefined {
  return data.workouts.find((w) => w.id === id)
}

export function getWorkoutIndex(id: string): number {
  return data.workouts.findIndex((w) => w.id === id)
}

export function getNextWorkoutId(currentId: string): string {
  const idx = getWorkoutIndex(currentId)
  if (idx === -1 || idx >= data.workouts.length - 1) return data.workouts[0].id
  return data.workouts[idx + 1].id
}

export function getPrevWorkoutId(currentId: string): string {
  const idx = getWorkoutIndex(currentId)
  if (idx <= 0) return data.workouts[data.workouts.length - 1].id
  return data.workouts[idx - 1].id
}

const STORAGE_KEY = 'goal_stronger_day'

export function getStoredWorkoutId(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? data.workouts[0].id
  } catch {
    return data.workouts[0].id
  }
}

export function setStoredWorkoutId(id: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, id)
  } catch {
    // server-side or storage unavailable
  }
}
