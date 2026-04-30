# Cross-Training Library — Schema & Notes

Companion file to `minimalift_program.json`. While the lifting program is
date-ordered (do today's workout), this is a **picker library** — choose
what you did this evening and log its metrics.

## File: `cross_training_library.json` (~50 KB)

```
{
  "library":    { ...metadata... },
  "categories": [ ...6 categories: squash, running, core, plyometrics, stretching, recovery... ]
}
```

## Category shape

```json
{
  "id": "running",
  "name": "Running",
  "icon_hint": "running",
  "description": "...",
  "general_progression_tip": "...",
  "activities": [ ...7-8 per category... ]
}
```

`icon_hint` is a free-form string for the UI to map to whatever icon library
you're using (lucide-react, heroicons, etc.).

## Activity shape

```json
{
  "id": "easy-run",
  "name": "Easy / Zone 2 Run",
  "description": "...",
  "duration_typical_min": 30,
  "intensity": "low",                   // "low" | "moderate" | "high" | "max"
  "equipment": ["running shoes"],
  "metrics": [ ...trackable fields... ],
  "improvement_tip": "...",
  "youtube_url": null
}
```

## Metric shape

```json
{
  "key": "avg_pace_per_mi",             // machine name, used as log field key
  "label": "Avg pace",                  // display label
  "unit": "min/mi",                     // human-readable unit
  "type": "pace",                       // "number" | "pace" | "duration" | "rating" | "text" | "time"
  "improvement_direction": "down",      // "up" | "down" | "context"
  "note": "At constant easy HR..."      // optional extra UX hint
}
```

### `type` values

- `"number"`: plain numeric input
- `"pace"`: minutes-per-mile or similar; render as `mm:ss`
- `"duration"`: time elapsed; render as `mm:ss` or `hh:mm:ss`
- `"rating"`: 1-10 self-rated; render as a slider or numeric stepper
- `"text"`: freeform notes
- `"time"`: clock time (e.g., bed time); render as time picker

### `improvement_direction` values

- `"up"`: bigger numbers = better (max distance, hold time, reps)
- `"down"`: smaller numbers = better (mile pace, contact time, resting HR)
- `"context"`: depends on the goal/situation (HR can be either; avg pace on a
  long run isn't a fitness signal); the UI should not show a green/red trend
  arrow for these. Just plot the history.

## Suggested logging shape

The static library defines what's trackable. User-logged sessions are
separate (keep them in IndexedDB). Suggested per-session record:

```json
{
  "id": "uuid",
  "date": "2026-04-29",
  "activity_id": "easy-run",
  "category_id": "running",
  "metrics": {
    "distance_mi": 3.2,
    "duration_min": 32,
    "avg_pace_per_mi": "10:00",
    "avg_hr_bpm": 142
  },
  "notes": "Felt great, breathed through the nose the whole way",
  "logged_at": "2026-04-29T19:43:00Z"
}
```

The keys in `metrics` match the `key` field of each metric definition. Not
every metric needs to be filled in — let users skip fields. The UI can show
metrics in priority order (most informative first; freeform notes last).

## Suggested UI flow

1. Tab 1's evening cardio tile becomes a "What did you do?" picker.
2. Picker first asks for category (6 large tappable cards), then activity
   within that category.
3. Activity detail screen shows description + improvement tip + a form
   with one input per metric.
4. After save, append to a per-activity history. Show last 5 sessions and
   a small sparkline per metric.

## Cross-references with `minimalift_program.json`

- Some exercise names overlap (e.g., Plank, Hollow Body Hold, Box Squat, Pogos
  appear in both the lifting program and this library). They are independent
  records — different context, possibly different metrics. Don't try to merge.
- The morning lifting workout completes the day's strength goal; this library
  fills the evening or rest-day slot. Tab 1's two tiles map to (1) lifting
  program and (2) this library.

## Empty fields and what to do with them

- `youtube_url` is `null` for every activity in this file. The PDF source
  for the lifting program had embedded links; nothing here did. Render as
  "no video" or omit the link element entirely. You (or Claude Code) can
  populate URLs later if you want — a `// TODO` comment in the data file
  is fine.
