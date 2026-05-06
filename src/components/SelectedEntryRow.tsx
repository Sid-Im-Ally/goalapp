'use client'
import type { MealEntryItem } from '@/lib/types'
import {
  computeEntryMacros,
  getTemplateById,
  macroDisplay,
} from '@/lib/nutrition'

const QTY_CYCLE = [0.5, 1, 1.5, 2]

interface Props {
  entry: MealEntryItem
  onChangeQty: (quantity: number) => void
  onRemove: () => void
}

export function SelectedEntryRow({ entry, onChangeQty, onRemove }: Props) {
  const macros = computeEntryMacros(entry)

  let name = 'Unknown'
  if (entry.kind === 'template' && entry.templateId) {
    const t = getTemplateById(entry.templateId)
    if (t) name = t.name
  } else if (entry.kind === 'custom' && entry.customFood) {
    name = entry.customFood.name
  }

  const cycleQty = () => {
    const idx = QTY_CYCLE.indexOf(entry.quantity)
    const next = QTY_CYCLE[(idx + 1) % QTY_CYCLE.length]
    onChangeQty(next)
  }

  return (
    <div className="goal-meal-row">
      <div className="goal-meal-row-main">
        <div className="goal-meal-row-name">{name}</div>
        <div className="goal-meal-row-meta">
          {Math.round(macros.calories)} kcal · P {macroDisplay(macros.protein)} ·
          C {macroDisplay(macros.carbs)} · F {macroDisplay(macros.fat)}
        </div>
      </div>
      <button className="goal-meal-row-qty" onClick={cycleQty}>
        {entry.quantity}×
      </button>
      <button className="goal-meal-row-remove" onClick={onRemove} aria-label="Remove">
        ×
      </button>
    </div>
  )
}
