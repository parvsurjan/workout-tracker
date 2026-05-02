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

export type DayPlan = {
  title: string;
  type: 'strength' | 'hiit' | 'circuit' | 'rest';
  duration: string;
  exercises: ExerciseType[];
  forearmFinisher: ExerciseType[];
  pronationDrill: PronationDrill | null;
  note: string;
};

export type WeekPlan = DayPlan[];

export const PHASE_FOR_WEEK = (weekIdx: number): 'Foundation' | 'Build' | 'Peak' => {
  if (weekIdx < 2) return 'Foundation';
  if (weekIdx < 4) return 'Build';
  return 'Peak';
};

export const WORKOUT_PLAN: WeekPlan[] = [
  // ===== WEEK 1 — Foundation =====
  [
    {
      title: 'Chest & Triceps',
      type: 'strength',
      duration: '28 min',
      note: 'Bench at ~73% of your max. Full ROM, 2-second pause at the bottom.',
      exercises: [
        { name: 'Barbell bench press', source: 'Bench', sets: '3×10', weight: '135 lbs' },
        { name: 'Cable chest fly (low anchor)', source: 'Centr 3', sets: '3×12', weight: '15–20 lbs/side' },
        { name: 'Diamond push-up', source: 'Bodyweight', sets: '3×12', weight: '—' },
        { name: 'Cable tricep pushdown', source: 'Centr 3', sets: '3×12', weight: '25–35 lbs' },
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
    },
    {
      title: 'Sprint HIIT',
      type: 'hiit',
      duration: '20 min',
      note: '1% incline throughout. Hit 85–90% max heart rate on every sprint.',
      exercises: [
        { name: 'Warm-up jog', source: 'Treadmill', sets: '2 min', weight: '3.5 mph' },
        { name: 'All-out sprint', source: 'Treadmill', sets: '8×30s', weight: '9–10 mph' },
        { name: 'Recovery walk', source: 'Treadmill', sets: '8×60s', weight: '3.5 mph' },
        { name: 'Cool-down', source: 'Treadmill', sets: '2 min', weight: '3 mph' },
      ],
      forearmFinisher: [],
      pronationDrill: null,
    },
    {
      title: 'Back & Biceps',
      type: 'strength',
      duration: '27 min',
      note: 'Full dead hang on pull-ups. Add a 10 lb plate if you can hit 8 reps easily.',
      exercises: [
        { name: 'Pull-up', source: 'Bodyweight', sets: '4×6–8', weight: 'Bodyweight' },
        { name: 'Cable seated row', source: 'Centr 3', sets: '3×12', weight: '50–60 lbs' },
        { name: 'Cable lat pulldown', source: 'Centr 3', sets: '3×10', weight: '50–65 lbs' },
        { name: 'Cable hammer curl', source: 'Centr 3', sets: '3×12', weight: '20–25 lbs/side' },
      ],
      forearmFinisher: [
        { name: 'Reverse wrist curl', source: '', sets: '3×15', weight: '20 lbs' },
        { name: 'Dead hang', source: '', sets: '3×20s', weight: 'Bodyweight' },
      ],
      pronationDrill: null,
    },
    {
      title: 'Incline HIIT',
      type: 'hiit',
      duration: '20 min',
      note: 'Incline walking activates traps, rear delts, and core while burning serious calories.',
      exercises: [
        { name: 'Incline power walk', source: 'Treadmill', sets: '6×90s', weight: '10–12% incline, 3.5 mph' },
        { name: 'Flat recovery jog', source: 'Treadmill', sets: '6×60s', weight: '4 mph' },
      ],
      forearmFinisher: [],
      pronationDrill: null,
    },
    {
      title: 'Shoulders',
      type: 'strength',
      duration: '28 min',
      note: 'Lateral raises: stop at shoulder height, pinky slightly higher than thumb. No shrugging.',
      exercises: [
        { name: 'Pike push-up', source: 'Bodyweight', sets: '3×12', weight: '—' },
        { name: 'Cable lateral raise', source: 'Centr 3', sets: '3×15', weight: '10–15 lbs/side' },
        { name: 'Cable face pull', source: 'Centr 3', sets: '3×15', weight: '30–40 lbs' },
        { name: 'Cable front raise', source: 'Centr 3', sets: '3×12', weight: '10–15 lbs/side' },
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
    },
    {
      title: 'Upper body circuit',
      type: 'circuit',
      duration: '30 min',
      note: '30s rest between sets. Burpees replace treadmill today — go hard.',
      exercises: [
        { name: 'Push-up → cable row superset', source: 'Bodyweight + Centr 3', sets: '4×12+12', weight: 'Row: 50 lbs' },
        { name: 'Bench press (moderate)', source: 'Bench', sets: '3×12', weight: '115–125 lbs' },
        { name: 'Cable curl + pushdown', source: 'Centr 3', sets: '3×12+12', weight: 'Curl: 20 lbs · Push: 25 lbs' },
        { name: 'Burpee finisher', source: 'Bodyweight', sets: '3×10', weight: '—' },
      ],
      forearmFinisher: [],
      pronationDrill: null,
    },
    {
      title: 'Rest',
      type: 'rest',
      duration: '—',
      note: 'Recovery is when you grow. 7–9 hrs sleep and high protein today.',
      exercises: [
        { name: 'Light walking or stretching', source: '—', sets: 'Optional', weight: '—' },
        { name: 'Protein: 0.8–1g per lb bodyweight', source: '—', sets: 'All day', weight: '—' },
      ],
      forearmFinisher: [],
      pronationDrill: null,
    },
  ],

  // ===== WEEK 2 — Foundation =====
  [
    {
      title: 'Chest & Triceps',
      type: 'strength',
      duration: '29 min',
      note: 'High anchor fly = upper chest. Upper chest definition separates good physiques from great ones.',
      exercises: [
        { name: 'Barbell bench press', source: 'Bench', sets: '4×8', weight: '145 lbs' },
        { name: 'Cable incline fly (high anchor)', source: 'Centr 3', sets: '3×12', weight: '20 lbs/side' },
        { name: 'Decline push-up', source: 'Bodyweight', sets: '3× failure', weight: '—' },
        { name: 'Cable tricep pushdown', source: 'Centr 3', sets: '4×10', weight: '30–40 lbs' },
        { name: 'Tricep dip', source: 'Bodyweight', sets: '3×15', weight: 'Bodyweight' },
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
    },
    {
      title: 'Sprint HIIT',
      type: 'hiit',
      duration: '22 min',
      note: 'Two more intervals than Week 1, shorter recovery. Your engine is growing.',
      exercises: [
        { name: 'Warm-up', source: 'Treadmill', sets: '2 min', weight: '3.5 mph' },
        { name: 'All-out sprint', source: 'Treadmill', sets: '10×30s', weight: '9.5–10.5 mph' },
        { name: 'Recovery walk', source: 'Treadmill', sets: '10×45s', weight: '3.5 mph' },
      ],
      forearmFinisher: [],
      pronationDrill: null,
    },
    {
      title: 'Back & Biceps',
      type: 'strength',
      duration: '29 min',
      note: 'Inverted rows hit mid-back and rear delts hard with zero equipment.',
      exercises: [
        { name: 'Pull-up', source: 'Bodyweight', sets: '4×8', weight: 'Bodyweight (add 10 lbs if easy)' },
        { name: 'Cable single-arm row', source: 'Centr 3', sets: '3×12 each', weight: '30–35 lbs/side' },
        { name: 'Inverted row', source: 'Bodyweight', sets: '3×12', weight: '—' },
        { name: 'Cable curl (3s down)', source: 'Centr 3', sets: '4×10', weight: '20–25 lbs/side' },
      ],
      forearmFinisher: [
        { name: 'Reverse wrist curl', source: '', sets: '3×15', weight: '25 lbs' },
        { name: 'Farmer carry', source: '', sets: '3×30s', weight: '45 lbs/hand' },
      ],
      pronationDrill: null,
    },
    {
      title: 'Pyramid run',
      type: 'hiit',
      duration: '20 min',
      note: 'Cut the 4-min block if short on time.',
      exercises: [
        { name: 'Pyramid run intervals', source: 'Outdoor / treadmill', sets: '2/3/4/3/2 min hard', weight: 'RPE 8' },
        { name: 'Equal recovery jog between', source: '—', sets: '2/3/4/3/2 min easy', weight: 'RPE 4' },
      ],
      forearmFinisher: [],
      pronationDrill: null,
    },
    {
      title: 'Shoulders',
      type: 'strength',
      duration: '29 min',
      note: 'Y-raises hit all three deltoid heads simultaneously. Light weight, slow and controlled.',
      exercises: [
        { name: 'Handstand hold (wall)', source: 'Bodyweight', sets: '3×20s', weight: '—' },
        { name: 'Cable lateral raise', source: 'Centr 3', sets: '4×12', weight: '15 lbs/side' },
        { name: 'Cable face pull', source: 'Centr 3', sets: '4×15', weight: '40–50 lbs' },
        { name: 'Cable Y-raise', source: 'Centr 3', sets: '3×12', weight: '10 lbs/side' },
      ],
      forearmFinisher: [
        { name: 'Wrist curl', source: '', sets: '3×15', weight: '35 lbs' },
        { name: 'Reverse wrist curl', source: '', sets: '3×15', weight: '25 lbs' },
      ],
      pronationDrill: {
        name: 'Cable pronation drill',
        sets: '3×15 each arm',
        weight: '7–10 lbs',
        tip: 'Pause 1 second at full pronation before returning. Builds peak tension in the muscle.',
      },
    },
    {
      title: 'Upper body circuit',
      type: 'circuit',
      duration: '30 min',
      note: 'Bench then immediately into pull-ups — chest pre-fatigued makes back work harder.',
      exercises: [
        { name: 'Bench press', source: 'Bench', sets: '4×10', weight: '135 lbs' },
        { name: 'Pull-up + push-up superset', source: 'Bodyweight', sets: '4×6+15', weight: '—' },
        { name: 'Cable fly + face pull', source: 'Centr 3', sets: '3×12+12', weight: 'Fly: 20 lbs · Pull: 40 lbs' },
        { name: 'Treadmill sprint finisher', source: 'Treadmill', sets: '6×20s all-out', weight: '10+ mph' },
      ],
      forearmFinisher: [],
      pronationDrill: null,
    },
    {
      title: 'Rest',
      type: 'rest',
      duration: '—',
      note: 'Progress photos every Sunday morning. Same lighting and pose each week.',
      exercises: [
        { name: 'Foam roll chest, lats, upper back', source: '—', sets: '10–15 min', weight: '—' },
        { name: 'Take weekly progress photos', source: '—', sets: 'Every Sunday', weight: '—' },
      ],
      forearmFinisher: [],
      pronationDrill: null,
    },
  ],

  // ===== WEEK 3 — Build =====
  [
    {
      title: 'Chest & Triceps',
      type: 'strength',
      duration: '29 min',
      note: 'Low-to-high and high-to-low flies hit both upper and lower chest in one superset.',
      exercises: [
        { name: 'Barbell bench press', source: 'Bench', sets: '4×6', weight: '155 lbs' },
        { name: 'Incline + decline push-up', source: 'Bodyweight', sets: '3×8+8', weight: '—' },
        { name: 'Cable fly superset low→high', source: 'Centr 3', sets: '3×10+10', weight: '20 lbs/side' },
        { name: 'Skull crushers', source: 'Bench', sets: '3×12', weight: '65–75 lbs EZ bar' },
      ],
      forearmFinisher: [
        { name: 'Wrist curl', source: '', sets: '4×12', weight: '35–40 lbs' },
        { name: 'Dead hang', source: '', sets: '3×30s', weight: 'Bodyweight' },
      ],
      pronationDrill: {
        name: 'Cable pronation drill',
        sets: '4×12 each arm',
        weight: '10–12 lbs',
        tip: 'Now doing 4 sets. Squeeze hard at the bottom of the rotation on every rep.',
      },
    },
    {
      title: 'Outdoor run HIIT',
      type: 'hiit',
      duration: '25 min',
      note: 'Run outside if possible — terrain and wind recruit more stabilizers than treadmill.',
      exercises: [
        { name: 'Easy jog warm-up', source: 'Outdoor run', sets: '3 min', weight: '—' },
        { name: 'Hard effort', source: 'Outdoor run', sets: '8×45s', weight: '90% effort' },
        { name: 'Easy jog recovery', source: 'Outdoor run', sets: '8×45s', weight: '—' },
      ],
      forearmFinisher: [],
      pronationDrill: null,
    },
    {
      title: 'Back & Biceps',
      type: 'strength',
      duration: '29 min',
      note: 'Underhand grip rows hit biceps and lower lats simultaneously.',
      exercises: [
        { name: 'Weighted pull-up', source: 'Bodyweight', sets: '4×6', weight: 'BW + 10–15 lbs' },
        { name: 'Cable bent-over row', source: 'Centr 3', sets: '4×10', weight: '60–70 lbs' },
        { name: 'Underhand cable row', source: 'Centr 3', sets: '3×12', weight: '55–65 lbs' },
        { name: 'Barbell curl', source: 'Bench (barbell)', sets: '3×10', weight: '65–75 lbs' },
      ],
      forearmFinisher: [
        { name: 'Reverse wrist curl', source: '', sets: '4×12', weight: '25–30 lbs' },
        { name: 'Farmer carry', source: '', sets: '3×40s', weight: '45 lbs/hand' },
      ],
      pronationDrill: null,
    },
    {
      title: 'Plyometric + cardio',
      type: 'hiit',
      duration: '25 min',
      note: 'Plyometric push-ups build explosive chest power and torch calories like cardio.',
      exercises: [
        { name: 'Clap push-up', source: 'Bodyweight', sets: '4×8', weight: '—' },
        { name: 'Sprint', source: 'Treadmill / outdoor', sets: '6×30s', weight: 'Max effort' },
        { name: 'Recovery walk', source: '—', sets: '6×60s', weight: '—' },
        { name: 'Explosive push-up hold', source: 'Bodyweight', sets: '3×10', weight: '—' },
      ],
      forearmFinisher: [],
      pronationDrill: null,
    },
    {
      title: 'Shoulders',
      type: 'strength',
      duration: '29 min',
      note: 'Push press lets you overload shoulders beyond strict press weight.',
      exercises: [
        { name: 'Push press (barbell)', source: 'Bench', sets: '4×8', weight: '75–85 lbs' },
        { name: 'Cable lateral raise', source: 'Centr 3', sets: '4×10', weight: '17–20 lbs/side' },
        { name: 'Cable face pull', source: 'Centr 3', sets: '4×15', weight: '45–55 lbs' },
        { name: 'Pike push-up to failure', source: 'Bodyweight', sets: '2 sets', weight: '—' },
      ],
      forearmFinisher: [
        { name: 'Wrist curl + reverse superset', source: '', sets: '3×12+12', weight: '35 / 25 lbs' },
        { name: 'Dead hang', source: '', sets: '2×30s', weight: '—' },
      ],
      pronationDrill: {
        name: 'Cable pronation drill + wrist cup hold',
        sets: '3×12 + 20s hold',
        weight: '10 lbs drill / 15 lbs hold',
        tip: 'After each set, hold wrist in cupped/flexed position for 20s — mimics arm wrestling wrist lock.',
      },
    },
    {
      title: 'Full shred circuit',
      type: 'circuit',
      duration: '30 min',
      note: 'No rest inside cable circuits. Rest 90s between rounds only.',
      exercises: [
        { name: 'Bench press', source: 'Bench', sets: '3×10', weight: '135 lbs' },
        { name: '5-exercise cable circuit', source: 'Centr 3', sets: '4 rounds × 10 reps each', weight: 'Fly 20 · Row 60 · Curl 22 · Push 35 · Face pull 45' },
        { name: 'Pull-up burnout', source: 'Bodyweight', sets: '1 set to failure', weight: '—' },
        { name: 'Burpee + sprint combo', source: 'Bodyweight + treadmill', sets: '5×(5 burpees + 20s sprint)', weight: '—' },
      ],
      forearmFinisher: [],
      pronationDrill: null,
    },
    {
      title: 'Rest',
      type: 'rest',
      duration: '—',
      note: 'Weeks 3–4 diet matters most. Clean protein and vegetables = visible definition by Week 6.',
      exercises: [
        { name: 'Full upper body stretch', source: '—', sets: '15–20 min', weight: '—' },
        { name: 'Cut sugar and processed carbs', source: '—', sets: 'Priority this week', weight: '—' },
      ],
      forearmFinisher: [],
      pronationDrill: null,
    },
  ],

  // ===== WEEK 4 — Build =====
  [
    {
      title: 'Chest & Triceps',
      type: 'strength',
      duration: '30 min',
      note: '165 lbs = ~89% of your max. Rest 2 min between bench sets.',
      exercises: [
        { name: 'Barbell bench press (heavy)', source: 'Bench', sets: '5×5', weight: '165 lbs' },
        { name: 'Wide + narrow push-up', source: 'Bodyweight', sets: '3×10+10', weight: '—' },
        { name: 'Cable chest fly', source: 'Centr 3', sets: '4×10', weight: '22–25 lbs/side' },
        { name: 'Cable overhead tricep ext.', source: 'Centr 3', sets: '4×10', weight: '35–45 lbs' },
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
    },
    {
      title: 'Incline HIIT',
      type: 'hiit',
      duration: '25 min',
      note: 'Minimal rest now. Incline + near-zero recovery maximizes fat oxidation.',
      exercises: [
        { name: 'Incline power walk', source: 'Treadmill', sets: '10×90s', weight: '14–15% incline, 3.8 mph' },
        { name: 'Flat jog recovery', source: 'Treadmill', sets: '10×30s', weight: '4.5 mph' },
      ],
      forearmFinisher: [],
      pronationDrill: null,
    },
    {
      title: 'Back & Biceps',
      type: 'strength',
      duration: '30 min',
      note: 'Reverse curls hit the brachialis — pushes the bicep peak up visibly.',
      exercises: [
        { name: 'Weighted pull-up', source: 'Bodyweight', sets: '5×5', weight: 'BW + 15–20 lbs' },
        { name: 'Cable row (heavy)', source: 'Centr 3', sets: '4×8', weight: '65–75 lbs' },
        { name: 'Barbell curl', source: 'Bench (barbell)', sets: '4×8', weight: '75–85 lbs' },
        { name: 'Cable reverse curl', source: 'Centr 3', sets: '3×12', weight: '20–25 lbs/side' },
      ],
      forearmFinisher: [
        { name: 'Reverse wrist curl (heavy)', source: '', sets: '4×10', weight: '30 lbs' },
        { name: 'Farmer carry', source: '', sets: '3×45s', weight: '50 lbs/hand' },
      ],
      pronationDrill: null,
    },
    {
      title: 'Sprint + bodyweight',
      type: 'hiit',
      duration: '25 min',
      note: 'Upper body work between sprints strips fat while keeping muscle.',
      exercises: [
        { name: 'Outdoor sprint', source: 'Run', sets: '6×40s', weight: 'Max effort' },
        { name: 'Recovery walk', source: '—', sets: '6×60s', weight: '—' },
        { name: 'Explosive push-up', source: 'Bodyweight', sets: '4×10', weight: '—' },
        { name: 'Inverted row', source: 'Bodyweight', sets: '3×12', weight: '—' },
      ],
      forearmFinisher: [],
      pronationDrill: null,
    },
    {
      title: 'Shoulders (heavy)',
      type: 'strength',
      duration: '30 min',
      note: '5 sets of laterals — no other exercise creates that capped shoulder look more directly.',
      exercises: [
        { name: 'Push press', source: 'Bench', sets: '4×6', weight: '95–105 lbs' },
        { name: 'Cable lateral raise', source: 'Centr 3', sets: '5×10', weight: '18–22 lbs/side' },
        { name: 'Cable face pull', source: 'Centr 3', sets: '4×15', weight: '50–60 lbs' },
        { name: 'Cable rear delt fly', source: 'Centr 3', sets: '4×15', weight: '12–15 lbs/side' },
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
    },
    {
      title: 'Full shred circuit',
      type: 'circuit',
      duration: '30 min',
      note: 'Tabata at the end of a full circuit = most metabolically demanding session so far.',
      exercises: [
        { name: 'Bench press', source: 'Bench', sets: '4×8', weight: '145 lbs' },
        { name: '6-exercise cable circuit', source: 'Centr 3', sets: '4 rounds × 8–10 reps', weight: 'Fly 22 · Row 65 · Curl 25 · Push 40 · Face pull 50 · Lateral 18' },
        { name: 'Weighted pull-up', source: 'Bodyweight', sets: '2× failure', weight: 'BW + 10 lbs' },
        { name: 'Treadmill Tabata', source: 'Treadmill', sets: '8×20s / 10s off', weight: '10.5+ mph' },
      ],
      forearmFinisher: [],
      pronationDrill: null,
    },
    {
      title: 'Rest',
      type: 'rest',
      duration: '—',
      note: 'Week 4 done. Clear muscle definition should be emerging. Two more weeks.',
      exercises: [
        { name: 'Full mobility session', source: '—', sets: '20 min', weight: '—' },
        { name: '7–9 hrs sleep — non-negotiable', source: '—', sets: '—', weight: '—' },
      ],
      forearmFinisher: [],
      pronationDrill: null,
    },
  ],

  // ===== WEEK 5 — Peak =====
  [
    {
      title: 'Chest & Triceps (peak)',
      type: 'strength',
      duration: '30 min',
      note: '175 lbs = ~95% of your max. Controlled descent, explosive press. Record every set.',
      exercises: [
        { name: 'Barbell bench press (near max)', source: 'Bench', sets: '4×4', weight: '170–175 lbs' },
        { name: 'Cable fly (heavy, slow eccentric)', source: 'Centr 3', sets: '4×8', weight: '25–28 lbs/side' },
        { name: 'Weighted dip', source: 'Bench / bars', sets: '3×8', weight: 'BW + 15–20 lbs' },
        { name: 'Tricep pushdown', source: 'Centr 3', sets: '4×8', weight: '40–50 lbs' },
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
    },
    {
      title: 'Max HIIT',
      type: 'hiit',
      duration: '20 min',
      note: '20s on / 40s off — shorter but more intense than anything prior.',
      exercises: [
        { name: 'All-out sprint', source: 'Treadmill / outdoor', sets: '10×20s', weight: 'True max effort' },
        { name: 'Walk recovery', source: '—', sets: '10×40s', weight: '—' },
      ],
      forearmFinisher: [],
      pronationDrill: null,
    },
    {
      title: 'Back & Biceps (peak)',
      type: 'strength',
      duration: '30 min',
      note: 'Record every weight — this is your strength benchmark for peak phase.',
      exercises: [
        { name: 'Weighted pull-up', source: 'Bodyweight', sets: '4×4–5', weight: 'BW + 20–25 lbs' },
        { name: 'Cable row (heaviest)', source: 'Centr 3', sets: '4×6', weight: '70–80 lbs' },
        { name: 'Barbell curl (peak)', source: 'Bench (barbell)', sets: '4×6', weight: '85–95 lbs' },
        { name: 'Cable reverse curl', source: 'Centr 3', sets: '3×10', weight: '25 lbs/side' },
      ],
      forearmFinisher: [
        { name: 'Reverse wrist curl (peak)', source: '', sets: '4×8', weight: '35 lbs' },
        { name: 'Farmer carry', source: '', sets: '3×50s', weight: '55 lbs/hand' },
      ],
      pronationDrill: null,
    },
    {
      title: 'Tabata treadmill',
      type: 'hiit',
      duration: '20 min',
      note: '3 Tabata blocks = 12 minutes of real work in 20 total.',
      exercises: [
        { name: 'Tabata block × 3', source: 'Treadmill', sets: '20s sprint / 10s off × 8 per block', weight: '10.5+ mph' },
        { name: '90s rest between blocks', source: '—', sets: '—', weight: '—' },
      ],
      forearmFinisher: [],
      pronationDrill: null,
    },
    {
      title: 'Shoulders (peak)',
      type: 'strength',
      duration: '30 min',
      note: 'Rear delts are the muscle most people neglect — they show most in photos.',
      exercises: [
        { name: 'Push press (peak)', source: 'Bench', sets: '4×5', weight: '105–115 lbs' },
        { name: 'Cable lateral raise', source: 'Centr 3', sets: '5×8', weight: '20–25 lbs/side' },
        { name: 'Cable face pull', source: 'Centr 3', sets: '5×12', weight: '55–65 lbs' },
        { name: 'Rear delt cable fly', source: 'Centr 3', sets: '4×15', weight: '14–17 lbs/side' },
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
    },
    {
      title: 'Peak circuit',
      type: 'circuit',
      duration: '30 min',
      note: '8 exercises, no rest mid-circuit. The hardest session in the program. You are ready.',
      exercises: [
        { name: 'Bench press', source: 'Bench', sets: '3×8', weight: '155 lbs' },
        { name: '8-exercise cable circuit', source: 'Centr 3', sets: '3 rounds × 8 reps each', weight: 'All at peak weights' },
        { name: 'Pull-ups to failure', source: 'Bodyweight', sets: '2 sets', weight: 'Weighted if possible' },
        { name: 'Treadmill Tabata finisher', source: 'Treadmill', sets: '1 block (4 min)', weight: 'Max speed' },
      ],
      forearmFinisher: [],
      pronationDrill: null,
    },
    {
      title: 'Rest',
      type: 'rest',
      duration: '—',
      note: "Cut processed foods and sodium. You'll look noticeably leaner from reduced water weight alone.",
      exercises: [
        { name: 'Gentle walk + full stretch', source: '—', sets: '20 min', weight: '—' },
        { name: 'Cut sodium this week', source: '—', sets: 'Reduces water retention', weight: '—' },
      ],
      forearmFinisher: [],
      pronationDrill: null,
    },
  ],

  // ===== WEEK 6 — Peak =====
  [
    {
      title: 'Chest & Triceps (final)',
      type: 'strength',
      duration: '30 min',
      note: 'Open with a bench press max attempt. 6 weeks of training should push you past 185.',
      exercises: [
        { name: 'Bench press max attempt', source: 'Bench', sets: 'Work up to 1RM', weight: '185+ lbs — beat your PR' },
        { name: 'Cable fly', source: 'Centr 3', sets: '4×8', weight: 'Peak weight from wk 5' },
        { name: 'Weighted dip', source: 'Bench / bars', sets: '3×8', weight: 'BW + 20 lbs' },
        { name: 'Tricep pushdown drop set', source: 'Centr 3', sets: '3× drop to failure', weight: '45→30 lbs' },
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
    },
    {
      title: 'HIIT final push',
      type: 'hiit',
      duration: '20 min',
      note: 'Last big cardio day. 12 intervals — 2 more than Week 5. Leave nothing.',
      exercises: [
        { name: 'Sprint intervals', source: 'Treadmill / outdoor', sets: '12×20s on / 40s off', weight: 'Max speed' },
      ],
      forearmFinisher: [],
      pronationDrill: null,
    },
    {
      title: 'Back & Biceps (final)',
      type: 'strength',
      duration: '30 min',
      note: 'Max pull-up attempt — track how much weight you added over 6 weeks.',
      exercises: [
        { name: 'Weighted pull-up max attempt', source: 'Bodyweight', sets: 'Work up to max', weight: 'BW + 25 lbs target' },
        { name: 'Cable row (heaviest ever)', source: 'Centr 3', sets: '5×5', weight: 'Peak + 5 lbs' },
        { name: 'Barbell curl', source: 'Bench (barbell)', sets: '4×6', weight: '90–100 lbs' },
        { name: 'Cable reverse curl', source: 'Centr 3', sets: '3×10', weight: '25 lbs/side' },
      ],
      forearmFinisher: [
        { name: 'Reverse wrist curl (max)', source: '', sets: '4×6', weight: '40 lbs' },
        { name: 'Farmer carry', source: '', sets: '3×60s', weight: '60 lbs/hand' },
      ],
      pronationDrill: null,
    },
    {
      title: 'Final Tabata',
      type: 'hiit',
      duration: '20 min',
      note: 'Your last hard cardio session. 4 full Tabata blocks. Everything you have.',
      exercises: [
        { name: 'Tabata sprints × 4 blocks', source: 'Treadmill', sets: '20s / 10s × 8 per block', weight: 'Absolute max effort' },
        { name: '90s rest between blocks', source: '—', sets: '—', weight: '—' },
      ],
      forearmFinisher: [],
      pronationDrill: null,
    },
    {
      title: 'Shoulders (final)',
      type: 'strength',
      duration: '30 min',
      note: 'Drop sets on your final set of every exercise — strip weight and push to absolute failure.',
      exercises: [
        { name: 'Push press', source: 'Bench', sets: '4×5', weight: 'Peak weight' },
        { name: 'Cable lateral raise', source: 'Centr 3', sets: '5×8', weight: 'Peak weight' },
        { name: 'Cable face pull', source: 'Centr 3', sets: '5×12', weight: 'Peak weight' },
        { name: 'Full shoulder drop set burnout', source: 'Centr 3', sets: '1 drop set per exercise', weight: 'Drop 30% at failure, keep going' },
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
    },
    {
      title: 'Final benchmark',
      type: 'circuit',
      duration: '30 min',
      note: 'Log everything: push-up count, pull-up weight, sprint speed. Compare to Week 1.',
      exercises: [
        { name: 'Max push-up test', source: 'Bodyweight', sets: '1 set to failure', weight: 'Compare to Week 1' },
        { name: 'Full 8-exercise cable circuit', source: 'Centr 3', sets: '3 rounds', weight: 'Peak weights' },
        { name: 'Weighted pull-up max set', source: 'Bodyweight', sets: '1 set to failure', weight: '—' },
        { name: 'Fastest Tabata ever', source: 'Treadmill', sets: '1 block at max speed', weight: 'Set a new record' },
      ],
      forearmFinisher: [],
      pronationDrill: null,
    },
    {
      title: 'Done — celebrate',
      type: 'rest',
      duration: '—',
      note: '6 weeks complete. Stronger, leaner, more defined. Set your next goal and keep going.',
      exercises: [
        { name: 'Full rest and progress photos', source: '—', sets: '—', weight: '—' },
        { name: 'Compare Week 1 vs Week 6 photos', source: '—', sets: '—', weight: '—' },
      ],
      forearmFinisher: [],
      pronationDrill: null,
    },
  ],
];
