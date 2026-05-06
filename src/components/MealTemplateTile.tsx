'use client'
import { useState } from 'react'
import type { MealTemplate } from '@/lib/types'
import {
  computeTemplateBaseMacros,
  getFoodById,
  macroDisplay,
} from '@/lib/nutrition'

const QTY_OPTIONS = [0.5, 1, 1.5, 2]

interface Props {
  template: MealTemplate
  onAdd: (quantity: number) => void
}

export function MealTemplateTile({ template, onAdd }: Props) {
  const [qty, setQty] = useState(1)
  const base = computeTemplateBaseMacros(template)
  const total = {
    calories: Math.round(base.calories * qty),
    protein: base.protein * qty,
    carbs: base.carbs * qty,
    fat: base.fat * qty,
  }

  return (
    <div className="goal-meal-tile">
      <div className="goal-meal-tile-head">
        <div className="goal-meal-tile-name">{template.name}</div>
        <div className="goal-meal-tile-kcal">{total.calories} KCAL</div>
      </div>

      <div className="goal-meal-tile-ingredients">
        {template.items.map((it, i) => {
          const food = getFoodById(it.foodId)
          if (!food) return null
          const label = it.quantity === 1
            ? food.servingLabel
            : `${it.quantity}× ${food.servingLabel}`
          return (
            <span key={`${it.foodId}-${i}`}>
              {i > 0 ? ' · ' : ''}
              {food.name} ({label})
            </span>
          )
        })}
      </div>

      <div className="goal-meal-tile-macros">
        <span>P {macroDisplay(total.protein)}g</span>
        <span>C {macroDisplay(total.carbs)}g</span>
        <span>F {macroDisplay(total.fat)}g</span>
      </div>

      <div className="goal-qty-row">
        <span className="goal-qty-label">QTY</span>
        {QTY_OPTIONS.map((opt) => (
          <button
            key={opt}
            className={`goal-qty-chip ${qty === opt ? 'active' : ''}`}
            onClick={() => setQty(opt)}
          >
            {opt}×
          </button>
        ))}
      </div>

      <button className="goal-add-cta" onClick={() => onAdd(qty)}>
        ADD TO TODAY
      </button>
    </div>
  )
}
