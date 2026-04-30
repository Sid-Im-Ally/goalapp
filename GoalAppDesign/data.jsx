// GOAL — sample program data
// All numbers are realistic placeholders; user will swap in their actual program

const PROGRAM = {
  name: "HYPERTROPHY BLOCK 2",
  startedISO: "2026-03-13",
  totalDays: 84,
  currentDay: 47,
  phase: 2,
  totalPhases: 3,
  week: 4,
  totalWeeks: 6,
  day: 5,
  totalDays_inWeek: 6,
};

// STRONGER — today's lift
const STRONGER_TODAY = {
  phase: 2,
  week: 4,
  day: 5,
  title: "LOWER — POSTERIOR EMPHASIS",
  duration: "62 min",
  exercises: [
    {
      name: "Trap Bar Deadlift",
      sets: 4,
      reps: "5",
      load: "315 lb",
      rest: 180,
      notes: "Brace hard. Reset every rep. RPE 8.",
      subs: ["Barbell RDL", "Hex Deadlift, low handles"],
      done: [true, true, false, false],
    },
    {
      name: "Bulgarian Split Squat",
      sets: 3,
      reps: "8 / leg",
      load: "DB 50 lb",
      rest: 120,
      notes: "Long stride. Vertical torso.",
      subs: ["Reverse Lunge", "Step-Up, 18\""],
      done: [false, false, false],
    },
    {
      name: "Seated Hamstring Curl",
      sets: 4,
      reps: "10",
      load: "120 lb",
      rest: 90,
      notes: "3-sec eccentric. Pause at full flexion.",
      subs: ["Lying Hamstring Curl", "Nordic Curl"],
      done: [false, false, false, false],
    },
    {
      name: "Hip Thrust",
      sets: 3,
      reps: "12",
      load: "225 lb",
      rest: 90,
      notes: "Pause 1s at lockout. Ribs down.",
      subs: ["Glute Bridge", "Single-Leg Hip Thrust"],
      done: [false, false, false],
    },
    {
      name: "Standing Calf Raise",
      sets: 4,
      reps: "12",
      load: "180 lb",
      rest: 60,
      notes: "Full stretch. 1s hold at top.",
      subs: ["Seated Calf Raise", "Single-Leg Calf"],
      done: [false, false, false, false],
    },
  ],
};

// FASTER — per-activity tracking
const FASTER_ACTIVITIES = [
  {
    id: "squash",
    name: "SQUASH",
    primary: "Match Win Rate",
    primaryValue: "68%",
    primaryDelta: "+12%",
    deltaPositive: true,
    period: "last 30d",
    metrics: [
      { label: "Matches played", value: "11" },
      { label: "Avg rally length", value: "14 shots" },
      { label: "Drop-shot success", value: "47%" },
    ],
    trend: [42, 50, 55, 48, 60, 58, 65, 62, 68, 70, 66, 68],
    lastSession: "Tue · 70 min · drills + 3 games",
  },
  {
    id: "running",
    name: "RUNNING",
    primary: "5K Pace",
    primaryValue: "6:42",
    primaryDelta: "-0:18",
    deltaPositive: true,
    period: "vs last month",
    metrics: [
      { label: "Weekly mileage", value: "22.4 mi" },
      { label: "Avg HR (Z2)", value: "142 bpm" },
      { label: "Longest run", value: "8.1 mi" },
    ],
    trend: [7.4, 7.3, 7.2, 7.1, 7.0, 6.95, 6.9, 6.85, 6.8, 6.75, 6.7, 6.7],
    lastSession: "Sat · 8.1 mi · 7:02 avg",
  },
  {
    id: "core",
    name: "CORE",
    primary: "Hollow Hold",
    primaryValue: "1:24",
    primaryDelta: "+0:19",
    deltaPositive: true,
    period: "last 6 weeks",
    metrics: [
      { label: "Plank (RPE 8)", value: "2:40" },
      { label: "L-sit", value: "0:22" },
      { label: "Sessions / wk", value: "3" },
    ],
    trend: [55, 58, 62, 65, 68, 72, 76, 78, 80, 82, 84, 84],
    lastSession: "Mon · 18 min circuit",
  },
  {
    id: "plyo",
    name: "PLYOMETRICS",
    primary: "Box Jump",
    primaryValue: "38\"",
    primaryDelta: "+3\"",
    deltaPositive: true,
    period: "last 8 weeks",
    metrics: [
      { label: "Broad jump", value: "8'7\"" },
      { label: "Reactive Strength", value: "1.94" },
      { label: "Depth jump", value: "32\"" },
    ],
    trend: [33, 33, 34, 34, 35, 36, 36, 37, 37, 38, 38, 38],
    lastSession: "Wed · 24 contacts",
  },
];

// READY — today's recovery
const READY_TODAY = {
  phase: 1,
  week: 4,
  day: 5,
  title: "POSTERIOR CHAIN MOBILITY",
  duration: "28 min",
  exercises: [
    {
      name: "Couch Stretch",
      sets: 2,
      reps: "60s / leg",
      load: "BW",
      rest: 30,
      notes: "Square hips. Squeeze glute of back leg.",
      subs: ["Half-Kneeling Hip Flexor", "Pigeon Pose"],
      done: [true, false],
    },
    {
      name: "90/90 Hip Switch",
      sets: 3,
      reps: "8 ea",
      load: "BW",
      rest: 30,
      notes: "Tall posture. Slow controlled rotation.",
      subs: ["Frog Stretch", "Seated Internal Rotation"],
      done: [false, false, false],
    },
    {
      name: "T-Spine Smash",
      sets: 2,
      reps: "10 ext",
      load: "Foam roller",
      rest: 30,
      notes: "Arms overhead. Exhale into extension.",
      subs: ["Cat-Cow", "Wall Slides"],
      done: [false, false],
    },
    {
      name: "Banded Ankle Mob",
      sets: 2,
      reps: "12 ea",
      load: "Light band",
      rest: 30,
      notes: "Knee tracks over toe. Keep heel down.",
      subs: ["Wall Ankle Mob", "Calf Stretch"],
      done: [false, false],
    },
    {
      name: "Box Breathing",
      sets: 1,
      reps: "5 min",
      load: "—",
      rest: 0,
      notes: "4-4-4-4. Nasal only.",
      subs: ["4-7-8 Breathing"],
      done: [false],
    },
  ],
};

// WHY — motivation tiles
const WHY_TILES = [
  {
    id: 1,
    label: "PRE-COMP · 12 WEEKS OUT",
    placeholder: "You at the start. The reason this exists.",
    tone: "warm",
  },
  {
    id: 2,
    label: "FATHER & SON · SEPT 2025",
    placeholder: "The people you train for.",
    tone: "cool",
  },
  {
    id: 3,
    label: "FIRST PODIUM · CITY OPEN",
    placeholder: "The proof you've done it before.",
    tone: "neutral",
  },
];

window.GOAL_DATA = { PROGRAM, STRONGER_TODAY, FASTER_ACTIVITIES, READY_TODAY, WHY_TILES };
