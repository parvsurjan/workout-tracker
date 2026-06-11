export type ExerciseType = {
  name: string;
  source: string;
  sets: string;
  weight: string;
};

export type PronationDrill = {
  name: string;
  sets: string;
  weight: string;
  tip: string;
};

export type CoreExercise = {
  name: string;
  source: string;
  sets: string;
  weight: string;
};

export type DayPlan = {
  title: string;
  type: 'strength' | 'hiit' | 'circuit' | 'rest';
  duration: string;
  exercises: ExerciseType[];
  forearmFinisher: ExerciseType[];
  pronationDrill: PronationDrill | null;
  coreFinisher: CoreExercise[];
  note: string;
};

export type WeekPlan = DayPlan[];

export const PHASE_FOR_WEEK = (weekIdx: number): 'Foundation' | 'Build' | 'Peak' => {
  if (weekIdx < 2) return 'Foundation';
  if (weekIdx < 4) return 'Build';
  return 'Peak';
};

// ===== Core finishers — identical every week, by day of week =====
// Monday — Upper abs focus
const CORE_MON: CoreExercise[] = [
  { name: 'Crunch', source: 'Bodyweight', sets: '3×20', weight: '—' },
  { name: 'Cable crunch', source: 'Centr 3', sets: '3×15', weight: '50–60 lbs' },
  { name: 'Sit-up', source: 'Bodyweight', sets: '3×15', weight: '—' },
];
// Tuesday — Lower abs focus
const CORE_TUE: CoreExercise[] = [
  { name: 'Hanging knee raise', source: 'Bodyweight', sets: '3×15', weight: '—' },
  { name: 'Reverse crunch', source: 'Bodyweight', sets: '3×15', weight: '—' },
  { name: 'Leg raise (lying flat)', source: 'Bodyweight', sets: '3×12', weight: '—' },
];
// Wednesday — Obliques focus
const CORE_WED: CoreExercise[] = [
  { name: 'Russian twist', source: 'Bodyweight', sets: '3×20 each side', weight: '—' },
  { name: 'Side plank', source: 'Bodyweight', sets: '3×30s each side', weight: '—' },
  { name: 'Bicycle crunch', source: 'Bodyweight', sets: '3×20', weight: '—' },
];
// Thursday — Lower abs focus (lighter — cardio day)
const CORE_THU: CoreExercise[] = [
  { name: 'Reverse crunch', source: 'Bodyweight', sets: '3×12', weight: '—' },
  { name: 'Flutter kicks', source: 'Bodyweight', sets: '3×20s', weight: '—' },
  { name: 'Lying leg raise', source: 'Bodyweight', sets: '3×10', weight: '—' },
];
// Friday — Upper abs + obliques
const CORE_FRI: CoreExercise[] = [
  { name: 'Cable crunch', source: 'Centr 3', sets: '3×15', weight: '50–60 lbs' },
  { name: 'Oblique crunch', source: 'Bodyweight', sets: '3×15 each side', weight: '—' },
  { name: 'Plank', source: 'Bodyweight', sets: '3×40s', weight: '—' },
];
// Saturday — Full core
const CORE_SAT: CoreExercise[] = [
  { name: 'Crunch', source: 'Bodyweight', sets: '3×20', weight: '—' },
  { name: 'Hanging knee raise', source: 'Bodyweight', sets: '3×15', weight: '—' },
  { name: 'Russian twist', source: 'Bodyweight', sets: '3×20 each side', weight: '—' },
  { name: 'Plank', source: 'Bodyweight', sets: '3×40s', weight: '—' },
];

