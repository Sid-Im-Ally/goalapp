export interface LoggedSession {
  id: string
  activityId: string
  date: string        // ISO date e.g. "2026-04-29"
  timestamp: number
  values: Record<string, string>
}

const STORAGE_KEY = 'goal_faster_sessions'

function loadAll(): LoggedSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as LoggedSession[]
  } catch {
    return []
  }
}

function saveAll(sessions: LoggedSession[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
  } catch {
    // storage unavailable
  }
}

export function getSessionsForActivity(activityId: string): LoggedSession[] {
  return loadAll()
    .filter((s) => s.activityId === activityId)
    .sort((a, b) => b.timestamp - a.timestamp)
}

export function logSession(
  activityId: string,
  values: Record<string, string>
): LoggedSession {
  const all = loadAll()
  const session: LoggedSession = {
    id: `${activityId}-${Date.now()}`,
    activityId,
    date: new Date().toISOString().slice(0, 10),
    timestamp: Date.now(),
    values,
  }
  saveAll([session, ...all])
  return session
}

export function deleteSession(id: string): void {
  saveAll(loadAll().filter((s) => s.id !== id))
}
