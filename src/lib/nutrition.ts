import catalogData from '@/data/nutrition.json'
import type {
  CustomFood,
  DailyNutritionLog,
  FoodItem,
  MacroTotals,
  MealEntryItem,
  MealTemplate,
  MealType,
  NutritionBadges,
  NutritionCatalog,
} from './types'

const catalog = catalogData as NutritionCatalog

export const TARGET_CALORIES = 1750
export const TARGET_PROTEIN = 170
export const HIGH_CARB_THRESHOLD = 190

const SQUASH_FUEL_TEMPLATE_IDS = new Set([
  'snack-banana',
  'snack-banana-whey',
  'snack-banana-energy-gel',
  'snack-dates',
  'snack-chocolate-whey-milk',
])

export function getFoods(): FoodItem[] {
  return catalog.foods
}

export function getFoodById(id: string): FoodItem | undefined {
  return catalog.foods.find((f) => f.id === id)
}

export function getTemplates(): MealTemplate[] {
  return catalog.templates
}

export function getTemplateById(id: string): MealTemplate | undefined {
  return catalog.templates.find((t) => t.id === id)
}

export function getTemplatesByMealType(mealType: MealType): MealTemplate[] {
  return catalog.templates.filter((t) => t.mealType === mealType)
}

function emptyTotals(): MacroTotals {
  return { calories: 0, protein: 0, carbs: 0, fat: 0 }
}

export function computeTemplateBaseMacros(template: MealTemplate): MacroTotals {
  if (template.override) {
    return { ...template.override }
  }
  const totals = emptyTotals()
  for (const item of template.items) {
    const food = getFoodById(item.foodId)
    if (!food) continue
    totals.calories += food.calories * item.quantity
    totals.protein += food.protein * item.quantity
    totals.carbs += food.carbs * item.quantity
    totals.fat += food.fat * item.quantity
  }
  return totals
}

export function computeEntryMacros(entry: MealEntryItem): MacroTotals {
  const qty = entry.quantity
  if (entry.kind === 'template' && entry.templateId) {
    const template = getTemplateById(entry.templateId)
    if (!template) return emptyTotals()
    const base = computeTemplateBaseMacros(template)
    return {
      calories: base.calories * qty,
      protein: base.protein * qty,
      carbs: base.carbs * qty,
      fat: base.fat * qty,
    }
  }
  if (entry.kind === 'custom' && entry.customFood) {
    const f = entry.customFood
    return {
      calories: f.calories * qty,
      protein: f.protein * qty,
      carbs: f.carbs * qty,
      fat: f.fat * qty,
    }
  }
  return emptyTotals()
}

function roundTotals(totals: MacroTotals): MacroTotals {
  return {
    calories: Math.round(totals.calories),
    protein: Math.round(totals.protein * 10) / 10,
    carbs: Math.round(totals.carbs * 10) / 10,
    fat: Math.round(totals.fat * 10) / 10,
  }
}

export function computeDailyTotals(log: DailyNutritionLog): MacroTotals {
  const totals = emptyTotals()
  for (const entry of log.entries) {
    const m = computeEntryMacros(entry)
    totals.calories += m.calories
    totals.protein += m.protein
    totals.carbs += m.carbs
    totals.fat += m.fat
  }
  return roundTotals(totals)
}

export function computeBadges(totals: MacroTotals, log: DailyNutritionLog): NutritionBadges {
  const proteinHit = totals.protein >= TARGET_PROTEIN
  const kcalUnder = totals.calories <= TARGET_CALORIES && totals.calories > 0
  const highCarb = totals.carbs > HIGH_CARB_THRESHOLD
  const squashFuel = log.entries.some(
    (e) => e.kind === 'template' && e.templateId !== undefined && SQUASH_FUEL_TEMPLATE_IDS.has(e.templateId),
  )
  return { proteinHit, kcalUnder, highCarb, squashFuel }
}

export function getTodayDateKey(): string {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export function emptyDailyLog(date: string, linkedWorkoutId?: string): DailyNutritionLog {
  return { date, linkedWorkoutId, entries: [], notes: '' }
}

const LOG_KEY_PREFIX = 'goal_nutrition_'
const CUSTOM_FOODS_KEY = 'goal_nutrition_custom_foods'

export function getStoredLog(date: string): DailyNutritionLog | null {
  try {
    const raw = localStorage.getItem(LOG_KEY_PREFIX + date)
    if (!raw) return null
    return JSON.parse(raw) as DailyNutritionLog
  } catch {
    return null
  }
}

export function setStoredLog(log: DailyNutritionLog): void {
  try {
    localStorage.setItem(LOG_KEY_PREFIX + log.date, JSON.stringify(log))
  } catch {
    // server-side or storage unavailable
  }
}

export function getStoredCustomFoods(): CustomFood[] {
  try {
    const raw = localStorage.getItem(CUSTOM_FOODS_KEY)
    if (!raw) return []
    return JSON.parse(raw) as CustomFood[]
  } catch {
    return []
  }
}

export function addCustomFood(food: CustomFood): CustomFood[] {
  const existing = getStoredCustomFoods()
  const next = [food, ...existing.filter((f) => f.id !== food.id)]
  try {
    localStorage.setItem(CUSTOM_FOODS_KEY, JSON.stringify(next))
  } catch {
    // server-side or storage unavailable
  }
  return next
}

export function removeCustomFood(id: string): CustomFood[] {
  const next = getStoredCustomFoods().filter((f) => f.id !== id)
  try {
    localStorage.setItem(CUSTOM_FOODS_KEY, JSON.stringify(next))
  } catch {
    // server-side or storage unavailable
  }
  return next
}

export function newEntryId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

export function getStoredWorkoutIdSafe(): string | undefined {
  try {
    return localStorage.getItem('goal_stronger_day') ?? undefined
  } catch {
    return undefined
  }
}

export function formatDateKey(date: string): string {
  const [y, m, d] = date.split('-')
  return `${y}-${m}-${d}`
}

export function macroDisplay(value: number): string {
  return (Math.round(value * 10) / 10).toString()
}