export const WORKOUT_PLAN: WeekPlan[] = [
  // ===== WEEK 1 — Foundation =====
  [
    {
      title: 'Chest & Triceps',
      type: 'strength',
      duration: '30 min',
      note: 'Bench at 70% of your 215 max — this is intentional. Full ROM, 2-second pause at the bottom. You should have 2–3 reps left in the tank after each set.',
      exercises: [
        { name: 'Barbell bench press', source: 'Bench', sets: '3×10', weight: '150 lbs' },
        { name: 'Cable chest fly (low anchor)', source: 'Centr 3', sets: '3×12', weight: '20–25 lbs/side' },
        { name: 'Diamond push-up', source: 'Bodyweight', sets: '3×12', weight: '—' },
        { name: 'Cable tricep pushdown', source: 'Centr 3', sets: '3×12', weight: '35–45 lbs' },
        { name: 'Bench dips', source: 'Bench', sets: '3×15', weight: 'Bodyweight' },
      ],
      forearmFinisher: [
        { name: 'Wrist curl', source: '', sets: '3×15', weight: '30 lbs' },
        { name: 'Dead hang', source: '', sets: '3×20s', weight: 'Bodyweight' },
      ],
      pronationDrill: {
        name: 'Cable pronation drill',
        sets: '3×15 each arm',
        weight: '5–7 lbs',
        tip: 'Elbow at side, palm up → rotate to palm down against cable resistance. Slow and controlled.',
      },
      coreFinisher: CORE_MON,
    },
    {
      title: 'Back & Biceps',
      type: 'strength',
      duration: '30 min',
      note: "Start heavier than feels comfortable on rows — you're strong. Full dead hang on every pull-up rep, no half reps.",
      exercises: [
        { name: 'Pull-up', source: 'Bodyweight', sets: '4×8', weight: 'Bodyweight' },
        { name: 'Cable seated row', source: 'Centr 3', sets: '4×10', weight: '65–75 lbs' },
        { name: 'Cable lat pulldown', source: 'Centr 3', sets: '3×12', weight: '65–75 lbs' },
        { name: 'Cable hammer curl', source: 'Centr 3', sets: '3×12', weight: '25–30 lbs/side' },
        { name: 'Cable straight-arm pulldown', source: 'Centr 3', sets: '3×12', weight: '35–45 lbs' },
      ],
      forearmFinisher: [
        { name: 'Reverse wrist curl', source: '', sets: '3×15', weight: '20 lbs' },
        { name: 'Dead hang', source: '', sets: '3×20s', weight: 'Bodyweight' },
      ],
      pronationDrill: null,
      coreFinisher: CORE_TUE,
    },
    {
      title: 'Shoulders',
      type: 'strength',
      duration: '28 min',
      note: 'Lateral raises stop at shoulder height — going higher is a trap, it shifts load to traps and reduces delt activation. Pinky slightly higher than thumb.',
      exercises: [
        { name: 'Pike push-up', source: 'Bodyweight', sets: '4×12', weight: '—' },
        { name: 'Cable lateral raise', source: 'Centr 3', sets: '3×15', weight: '15–18 lbs/side' },
        { name: 'Cable face pull', source: 'Centr 3', sets: '4×15', weight: '40–50 lbs' },
        { name: 'Cable front raise', source: 'Centr 3', sets: '3×12', weight: '15–18 lbs/side' },
        { name: 'Cable rear delt fly', source: 'Centr 3', sets: '3×15', weight: '12–15 lbs/side' },
      ],
      forearmFinisher: [],
      pronationDrill: null,
      coreFinisher: CORE_WED,
    },
    {
      title: 'Conditioning',
      type: 'hiit',
      duration: '20 min',
      note: 'One cardio session per week keeps cardiovascular health up without eating into recovery. This is moderate effort — not all-out, not a walk.',
      exercises: [
        { name: 'Warm-up jog', source: 'Treadmill', sets: '2 min', weight: '3.5 mph' },
        { name: 'Steady-state run', source: 'Treadmill', sets: '15 min', weight: '6–7 mph (comfortable but working)' },
        { name: 'Cool-down walk', source: 'Treadmill', sets: '3 min', weight: '3 mph' },
      ],
      forearmFinisher: [],
      pronationDrill: null,
      coreFinisher: CORE_THU,
    },
    {
      title: 'Arms + Forearms',
      type: 'strength',
      duration: '30 min',
      note: 'Dedicated arm day — this is what builds the size people notice. Slow, controlled reps on everything. No swinging.',
      exercises: [
        { name: 'Barbell curl', source: 'Bench (barbell)', sets: '4×10', weight: '75–85 lbs' },
        { name: 'Cable tricep pushdown', source: 'Centr 3', sets: '4×10', weight: '35–45 lbs' },
        { name: 'Cable hammer curl', source: 'Centr 3', sets: '3×12', weight: '25–30 lbs/side' },
        { name: 'Overhead cable tricep ext.', source: 'Centr 3', sets: '3×12', weight: '40–50 lbs' },
        { name: 'Cable reverse curl', source: 'Centr 3', sets: '3×12', weight: '20–25 lbs/side' },
      ],
      forearmFinisher: [
        { name: 'Wrist curl', source: '', sets: '3×15', weight: '30 lbs' },
        { name: 'Reverse wrist curl', source: '', sets: '3×15', weight: '20 lbs' },
      ],
      pronationDrill: {
        name: 'Cable pronation drill',
        sets: '3×15 each arm',
        weight: '5–7 lbs',
        tip: 'Same as Monday. Focus on feeling the pronator teres — inner forearm near elbow.',
      },
      coreFinisher: CORE_FRI,
    },
    {
      title: 'Upper body circuit',
      type: 'circuit',
      duration: '30 min',
      note: 'Moderate bench weight to allow full circuit quality. Keep rest to 45s between sets.',
      exercises: [
        { name: 'Bench press', source: 'Bench', sets: '3×10', weight: '135 lbs' },
        { name: 'Pull-up + push-up superset', source: 'Bodyweight', sets: '4×6+15', weight: '—' },
        { name: 'Cable row + cable fly', source: 'Centr 3', sets: '3×10+10', weight: 'Row: 65 lbs · Fly: 22 lbs/side' },
        { name: 'Cable curl + pushdown superset', source: 'Centr 3', sets: '3×12+12', weight: 'Curl: 25 lbs · Push: 40 lbs' },
      ],
      forearmFinisher: [],
      pronationDrill: null,
      coreFinisher: CORE_SAT,
    },
  ],

  // ===== WEEK 2 — Foundation =====
  [
    {
      title: 'Chest & Triceps',
      type: 'strength',
      duration: '30 min',
      note: 'High anchor cable fly = upper chest. Upper chest is what creates that defined shelf — don\'t skip these for flat fly variations only.',
      exercises: [
        { name: 'Barbell bench press', source: 'Bench', sets: '4×8', weight: '160 lbs' },
        { name: 'Cable incline fly (high anchor)', source: 'Centr 3', sets: '3×12', weight: '22–27 lbs/side' },
        { name: 'Decline push-up', source: 'Bodyweight', sets: '3× failure', weight: '—' },
        { name: 'Cable tricep pushdown', source: 'Centr 3', sets: '4×10', weight: '40–50 lbs' },
        { name: 'Skull crushers', source: 'Bench', sets: '3×10', weight: '80–90 lbs EZ bar' },
      ],
      forearmFinisher: [
        { name: 'Wrist curl', source: '', sets: '3×15', weight: '35 lbs' },
        { name: 'Dead hang', source: '', sets: '3×25s', weight: 'Bodyweight' },
      ],
      pronationDrill: {
        name: 'Cable pronation drill',
        sets: '3×15 each arm',
        weight: '7–10 lbs',
        tip: 'Add slight wrist curl at the end of the rotation for full pronator recruitment.',
      },
      coreFinisher: CORE_MON,
    },
    {
      title: 'Back & Biceps',
      type: 'strength',
      duration: '30 min',
      note: 'Add weight to pull-ups if 8 reps feels like anything less than a 7/10 effort. Single-arm rows expose and fix left/right imbalances.',
      exercises: [
        { name: 'Pull-up', source: 'Bodyweight', sets: '4×8', weight: 'Bodyweight (add 10–15 lbs if easy)' },
        { name: 'Cable single-arm row', source: 'Centr 3', sets: '3×10 each', weight: '35–42 lbs/side' },
        { name: 'Cable lat pulldown', source: 'Centr 3', sets: '4×10', weight: '70–80 lbs' },
        { name: 'Barbell curl', source: 'Bench (barbell)', sets: '4×8', weight: '80–90 lbs' },
        { name: 'Inverted row', source: 'Bodyweight', sets: '3×12', weight: '—' },
      ],
      forearmFinisher: [
        { name: 'Reverse wrist curl', source: '', sets: '3×15', weight: '25 lbs' },
        { name: 'Farmer carry', source: '', sets: '3×30s', weight: '45 lbs/hand' },
      ],
      pronationDrill: null,
      coreFinisher: CORE_TUE,
    },
    {
      title: 'Shoulders',
      type: 'strength',
      duration: '29 min',
      note: 'Y-raises are a sleeper exercise — they hit all three deltoid heads simultaneously and most people never do them. Light weight, very controlled.',
      exercises: [
        { name: 'Handstand hold (wall)', source: 'Bodyweight', sets: '3×20s', weight: '—' },
        { name: 'Cable lateral raise', source: 'Centr 3', sets: '4×12', weight: '17–20 lbs/side' },
        { name: 'Cable face pull', source: 'Centr 3', sets: '4×15', weight: '45–55 lbs' },
        { name: 'Cable Y-raise', source: 'Centr 3', sets: '3×12', weight: '12 lbs/side' },
        { name: 'Cable rear delt fly', source: 'Centr 3', sets: '3×15', weight: '13–16 lbs/side' },
      ],
      forearmFinisher: [],
      pronationDrill: null,
      coreFinisher: CORE_WED,
    },
    {
      title: 'Conditioning',
      type: 'hiit',
      duration: '22 min',
      note: 'Slight step up from Week 1 — add some incline this week for extra posterior chain work.',
      exercises: [
        { name: 'Warm-up jog', source: 'Treadmill', sets: '2 min', weight: '3.5 mph' },
        { name: 'Incline jog', source: 'Treadmill', sets: '15 min', weight: '5–6% incline, 6–6.5 mph' },
        { name: 'Cool-down walk', source: 'Treadmill', sets: '5 min', weight: '3 mph' },
      ],
      forearmFinisher: [],
      pronationDrill: null,
      coreFinisher: CORE_THU,
    },
    {
      title: 'Arms + Forearms',
      type: 'strength',
      duration: '30 min',
      note: 'Slow eccentric (3 seconds down) on curls dramatically increases muscle damage and growth — this is where arm size really comes from.',
      exercises: [
        { name: 'Barbell curl (slow — 3s down)', source: 'Bench (barbell)', sets: '4×8', weight: '80–90 lbs' },
        { name: 'Cable tricep pushdown', source: 'Centr 3', sets: '4×10', weight: '42–52 lbs' },
        { name: 'Cable incline curl (high anchor)', source: 'Centr 3', sets: '3×12', weight: '20–25 lbs/side' },
        { name: 'Close-grip bench press', source: 'Bench', sets: '3×10', weight: '115–125 lbs' },
        { name: 'Cable reverse curl', source: 'Centr 3', sets: '3×12', weight: '22–27 lbs/side' },
      ],
      forearmFinisher: [
        { name: 'Wrist curl', source: '', sets: '3×15', weight: '35 lbs' },
        { name: 'Reverse wrist curl', source: '', sets: '3×15', weight: '25 lbs' },
      ],
      pronationDrill: {
        name: 'Cable pronation drill',
        sets: '3×15 each arm',
        weight: '7–10 lbs',
        tip: 'Pause 1 second at full pronation before returning. Builds peak tension in the pronator teres.',
      },
      coreFinisher: CORE_FRI,
    },
    {
      title: 'Upper body circuit',
      type: 'circuit',
      duration: '30 min',
      note: 'Bench then pull-ups back to back — pre-fatiguing the chest makes your back work harder on the pulls. Keep rest under 45s.',
      exercises: [
        { name: 'Bench press', source: 'Bench', sets: '4×8', weight: '150 lbs' },
        { name: 'Pull-up + push-up superset', source: 'Bodyweight', sets: '4×8+12', weight: '—' },
        { name: 'Cable row + fly superset', source: 'Centr 3', sets: '3×10+10', weight: 'Row: 68 lbs · Fly: 24 lbs/side' },
        { name: 'Barbell curl + skull crusher superset', source: 'Bench', sets: '3×10+10', weight: 'Curl: 80 lbs · Skull: 80 lbs' },
      ],
      forearmFinisher: [],
      pronationDrill: null,
      coreFinisher: CORE_SAT,
    },
  ],

  // ===== WEEK 3 — Build =====
  [
    {
      title: 'Chest & Triceps',
      type: 'strength',
      duration: '30 min',
      note: 'Low-to-high and high-to-low cable fly superset hits upper and lower chest in one shot. 170 lbs on bench is real weight — rest 90–120s between sets.',
      exercises: [
        { name: 'Barbell bench press', source: 'Bench', sets: '4×6', weight: '170 lbs' },
        { name: 'Cable fly superset low→high', source: 'Centr 3', sets: '3×10+10', weight: '24–28 lbs/side' },
        { name: 'Incline + decline push-up', source: 'Bodyweight', sets: '3×8+8', weight: '—' },
        { name: 'Skull crushers', source: 'Bench', sets: '3×10', weight: '90–100 lbs EZ bar' },
        { name: 'Cable tricep pushdown', source: 'Centr 3', sets: '3×10', weight: '45–55 lbs' },
      ],
      forearmFinisher: [
        { name: 'Wrist curl', source: '', sets: '4×12', weight: '37–42 lbs' },
        { name: 'Dead hang', source: '', sets: '3×30s', weight: 'Bodyweight' },
      ],
      pronationDrill: {
        name: 'Cable pronation drill',
        sets: '4×12 each arm',
        weight: '10–12 lbs',
        tip: 'Now doing 4 sets. Squeeze hard at the bottom of the rotation on every rep.',
      },
      coreFinisher: CORE_MON,
    },
    {
      title: 'Back & Biceps',
      type: 'strength',
      duration: '30 min',
      note: 'Underhand rows recruit biceps and lower lats simultaneously — one of the most efficient back movements. Weighted pull-ups now.',
      exercises: [
        { name: 'Weighted pull-up', source: 'Bodyweight', sets: '4×6', weight: 'BW + 15 lbs' },
        { name: 'Cable bent-over row', source: 'Centr 3', sets: '4×8', weight: '70–80 lbs' },
        { name: 'Underhand cable row', source: 'Centr 3', sets: '3×10', weight: '65–75 lbs' },
        { name: 'Barbell curl', source: 'Bench (barbell)', sets: '4×8', weight: '90–100 lbs' },
        { name: 'Cable straight-arm pulldown', source: 'Centr 3', sets: '3×12', weight: '40–50 lbs' },
      ],
      forearmFinisher: [
        { name: 'Reverse wrist curl', source: '', sets: '4×12', weight: '27–32 lbs' },
        { name: 'Farmer carry', source: '', sets: '3×40s', weight: '48 lbs/hand' },
      ],
      pronationDrill: null,
      coreFinisher: CORE_TUE,
    },
    {
      title: 'Shoulders',
      type: 'strength',
      duration: '29 min',
      note: 'Push press allows you to overload the shoulders beyond what a strict press allows. The slight leg drive is intentional — it\'s a power movement.',
      exercises: [
        { name: 'Push press (barbell)', source: 'Bench', sets: '4×8', weight: '95–105 lbs' },
        { name: 'Cable lateral raise', source: 'Centr 3', sets: '4×10', weight: '18–22 lbs/side' },
        { name: 'Cable face pull', source: 'Centr 3', sets: '4×15', weight: '48–58 lbs' },
        { name: 'Cable rear delt fly', source: 'Centr 3', sets: '4×15', weight: '14–17 lbs/side' },
        { name: 'Pike push-up to failure', source: 'Bodyweight', sets: '2 sets', weight: '—' },
      ],
      forearmFinisher: [],
      pronationDrill: null,
      coreFinisher: CORE_WED,
    },
    {
      title: 'Conditioning',
      type: 'hiit',
      duration: '20 min',
      note: 'Introduce intervals this week — alternating effort and recovery. Still not all-out, but working hard.',
      exercises: [
        { name: 'Warm-up jog', source: 'Treadmill / outdoor', sets: '2 min', weight: 'easy' },
        { name: 'Moderate intervals', source: 'Treadmill / outdoor', sets: '8×90s hard / 60s easy', weight: '7–8 mph hard, 5 mph easy' },
        { name: 'Cool-down walk', source: '—', sets: '2 min', weight: '—' },
      ],
      forearmFinisher: [],
      pronationDrill: null,
      coreFinisher: CORE_THU,
    },
    {
      title: 'Arms + Forearms',
      type: 'strength',
      duration: '30 min',
      note: 'Close-grip bench is one of the most underrated tricep builders — heavier load than any cable exercise. Squeeze triceps hard at lockout.',
      exercises: [
        { name: 'Barbell curl', source: 'Bench (barbell)', sets: '4×8', weight: '90–100 lbs' },
        { name: 'Close-grip bench press', source: 'Bench', sets: '4×8', weight: '125–135 lbs' },
        { name: 'Cable hammer curl', source: 'Centr 3', sets: '3×12', weight: '28–33 lbs/side' },
        { name: 'Overhead cable tricep ext.', source: 'Centr 3', sets: '3×10', weight: '45–55 lbs' },
        { name: 'Cable reverse curl', source: 'Centr 3', sets: '3×12', weight: '24–28 lbs/side' },
      ],
      forearmFinisher: [
        { name: 'Wrist curl + reverse superset', source: '', sets: '3×12+12', weight: '37 / 27 lbs' },
        { name: 'Dead hang', source: '', sets: '2×30s', weight: '—' },
      ],
      pronationDrill: {
        name: 'Cable pronation drill + wrist cup hold',
        sets: '3×12 + 20s hold',
        weight: '10 lbs drill / 15 lbs hold',
        tip: 'After each set, hold wrist in cupped/flexed position for 20s — mimics arm wrestling wrist lock.',
      },
      coreFinisher: CORE_FRI,
    },
    {
      title: 'Upper body power circuit',
      type: 'circuit',
      duration: '30 min',
      note: 'Heavier bench in the circuit this week. 90s rest between rounds — you need it at this weight. Focus on quality not speed.',
      exercises: [
        { name: 'Bench press', source: 'Bench', sets: '4×6', weight: '160 lbs' },
        { name: 'Weighted pull-up', source: 'Bodyweight', sets: '3×6', weight: 'BW + 10 lbs' },
        { name: 'Cable row + cable fly', source: 'Centr 3', sets: '3×10+10', weight: 'Row: 72 lbs · Fly: 25 lbs/side' },
        { name: 'Barbell curl + skull crusher', source: 'Bench', sets: '3×8+8', weight: 'Curl: 88 lbs · Skull: 90 lbs' },
        { name: 'Dips', source: 'Bodyweight / bars', sets: '3×12', weight: 'Bodyweight' },
      ],
      forearmFinisher: [],
      pronationDrill: null,
      coreFinisher: CORE_SAT,
    },
  ],

  // ===== WEEK 4 — Build =====
  [
    {
      title: 'Chest & Triceps',
      type: 'strength',
      duration: '30 min',
      note: '180 lbs = 83% of your max. Rest 2 full minutes between bench sets. At this weight, cutting rest short kills the next set.',
      exercises: [
        { name: 'Barbell bench press', source: 'Bench', sets: '5×5', weight: '180 lbs' },
        { name: 'Cable chest fly (heavy)', source: 'Centr 3', sets: '4×8', weight: '27–30 lbs/side' },
        { name: 'Wide + narrow push-up', source: 'Bodyweight', sets: '3×10+10', weight: '—' },
        { name: 'Skull crushers', source: 'Bench', sets: '4×8', weight: '95–105 lbs EZ bar' },
        { name: 'Cable tricep pushdown', source: 'Centr 3', sets: '4×8', weight: '50–60 lbs' },
      ],
      forearmFinisher: [
        { name: 'Wrist curl (heavy)', source: '', sets: '4×10', weight: '40 lbs' },
        { name: 'Dead hang', source: '', sets: '3×35s', weight: 'Bodyweight' },
      ],
      pronationDrill: {
        name: 'Cable pronation drill (heavy)',
        sets: '4×10 each arm',
        weight: '12–15 lbs',
        tip: 'Heavier now. If you feel it in your bicep instead of inner forearm, reduce weight and slow down.',
      },
      coreFinisher: CORE_MON,
    },
    {
      title: 'Back & Biceps',
      type: 'strength',
      duration: '30 min',
      note: '5×5 weighted pull-ups are one of the most effective size-builders in this entire program. They\'re also the best predictor of whether you\'ll get a muscle-up.',
      exercises: [
        { name: 'Weighted pull-up', source: 'Bodyweight', sets: '5×5', weight: 'BW + 20 lbs' },
        { name: 'Cable row (heavy)', source: 'Centr 3', sets: '4×6', weight: '75–85 lbs' },
        { name: 'Cable lat pulldown', source: 'Centr 3', sets: '4×8', weight: '78–88 lbs' },
        { name: 'Barbell curl', source: 'Bench (barbell)', sets: '4×8', weight: '95–105 lbs' },
        { name: 'Cable reverse curl', source: 'Centr 3', sets: '3×10', weight: '25–30 lbs/side' },
      ],
      forearmFinisher: [
        { name: 'Reverse wrist curl (heavy)', source: '', sets: '4×10', weight: '30 lbs' },
        { name: 'Farmer carry', source: '', sets: '3×45s', weight: '52 lbs/hand' },
      ],
      pronationDrill: null,
      coreFinisher: CORE_TUE,
    },
    {
      title: 'Shoulders (heavy)',
      type: 'strength',
      duration: '30 min',
      note: '5 sets of lateral raises this week. No other exercise creates that capped, wide shoulder look more directly. Slow and controlled — no swinging.',
      exercises: [
        { name: 'Push press', source: 'Bench', sets: '4×6', weight: '110–120 lbs' },
        { name: 'Cable lateral raise', source: 'Centr 3', sets: '5×10', weight: '20–24 lbs/side' },
        { name: 'Cable face pull', source: 'Centr 3', sets: '4×15', weight: '52–62 lbs' },
        { name: 'Cable rear delt fly', source: 'Centr 3', sets: '4×15', weight: '15–18 lbs/side' },
        { name: 'Handstand hold (wall)', source: 'Bodyweight', sets: '3×25s', weight: '—' },
      ],
      forearmFinisher: [],
      pronationDrill: null,
      coreFinisher: CORE_WED,
    },
    {
      title: 'Conditioning',
      type: 'hiit',
      duration: '22 min',
      note: 'Keeping one cardio session. Slightly more intense this week.',
      exercises: [
        { name: 'Warm-up', source: 'Treadmill / outdoor', sets: '2 min', weight: 'easy' },
        { name: 'Hard intervals', source: 'Treadmill / outdoor', sets: '10×60s hard / 60s easy', weight: '8–9 mph hard, 5 mph easy' },
        { name: 'Cool-down', source: '—', sets: '2 min', weight: '—' },
      ],
      forearmFinisher: [],
      pronationDrill: null,
      coreFinisher: CORE_THU,
    },
    {
      title: 'Arms + Forearms (heavy)',
      type: 'strength',
      duration: '30 min',
      note: 'Close-grip bench at this weight is a serious tricep builder. Control the descent — don\'t let the bar bounce off your chest.',
      exercises: [
        { name: 'Barbell curl (heavy)', source: 'Bench (barbell)', sets: '4×6', weight: '100–110 lbs' },
        { name: 'Close-grip bench press', source: 'Bench', sets: '4×6', weight: '135–145 lbs' },
        { name: 'Cable incline curl', source: 'Centr 3', sets: '3×10', weight: '25–30 lbs/side' },
        { name: 'Overhead cable tricep ext.', source: 'Centr 3', sets: '4×8', weight: '50–60 lbs' },
        { name: 'Cable reverse curl', source: 'Centr 3', sets: '3×10', weight: '26–30 lbs/side' },
      ],
      forearmFinisher: [
        { name: 'Wrist curl + reverse superset', source: '', sets: '4×10+10', weight: '40 / 30 lbs' },
        { name: 'Dead hang', source: '', sets: '2×35s', weight: '—' },
      ],
      pronationDrill: {
        name: 'Cable pronation drill + wrist cup hold',
        sets: '4×10 + 20s hold',
        weight: '12 lbs drill / 17 lbs hold',
        tip: 'The wrist cup hold is training your wrist lock — the most important defensive position in arm wrestling.',
      },
      coreFinisher: CORE_FRI,
    },
    {
      title: 'Upper body power circuit',
      type: 'circuit',
      duration: '30 min',
      note: 'Weighted dips added this week — one of the best compound tricep and lower chest builders. Keep the weight challenging but controlled.',
      exercises: [
        { name: 'Bench press', source: 'Bench', sets: '4×6', weight: '165 lbs' },
        { name: 'Weighted pull-up', source: 'Bodyweight', sets: '4×5', weight: 'BW + 15 lbs' },
        { name: 'Weighted dip', source: 'Bars / bench', sets: '3×8', weight: 'BW + 15 lbs' },
        { name: 'Cable row + cable curl superset', source: 'Centr 3', sets: '3×8+10', weight: 'Row: 78 lbs · Curl: 28 lbs/side' },
        { name: 'Barbell curl + pushdown superset', source: 'Bench/Centr 3', sets: '3×8+8', weight: 'Curl: 95 lbs · Push: 52 lbs' },
      ],
      forearmFinisher: [],
      pronationDrill: null,
      coreFinisher: CORE_SAT,
    },
  ],

  // ===== WEEK 5 — Peak =====
  [
    {
      title: 'Chest & Triceps (peak)',
      type: 'strength',
      duration: '30 min',
      note: '195 lbs = 91% of your max. These are heavy singles territory. Full warm-up sets before working sets. Controlled descent, explosive press — record every set.',
      exercises: [
        { name: 'Barbell bench press (near max)', source: 'Bench', sets: '4×4', weight: '195 lbs' },
        { name: 'Cable fly (slow eccentric, 3s down)', source: 'Centr 3', sets: '4×8', weight: '28–32 lbs/side' },
        { name: 'Weighted dip', source: 'Bars / bench', sets: '3×6', weight: 'BW + 20–25 lbs' },
        { name: 'Skull crushers', source: 'Bench', sets: '3×8', weight: '100–110 lbs EZ bar' },
        { name: 'Cable tricep pushdown', source: 'Centr 3', sets: '4×6', weight: '55–65 lbs' },
      ],
      forearmFinisher: [
        { name: 'Wrist curl (peak)', source: '', sets: '4×8', weight: '45 lbs' },
        { name: 'Weighted dead hang', source: '', sets: '3×30s', weight: 'BW + 10 lbs' },
      ],
      pronationDrill: {
        name: 'Cable pronation drill (peak)',
        sets: '4×8 each arm',
        weight: '15–17 lbs',
        tip: 'Control the negative (return to palm-up) for 2 seconds on every rep.',
      },
      coreFinisher: CORE_MON,
    },
    {
      title: 'Back & Biceps (peak)',
      type: 'strength',
      duration: '30 min',
      note: 'Record every weight this week — this is your benchmark. These numbers tell you how much stronger you got over 5 weeks.',
      exercises: [
        { name: 'Weighted pull-up', source: 'Bodyweight', sets: '4×4–5', weight: 'BW + 25 lbs' },
        { name: 'Cable row (heaviest)', source: 'Centr 3', sets: '4×5', weight: '82–92 lbs' },
        { name: 'Cable lat pulldown', source: 'Centr 3', sets: '4×6', weight: '85–95 lbs' },
        { name: 'Barbell curl (peak)', source: 'Bench (barbell)', sets: '4×5', weight: '105–115 lbs' },
        { name: 'Cable reverse curl', source: 'Centr 3', sets: '3×8', weight: '28–32 lbs/side' },
      ],
      forearmFinisher: [
        { name: 'Reverse wrist curl (peak)', source: '', sets: '4×8', weight: '35 lbs' },
        { name: 'Farmer carry', source: '', sets: '3×50s', weight: '57 lbs/hand' },
      ],
      pronationDrill: null,
      coreFinisher: CORE_TUE,
    },
    {
      title: 'Shoulders (peak)',
      type: 'strength',
      duration: '30 min',
      note: 'Rear delts are the muscle most people neglect and the one that shows most in photos and in arm wrestling. Maximum rear delt volume today.',
      exercises: [
        { name: 'Push press (peak)', source: 'Bench', sets: '4×5', weight: '120–130 lbs' },
        { name: 'Cable lateral raise', source: 'Centr 3', sets: '5×8', weight: '22–26 lbs/side' },
        { name: 'Cable face pull', source: 'Centr 3', sets: '5×12', weight: '58–68 lbs' },
        { name: 'Cable rear delt fly', source: 'Centr 3', sets: '5×12', weight: '16–20 lbs/side' },
        { name: 'Handstand hold (wall)', source: 'Bodyweight', sets: '3×30s', weight: '—' },
      ],
      forearmFinisher: [],
      pronationDrill: null,
      coreFinisher: CORE_WED,
    },
    {
      title: 'Conditioning',
      type: 'hiit',
      duration: '20 min',
      note: 'Peak week conditioning — push harder than previous weeks. This is your last hard cardio session before the final week.',
      exercises: [
        { name: 'Warm-up jog', source: 'Treadmill / outdoor', sets: '2 min', weight: 'easy' },
        { name: 'Hard intervals', source: 'Treadmill / outdoor', sets: '10×45s hard / 30s easy', weight: '9–10 mph hard' },
        { name: 'Cool-down', source: '—', sets: '2 min', weight: '—' },
      ],
      forearmFinisher: [],
      pronationDrill: null,
      coreFinisher: CORE_THU,
    },
    {
      title: 'Arms + Forearms (peak)',
      type: 'strength',
      duration: '30 min',
      note: 'Drop sets on the final set of each exercise — strip 25–30% of the weight at failure and keep going. This is how you finish a peak week.',
      exercises: [
        { name: 'Barbell curl (peak)', source: 'Bench (barbell)', sets: '4×5', weight: '110–120 lbs' },
        { name: 'Close-grip bench press (peak)', source: 'Bench', sets: '4×5', weight: '145–155 lbs' },
        { name: 'Cable hammer curl', source: 'Centr 3', sets: '3×8', weight: '32–37 lbs/side' },
        { name: 'Overhead cable tricep ext.', source: 'Centr 3', sets: '4×6', weight: '55–65 lbs' },
        { name: 'Cable reverse curl', source: 'Centr 3', sets: '3×8', weight: '28–32 lbs/side' },
      ],
      forearmFinisher: [
        { name: 'Wrist curl + reverse superset', source: '', sets: '4×8+8', weight: '45 / 35 lbs' },
        { name: 'Weighted dead hang', source: '', sets: '2×30s', weight: 'BW + 10 lbs' },
      ],
      pronationDrill: {
        name: 'Cable pronation drill + hook simulation',
        sets: '3×8 + 3×10s pull',
        weight: '15 lbs',
        tip: 'After each set, simulate the arm wrestling hook: cable at table height, curl inward toward you for 10s isometric. Builds the exact movement pattern.',
      },
      coreFinisher: CORE_FRI,
    },
    {
      title: 'Upper body power circuit',
      type: 'circuit',
      duration: '30 min',
      note: 'Heaviest circuit of the program. Full compound movements at near-peak weights. Rest 90s between rounds.',
      exercises: [
        { name: 'Bench press', source: 'Bench', sets: '3×6', weight: '175 lbs' },
        { name: 'Weighted pull-up', source: 'Bodyweight', sets: '3×5', weight: 'BW + 20 lbs' },
        { name: 'Weighted dip', source: 'Bars / bench', sets: '3×6', weight: 'BW + 20 lbs' },
        { name: 'Barbell curl + skull crusher superset', source: 'Bench', sets: '3×6+6', weight: 'Curl: 105 lbs · Skull: 100 lbs' },
        { name: 'Cable row', source: 'Centr 3', sets: '3×8', weight: '82 lbs' },
      ],
      forearmFinisher: [],
      pronationDrill: null,
      coreFinisher: CORE_SAT,
    },
  ],

  // ===== WEEK 6 — Peak =====
  [
    {
      title: 'Chest & Triceps (final)',
      type: 'strength',
      duration: '30 min',
      note: 'Open with a max attempt. 6 weeks of progressive loading has you primed to hit 215 lbs or more. Proper warm-up: 45%, 60%, 75%, 85%, then attempt. Controlled descent, aggressive drive off the chest.',
      exercises: [
        { name: 'Bench press max attempt', source: 'Bench', sets: 'Work up to 1RM', weight: '215+ lbs — beat your PR' },
        { name: 'Cable fly (slow, heavy)', source: 'Centr 3', sets: '4×8', weight: 'Peak weight from wk 5' },
        { name: 'Weighted dip', source: 'Bars / bench', sets: '3×6', weight: 'BW + 25 lbs' },
        { name: 'Tricep pushdown drop set', source: 'Centr 3', sets: '3× drop to failure', weight: '60→40→25 lbs' },
        { name: 'Skull crusher drop set', source: 'Bench', sets: '2× drop to failure', weight: '100→70 lbs' },
      ],
      forearmFinisher: [
        { name: 'Wrist curl (max)', source: '', sets: '4×6', weight: '50 lbs' },
        { name: 'Weighted dead hang', source: '', sets: '3×35s', weight: 'BW + 15 lbs' },
      ],
      pronationDrill: {
        name: 'Cable pronation drill (max)',
        sets: '4×6 each arm',
        weight: '17–20 lbs',
        tip: 'Max load week. This weight should feel genuinely hard by rep 5.',
      },
      coreFinisher: CORE_MON,
    },
    {
      title: 'Back & Biceps (final)',
      type: 'strength',
      duration: '30 min',
      note: 'Max pull-up attempt today. Track how much weight you\'ve added over 6 weeks — that number is your real progress marker.',
      exercises: [
        { name: 'Weighted pull-up max attempt', source: 'Bodyweight', sets: 'Work up to max', weight: 'BW + 30 lbs target' },
        { name: 'Cable row (heaviest ever)', source: 'Centr 3', sets: '5×4', weight: 'Peak + 5 lbs' },
        { name: 'Cable lat pulldown', source: 'Centr 3', sets: '4×5', weight: 'Peak + 5 lbs' },
        { name: 'Barbell curl max', source: 'Bench (barbell)', sets: '4×5', weight: '115–125 lbs' },
        { name: 'Cable reverse curl', source: 'Centr 3', sets: '3×8', weight: '30 lbs/side' },
      ],
      forearmFinisher: [
        { name: 'Reverse wrist curl (max)', source: '', sets: '4×6', weight: '40 lbs' },
        { name: 'Farmer carry', source: '', sets: '3×60s', weight: '62 lbs/hand' },
      ],
      pronationDrill: null,
      coreFinisher: CORE_TUE,
    },
    {
      title: 'Shoulders (final)',
      type: 'strength',
      duration: '30 min',
      note: 'Drop sets on every final set — strip 30% at failure and keep going until you can\'t. This is how you finish 6 weeks of shoulder work.',
      exercises: [
        { name: 'Push press (peak)', source: 'Bench', sets: '4×5', weight: 'Peak weight' },
        { name: 'Cable lateral raise', source: 'Centr 3', sets: '5×8', weight: 'Peak weight' },
        { name: 'Cable face pull', source: 'Centr 3', sets: '5×12', weight: 'Peak weight' },
        { name: 'Cable rear delt fly', source: 'Centr 3', sets: '4×12', weight: 'Peak weight' },
        { name: 'Drop set burnout: lateral → face pull → rear delt', source: 'Centr 3', sets: '1 drop set per exercise', weight: 'Drop 30% at failure, keep going' },
      ],
      forearmFinisher: [],
      pronationDrill: null,
      coreFinisher: CORE_WED,
    },
    {
      title: 'Final conditioning',
      type: 'hiit',
      duration: '20 min',
      note: 'Last cardio session. Push harder than any previous Thursday. Leave nothing.',
      exercises: [
        { name: 'All-out intervals', source: 'Treadmill / outdoor', sets: '12×30s on / 30s off', weight: 'Max speed' },
      ],
      forearmFinisher: [],
      pronationDrill: null,
      coreFinisher: CORE_THU,
    },
    {
      title: 'Arms + Forearms (final)',
      type: 'strength',
      duration: '30 min',
      note: 'Max arm day. Drop sets on everything. Measure your arms after this session — the pump will show you exactly how much they\'ve grown.',
      exercises: [
        { name: 'Barbell curl max', source: 'Bench (barbell)', sets: '4×4', weight: '120–130 lbs' },
        { name: 'Close-grip bench press max', source: 'Bench', sets: '4×4', weight: '155–165 lbs' },
        { name: 'Cable curl drop set', source: 'Centr 3', sets: '3× drop to failure', weight: '35→22→12 lbs/side' },
        { name: 'Tricep pushdown drop set', source: 'Centr 3', sets: '3× drop to failure', weight: '60→40→25 lbs' },
        { name: 'Cable reverse curl', source: 'Centr 3', sets: '3×8', weight: '30 lbs/side' },
      ],
      forearmFinisher: [
        { name: 'Wrist curl drop set', source: '', sets: '2× to failure each', weight: '50→35→20 lbs' },
        { name: 'Reverse wrist curl drop set', source: '', sets: '2× to failure each', weight: '40→25→15 lbs' },
      ],
      pronationDrill: {
        name: 'Cable pronation drill + hook simulation',
        sets: '3×6 + 3×10s pull',
        weight: '17–20 lbs',
        tip: 'Final week. The hook simulation at this weight closely replicates actual arm wrestling resistance.',
      },
      coreFinisher: CORE_FRI,
    },
    {
      title: 'Final benchmark',
      type: 'circuit',
      duration: '30 min',
      note: 'This is a benchmark session, not just a workout. Record every number and compare directly to Week 1. That delta is what 6 weeks of consistent work looks like.',
      exercises: [
        { name: 'Max push-up test', source: 'Bodyweight', sets: '1 set to failure', weight: 'Compare to Week 1' },
        { name: 'Bench press', source: 'Bench', sets: '3×5', weight: '185 lbs' },
        { name: 'Weighted pull-up max set', source: 'Bodyweight', sets: '1 set to failure', weight: 'Heaviest weight possible' },
        { name: 'Weighted dip max set', source: 'Bars / bench', sets: '1 set to failure', weight: 'Heaviest weight possible' },
        { name: 'Barbell curl', source: 'Bench (barbell)', sets: '3×5', weight: '115 lbs' },
      ],
      forearmFinisher: [],
      pronationDrill: null,
      coreFinisher: CORE_SAT,
    },
  ],
];

export const DAYS_PER_WEEK = WORKOUT_PLAN[0].length;
export const TOTAL_DAYS = WORKOUT_PLAN.reduce((sum, week) => sum + week.length, 0);
