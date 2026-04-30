// ─── Minimalift Program ───────────────────────────────────────────────
export interface MinimaliftExercise {
  name: string
  sets: string
  reps: string
  rest: string
  notes: string
  substitutes: string[]
  youtube_url: string | null
}

export interface MinimaliftSection {
  name: string
  exercises: MinimaliftExercise[]
}

export interface MinimaliftWorkout {
  id: string
  phase: number
  week: number
  day: number
  title: string
  source_page: number
  sections: MinimaliftSection[]
}

export interface MinimaliftProgram {
  program: {
    title: string
    description: string
    split: { weekday: string; type: string; day_of_split: number | null }[]
    phases: { number: number; name: string; description: string }[]
  }
  exercises: Record<string, { youtube_url: string | null }>
  workouts: MinimaliftWorkout[]
}

// ─── Cross Training Library ───────────────────────────────────────────
export interface CTMetric {
  key: string
  label: string
  unit: string
  type: string
  improvement_direction: 'up' | 'down' | 'context'
  note?: string
}

export interface CTActivity {
  id: string
  name: string
  description: string
  duration_typical_min: number
  intensity: 'low' | 'moderate' | 'high' | 'max'
  equipment: string[]
  metrics: CTMetric[]
  improvement_tip: string
  youtube_url: string | null
}

export interface CTCategory {
  id: string
  name: string
  icon_hint: string
  description: string
  general_progression_tip: string
  activities: CTActivity[]
}

export interface CrossTrainingLibrary {
  library: Record<string, string>
  categories: CTCategory[]
}

// ─── Mobility Program ─────────────────────────────────────────────────
export interface MobilityExercise {
  order: string
  movement: string
  sets_reps: string
  notes: string
  video: string
}

export interface MobilityDay {
  day: number
  focus: string
  equipment: string[]
  playlist?: string
  exercises: MobilityExercise[]
}

export interface MobilityPhase {
  phase: number
  weeks: string
  days: MobilityDay[]
}

export interface MobilityProgram {
  title: string
  overview: Record<string, unknown>
  wrist_routine: { exercises: MobilityExercise[] }
  phases: MobilityPhase[]
}

// ─── Flattened session for Steadier tab ───────────────────────────────
export interface MobilitySession {
  phase: number
  weeks: string
  day: number
  focus: string
  equipment: string[]
  exercises: MobilityExercise[]
  sessionIndex: number
}
