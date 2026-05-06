'use client'
import { useEffect, useMemo, useState } from 'react'
import { Header } from '@/components/Header'
import { MealTemplateTile } from '@/components/MealTemplateTile'
import { SelectedEntryRow } from '@/components/SelectedEntryRow'
import {
  TARGET_CALORIES,
  TARGET_PROTEIN,
  addCustomFood,
  computeBadges,
  computeDailyTotals,
  computeEntryMacros,
  emptyDailyLog,
  getStoredCustomFoods,
  getStoredLog,
  getStoredWorkoutIdSafe,
  getTemplatesByMealType,
  getTodayDateKey,
  macroDisplay,
  newEntryId,
  removeCustomFood,
  setStoredLog,
} from '@/lib/nutrition'
import type {
  CustomFood,
  DailyNutritionLog,
  MacroTotals,
  MealEntryItem,
  MealSection,
  MealType,
} from '@/lib/types'

const SECTIONS: { id: MealSection; label: string; mealType?: MealType }[] = [
  { id: 'breakfast', label: 'BREAKFAST', mealType: 'breakfast' },
  { id: 'lunch', label: 'LUNCH', mealType: 'lunch' },
  { id: 'snack', label: 'SNACK / PRE-WORKOUT', mealType: 'snack' },
  { id: 'dinner', label: 'DINNER', mealType: 'dinner' },
  { id: 'custom', label: 'CUSTOM' },
]

interface CustomFormState {
  name: string
  servingLabel: string
  calories: string
  protein: string
  carbs: string
  fat: string
  saveReusable: boolean
}

const EMPTY_CUSTOM_FORM: CustomFormState = {
  name: '',
  servingLabel: '',
  calories: '',
  protein: '',
  carbs: '',
  fat: '',
  saveReusable: false,
}

