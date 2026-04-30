# Minimalift Program JSON — Schema & Notes

This is the source-of-truth data file for the Minimalift fitness app.
It was extracted from `Minimalift_5_Day.pdf` programmatically:
- Tables parsed with `pdfplumber`
- Exercise → YouTube URLs extracted from PDF link annotations with `PyMuPDF`

## File: `minimalift_program.json` (~205 KB)

```
{
  "program":   { ...metadata about the program... },
  "exercises": { [exerciseName]: { "youtube_url": string|null } },
  "workouts":  [ ...60 workout day entries... ]
}
```

### `program` (object)
- `title`, `description`: human-readable
- `split`: 7-element array, one per weekday. Each entry has:
  - `weekday` ("Monday" … "Sunday")
  - `type`: `"workout"` | `"rest_or_cardio"` | `"rest"`
  - `day_of_split`: 1–5 for workout days, `null` for rest days. This is the
    "which lifting day are you on this week" pointer.
- `phases`: array of 3 phase descriptors (Base / Build / Peak).

### `exercises` (object)
A flat map keyed by exercise name. 123 unique names total.
Every name that appears anywhere in the program (main exercise OR substitute)
has an entry. Most have a `youtube_url` (bit.ly redirect to YouTube — clicking
opens the demo video). One exercise ("Backwards Treadmill Walk") has
`youtube_url: null` because the source PDF didn't link it. Handle null
gracefully in the UI.

Same URL may appear under multiple names — e.g., one demo video covers
both "Chin Up" and "Pull Up", "Romanian Deadlift" and "Barbell RDL", etc.
This is faithful to the source PDF.

### `workouts` (array, 60 entries)
Sorted in program order: P1-W1-D1, P1-W1-D2, … P3-W4-D5.

```
{
  "id": "P1-W1-D1",          // unique key
  "phase": 1,                 // 1, 2, or 3
  "week": 1,                  // 1–4 within the phase
  "day": 1,                   // 1–5 (the day-of-split, NOT day of week)
  "title": "Lower Body 1",    // "Lower Body 1/2", "Upper Body 1/2", or "Full Body"
  "source_page": 6,           // page in original PDF — useful for debugging
  "sections": [
    {
      "name": "Warm Up",      // | "Strength & Condition" | "Swole & Flexy"
                              // | "Accessories" | "Metabolic Conditioning"
      "exercises": [
        {
          "name": "Pogos",
          "sets": "3",        // STRINGS, not numbers (could be "AMRAP", "10", "3")
          "reps": "20",       // STRINGS — could be "6-10", "10 e/s", "30s", "10s"
          "rest": "0-10s",    // STRINGS — could be "60s", "-", "0s"
          "notes": "Stay light on your feet and keep your knees soft",
          "substitutes": ["Calf Raise", "Stand to Triple Extension"],
          "youtube_url": "https://bit.ly/42A85k9"  // null if unmapped
        }
      ]
    }
  ]
}
```

## Important data quirks

1. **`sets`, `reps`, `rest` are strings, not numbers.** Common values include
   `"AMRAP"`, `"10 e/s"` (each side), `"30s"` (seconds), `"6-10"` (range), `"-"`
   (none/not applicable). Don't try to coerce to integers.

2. **Section ordering matters.** The UI should render sections in the order
   they appear in the array — that's the workout's intended flow.

3. **Notes carry pairing intent.** Some notes describe how exercises pair
   (e.g., "Perform immediately after each set of Dumbbell Presses, then rest").
   For MVP just display the note text. Long-term you might model supersets
   explicitly.

4. **Substitutes are a 0–2 element array.** Render as small chips/tags below
   the main exercise.

5. **One source-PDF typo was corrected:** page 46 was labeled "Phase 2 Week 1
   Day 5" but is actually Phase 2 Week 4 Day 5 (it follows the W4D4 page and
   precedes the Phase 3 cover). The JSON has the corrected values.

## Suggested app behavior

- Maintain a `current_day_pointer` in local storage: `{ phase, week, day }`,
  starting at `{1, 1, 1}`.
- The pointer advances ONLY when the user marks a workout complete. Rest
  days (Wed and Sun) do not advance the pointer.
- "Today" is computed as: the workout matching the current pointer if today's
  weekday is a workout day in the split; otherwise show the rest/cardio tile.
- Cardio notes are logged per-date (not per-workout-day), so they exist
  even on rest days.
- Exercise tracking log: keep separate from this static program file.
  Suggested shape per workout-completion record:
  ```
  {
    "date": "2026-04-29",
    "workout_id": "P1-W1-D1",
    "exercises": [
      { "name": "Barbell Squat",
        "sets": [{ "weight": 185, "reps": 8 }, { "weight": 205, "reps": 3 }, ...],
        "notes": "felt strong" }
    ],
    "cardio_notes": "30 min Z2 bike",
    "completed_at": "2026-04-29T07:42:00Z"
  }
  ```