export default function NutritionTab() {
  const today = getTodayDateKey()

  const [log, setLog] = useState<DailyNutritionLog>(() => {
    const stored = getStoredLog(today)
    if (stored) return stored
    return emptyDailyLog(today, getStoredWorkoutIdSafe())
  })
  const [openPicker, setOpenPicker] = useState<MealSection | null>(null)
  const [customForm, setCustomForm] = useState<CustomFormState>(EMPTY_CUSTOM_FORM)
  const [savedCustoms, setSavedCustoms] = useState<CustomFood[]>(() => getStoredCustomFoods())

  useEffect(() => {
    setStoredLog(log)
  }, [log])

  useEffect(() => {
    if (!log.linkedWorkoutId) {
      const wid = getStoredWorkoutIdSafe()
      if (wid) setLog((l) => ({ ...l, linkedWorkoutId: wid }))
    }
  }, [log.linkedWorkoutId])

  const totals = useMemo(() => computeDailyTotals(log), [log])
  const badges = useMemo(() => computeBadges(totals, log), [totals, log])

  const sectionTotals = useMemo(() => {
    const out: Record<MealSection, MacroTotals> = {
      breakfast: { calories: 0, protein: 0, carbs: 0, fat: 0 },
      lunch: { calories: 0, protein: 0, carbs: 0, fat: 0 },
      snack: { calories: 0, protein: 0, carbs: 0, fat: 0 },
      dinner: { calories: 0, protein: 0, carbs: 0, fat: 0 },
      custom: { calories: 0, protein: 0, carbs: 0, fat: 0 },
    }
    for (const e of log.entries) {
      const m = computeEntryMacros(e)
      const t = out[e.section]
      t.calories += m.calories
      t.protein += m.protein
      t.carbs += m.carbs
      t.fat += m.fat
    }
    return out
  }, [log])

  const addTemplateEntry = (section: MealSection, templateId: string, quantity: number) => {
    const entry: MealEntryItem = {
      id: newEntryId(),
      section,
      kind: 'template',
      templateId,
      quantity,
    }
    setLog((l) => ({ ...l, entries: [...l.entries, entry] }))
    setOpenPicker(null)
  }

  const updateEntryQty = (id: string, quantity: number) => {
    setLog((l) => ({
      ...l,
      entries: l.entries.map((e) => (e.id === id ? { ...e, quantity } : e)),
    }))
  }

  const removeEntry = (id: string) => {
    setLog((l) => ({ ...l, entries: l.entries.filter((e) => e.id !== id) }))
  }

  const addCustomEntry = () => {
    const f = customForm
    if (!f.name.trim()) return
    const calories = Number(f.calories) || 0
    const protein = Number(f.protein) || 0
    const carbs = Number(f.carbs) || 0
    const fat = Number(f.fat) || 0

    const food: CustomFood = {
      id: 'custom-' + newEntryId(),
      name: f.name.trim(),
      servingLabel: f.servingLabel.trim() || '1 serving',
      calories,
      protein,
      carbs,
      fat,
    }
    const entry: MealEntryItem = {
      id: newEntryId(),
      section: 'custom',
      kind: 'custom',
      customFood: food,
      quantity: 1,
    }
    setLog((l) => ({ ...l, entries: [...l.entries, entry] }))

    if (f.saveReusable) {
      const next = addCustomFood(food)
      setSavedCustoms(next)
    }
    setCustomForm(EMPTY_CUSTOM_FORM)
  }

  const addSavedCustom = (food: CustomFood) => {
    const entry: MealEntryItem = {
      id: newEntryId(),
      section: 'custom',
      kind: 'custom',
      customFood: food,
      quantity: 1,
    }
    setLog((l) => ({ ...l, entries: [...l.entries, entry] }))
  }

  const deleteSavedCustom = (id: string) => {
    const next = removeCustomFood(id)
    setSavedCustoms(next)
  }

  const setNotes = (notes: string) => setLog((l) => ({ ...l, notes }))

  const kcalPct = Math.min(100, (totals.calories / TARGET_CALORIES) * 100)
  const proteinPct = Math.min(100, (totals.protein / TARGET_PROTEIN) * 100)

  return (
    <div className="goal-tabview goal-theme-nutrition">
      <Header
        tab="NUTRITION"
        subtitle={`TODAY · ${today}`}
        current={0}
        total={0}
        accent="#7c3aed"
      />

      <div className="goal-nutrition-totals">
        <div className="goal-nutrition-grid">
          <div className="goal-nutrition-cell">
            <div className="goal-nutrition-cell-label">KCAL</div>
            <div className="goal-nutrition-cell-val">{totals.calories}</div>
            <div className="goal-nutrition-cell-target">/ {TARGET_CALORIES}</div>
          </div>
          <div className="goal-nutrition-cell">
            <div className="goal-nutrition-cell-label">PROTEIN</div>
            <div className="goal-nutrition-cell-val">{macroDisplay(totals.protein)}</div>
            <div className="goal-nutrition-cell-target">/ {TARGET_PROTEIN}g</div>
          </div>
          <div className="goal-nutrition-cell">
            <div className="goal-nutrition-cell-label">CARBS</div>
            <div className="goal-nutrition-cell-val">{macroDisplay(totals.carbs)}</div>
            <div className="goal-nutrition-cell-target">g</div>
          </div>
          <div className="goal-nutrition-cell">
            <div className="goal-nutrition-cell-label">FAT</div>
            <div className="goal-nutrition-cell-val">{macroDisplay(totals.fat)}</div>
            <div className="goal-nutrition-cell-target">g</div>
          </div>
        </div>

        <div className="goal-nutrition-bar-row">
          <div className="goal-nutrition-bar-label">
            <span>CALORIES</span>
            <span>{Math.round(kcalPct)}%</span>
          </div>
          <div className="goal-nutrition-bar">
            <div className="goal-nutrition-bar-fill" style={{ width: `${kcalPct}%` }} />
          </div>
        </div>
        <div className="goal-nutrition-bar-row">
          <div className="goal-nutrition-bar-label">
            <span>PROTEIN</span>
            <span>{Math.round(proteinPct)}%</span>
          </div>
          <div className="goal-nutrition-bar">
            <div className="goal-nutrition-bar-fill" style={{ width: `${proteinPct}%` }} />
          </div>
        </div>

        {(badges.proteinHit || badges.kcalUnder || badges.highCarb || badges.squashFuel) && (
          <div className="goal-nutrition-badges">
            {badges.proteinHit && (
              <span className="goal-nutrition-badge filled">PROTEIN TARGET HIT</span>
            )}
            {badges.kcalUnder && (
              <span className="goal-nutrition-badge accent">CALORIES UNDER TARGET</span>
            )}
            {badges.highCarb && (
              <span className="goal-nutrition-badge">HIGH-CARB DAY</span>
            )}
            {badges.squashFuel && (
              <span className="goal-nutrition-badge accent">SQUASH FUEL DAY</span>
            )}
          </div>
        )}
      </div>

      {log.linkedWorkoutId && (
        <div className="goal-nutrition-link-chip">
          LINKED WORKOUT · <strong>{log.linkedWorkoutId}</strong>
        </div>
      )}

      {SECTIONS.map((section) => {
        const entries = log.entries.filter((e) => e.section === section.id)
        const subTotal = sectionTotals[section.id]
        const isPickerOpen = openPicker === section.id
        const templates = section.mealType ? getTemplatesByMealType(section.mealType) : []

        return (
          <div key={section.id} className="goal-nutrition-section">
            <div className="goal-nutrition-section-head">
              <div className="goal-nutrition-section-name">{section.label}</div>
              <div className="goal-nutrition-section-totals">
                {Math.round(subTotal.calories)} kcal · P{macroDisplay(subTotal.protein)}
              </div>
            </div>

            {entries.map((e) => (
              <SelectedEntryRow
                key={e.id}
                entry={e}
                onChangeQty={(q) => updateEntryQty(e.id, q)}
                onRemove={() => removeEntry(e.id)}
              />
            ))}

            {section.id === 'custom' ? (
              <CustomSection
                form={customForm}
                onChange={setCustomForm}
                onAdd={addCustomEntry}
                savedCustoms={savedCustoms}
                onAddSaved={addSavedCustom}
                onDeleteSaved={deleteSavedCustom}
              />
            ) : (
              <>
                {!isPickerOpen ? (
                  <button
                    className="goal-add-cta ghost"
                    onClick={() => setOpenPicker(section.id)}
                  >
                    + ADD MEAL
                  </button>
                ) : (
                  <div className="goal-picker">
                    <button
                      className="goal-picker-close"
                      onClick={() => setOpenPicker(null)}
                    >
                      ✕ CLOSE
                    </button>
                    {templates.map((t) => (
                      <MealTemplateTile
                        key={t.id}
                        template={t}
                        onAdd={(qty) => addTemplateEntry(section.id, t.id, qty)}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )
      })}

      <div className="goal-nutrition-section">
        <div className="goal-nutrition-section-head">
          <div className="goal-nutrition-section-name">NOTES</div>
        </div>
        <textarea
          className="goal-notes-input"
          value={log.notes}
          placeholder="Anything to remember about today's eating..."
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className="goal-bottom-spacer" />
    </div>
  )
}

interface CustomSectionProps {
  form: CustomFormState
  onChange: (form: CustomFormState) => void
  onAdd: () => void
  savedCustoms: CustomFood[]
  onAddSaved: (food: CustomFood) => void
  onDeleteSaved: (id: string) => void
}

function CustomSection({
  form,
  onChange,
  onAdd,
  savedCustoms,
  onAddSaved,
  onDeleteSaved,
}: CustomSectionProps) {
  const update = (patch: Partial<CustomFormState>) => onChange({ ...form, ...patch })

  return (
    <>
      {savedCustoms.length > 0 && (
        <div className="goal-saved-customs">
          {savedCustoms.map((f) => (
            <span key={f.id} className="goal-saved-chip">
              <button
                onClick={() => onAddSaved(f)}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', font: 'inherit', color: 'inherit', letterSpacing: 'inherit' }}
              >
                + {f.name}
              </button>
              <button
                className="goal-saved-chip-x"
                onClick={() => onDeleteSaved(f.id)}
                aria-label="Delete saved"
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="goal-custom-form">
        <div className="goal-custom-row full">
          <div>
            <div className="goal-custom-label">NAME</div>
            <input
              className="goal-custom-input text"
              type="text"
              value={form.name}
              placeholder="e.g. Trader Joe's scallion pancake"
              onChange={(e) => update({ name: e.target.value })}
            />
          </div>
        </div>
        <div className="goal-custom-row">
          <div>
            <div className="goal-custom-label">SERVING</div>
            <input
              className="goal-custom-input text"
              type="text"
              value={form.servingLabel}
              placeholder="1 piece"
              onChange={(e) => update({ servingLabel: e.target.value })}
            />
          </div>
          <div>
            <div className="goal-custom-label">KCAL</div>
            <input
              className="goal-custom-input"
              type="number"
              inputMode="decimal"
              value={form.calories}
              placeholder="0"
              onChange={(e) => update({ calories: e.target.value })}
            />
          </div>
        </div>
        <div className="goal-custom-row">
          <div>
            <div className="goal-custom-label">PROTEIN g</div>
            <input
              className="goal-custom-input"
              type="number"
              inputMode="decimal"
              value={form.protein}
              placeholder="0"
              onChange={(e) => update({ protein: e.target.value })}
            />
          </div>
          <div>
            <div className="goal-custom-label">CARBS g</div>
            <input
              className="goal-custom-input"
              type="number"
              inputMode="decimal"
              value={form.carbs}
              placeholder="0"
              onChange={(e) => update({ carbs: e.target.value })}
            />
          </div>
        </div>
        <div className="goal-custom-row">
          <div>
            <div className="goal-custom-label">FAT g</div>
            <input
              className="goal-custom-input"
              type="number"
              inputMode="decimal"
              value={form.fat}
              placeholder="0"
              onChange={(e) => update({ fat: e.target.value })}
            />
          </div>
          <label className="goal-custom-toggle" style={{ alignSelf: 'end', paddingBottom: 4 }}>
            <input
              type="checkbox"
              checked={form.saveReusable}
              onChange={(e) => update({ saveReusable: e.target.checked })}
            />
            SAVE AS REUSABLE
          </label>
        </div>
        <button className="goal-add-cta" onClick={onAdd}>
          ADD TO TODAY
        </button>
      </div>
    </>
  )
}
