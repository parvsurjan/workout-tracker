// Data layer for the 8-Month Upper Body Hypertrophy Program.
//
// The JSON in ./upper_body_8_month_plan.json is the single source of truth.
// This module types that JSON, then flattens it ONCE at load time into a flat,
// chronological ResolvedDay[] — one entry per weekday slot across all 34 weeks —
// so the screens keep the existing "current day index" model.
//
// To ship a new plan later: drop in a new JSON file, keep the same shape.

import plan from './upper_body_8_month_plan.json';

// ===================================================================
// 1. Raw JSON types (mirror the file structure exactly)
// ===================================================================

type RawMainExercise = {
  exercise_id: string;
  sets: number;
  reps: string;
  rir?: string;
  rest_sec?: number;
  note?: string;
  start_load_lbs?: number | null;
};

type RawFinisherExercise = {
  exercise_id: string;
  sets: number;
  reps: string;
  rest_sec?: number;
  start_load_lbs?: number | null;
  note?: string;
};

type RawCardio = {
  exercise_id: string;
  duration_min: number;
  detail: string;
} | null;

type RawSession = {
  day: number;
  name: string;
  target_min: number;
  main: RawMainExercise[];
  forearm_finisher: string | null;
  core_finisher: string | null;
  cardio: RawCardio;
};

type RawFinisher = {
  id: string;
  name: string;
  duration_min: string;
  focus: string;
  exercises: RawFinisherExercise[];
};

export type LibraryExercise = {
  id: string;
  name: string;
  category: string;
  equipment: string;
  setup: string;
  grip: string;
  execution: string;
  cues: string[];
  common_mistakes: string[];
  notes: string;
};

type RawScheduleDay = {
  weekday: string;
  session: number | null;
  type?: string;
};

type RawCheckinDay = {
  weekday: string;
  type: string;
  action: string;
  template_id: string;
};

type RawScheduleWeek = {
  week: number;
  block: string; // block id, e.g. "block_1"
  days_per_week: number;
  session_template: string; // "block1" | "block2plus"
  days: RawScheduleDay[];
  is_deload: boolean;
  is_checkin_week: boolean;
  checkin_day?: RawCheckinDay;
};

type RawBlock = {
  id: string;
  name: string;
  weeks: string;
  days_per_week: number;
  goal: string;
  intensity: string;
  session_template: string;
  weekly_notes: Record<string, string>;
  modifications?: string[];
};

type RawCheckin = {
  id: string;
  frequency: string;
  instructions: string;
  template: string;
};

type RawPlan = {
  meta: Record<string, unknown>;
  warmup_protocol: Record<string, unknown>;
  progression: Record<string, unknown>;
  safety: Record<string, unknown>;
  recovery: Record<string, unknown>;
  nutrition: Record<string, unknown>;
  expectations: Record<string, unknown>;
  blocks: RawBlock[];
  session_templates: Record<string, RawSession[]>;
  finishers: Record<string, RawFinisher>;
  exercise_library: Record<string, LibraryExercise>;
  checkin: RawCheckin;
  schedule: RawScheduleWeek[];
};

const PLAN = plan as unknown as RawPlan;

// ===================================================================
// 2. Resolved types (what the screens consume)
// ===================================================================

export type ExerciseForm = {
  setup: string;
  grip: string;
  execution: string;
  cues: string[];
  commonMistakes: string[];
  notes: string;
};

export type ResolvedExercise = {
  id: string;
  name: string;
  equipment: string; // from library
  sets: number;
  reps: string; // "8-10", "max clean reps", etc.
  rir?: string;
  restSec?: number;
  loadLbs: number | null; // null => render "Bodyweight" / "Log it"
  note?: string;
  form: ExerciseForm; // from exercise_library, for the tap-to-expand detail
};

export type ResolvedCardio = {
  name: string;
  durationMin: number;
  detail: string;
};

export type ResolvedFinisher = {
  id: string;
  name: string;
  exercises: ResolvedExercise[];
};

export type DayKind = 'training' | 'rest' | 'checkin';

export type BlockRef = { id: string; name: string };

export type ResolvedDay = {
  globalIndex: number; // 0..TOTAL_DAYS-1, replaces the old flat index
  week: number; // 1..34
  dayInWeek: number; // 1-based position among this week's kept slots ("Day N")
  block: BlockRef;
  isDeload: boolean;
  kind: DayKind;
  title: string; // session name, "Rest", or "2-Week Check-In"
  targetMin?: number;
  coachingNote?: string; // weekly_notes[week]
  main: ResolvedExercise[];
  cardio?: ResolvedCardio;
  forearmFinisher?: ResolvedFinisher;
  coreFinisher?: ResolvedFinisher;
  checkin?: { instructions: string; template: string };
};

// ===================================================================
// 3. Lookup helpers
// ===================================================================

export function getExercise(id: string): LibraryExercise | undefined {
  return PLAN.exercise_library[id];
}

export function getFinisher(id: string): RawFinisher | undefined {
  return PLAN.finishers[id];
}

const BLOCKS_BY_ID: Record<string, RawBlock> = Object.fromEntries(
  PLAN.blocks.map((b) => [b.id, b]),
);

/** Block a given 1-based week belongs to. Driven by the schedule, not literals. */
export function BLOCK_FOR_WEEK(week: number): BlockRef {
  const wk = PLAN.schedule.find((w) => w.week === week);
  const id = wk ? wk.block : PLAN.blocks[0].id;
  const block = BLOCKS_BY_ID[id];
  return { id, name: block ? block.name : id };
}

// The full library, for the (future) Exercise Library screen.
export const EXERCISE_LIBRARY: LibraryExercise[] = Object.values(PLAN.exercise_library);

// Program-info sections that currently have no home in the UI.
export const PROGRAM_INFO = {
  meta: PLAN.meta,
  warmup: PLAN.warmup_protocol,
  progression: PLAN.progression,
  safety: PLAN.safety,
  recovery: PLAN.recovery,
  nutrition: PLAN.nutrition,
  expectations: PLAN.expectations,
};

// ===================================================================
// 4. Resolver — flatten the normalized JSON into ResolvedDay[]
// ===================================================================

const EMPTY_FORM: ExerciseForm = {
  setup: '',
  grip: '',
  execution: '',
  cues: [],
  commonMistakes: [],
  notes: '',
};

function toForm(lib: LibraryExercise | undefined): ExerciseForm {
  if (!lib) return EMPTY_FORM;
  return {
    setup: lib.setup,
    grip: lib.grip,
    execution: lib.execution,
    cues: lib.cues ?? [],
    commonMistakes: lib.common_mistakes ?? [],
    notes: lib.notes,
  };
}

function resolveExercise(ex: RawMainExercise | RawFinisherExercise): ResolvedExercise {
  const lib = getExercise(ex.exercise_id);
  const rir = 'rir' in ex ? ex.rir : undefined;
  return {
    id: ex.exercise_id,
    name: lib ? lib.name : ex.exercise_id,
    equipment: lib ? lib.equipment : '',
    sets: ex.sets,
    reps: ex.reps,
    rir,
    restSec: ex.rest_sec,
    // start_load_lbs is nullable/absent for bodyweight & "primary" lifts.
    loadLbs: ex.start_load_lbs ?? null,
    note: ex.note && ex.note.length > 0 ? ex.note : undefined,
    form: toForm(lib),
  };
}

function resolveFinisher(finisherId: string | null): ResolvedFinisher | undefined {
  if (!finisherId) return undefined;
  const f = getFinisher(finisherId);
  if (!f) return undefined;
  return {
    id: f.id,
    name: f.name,
    exercises: f.exercises.map(resolveExercise),
  };
}

function resolveCardio(cardio: RawCardio): ResolvedCardio | undefined {
  if (!cardio) return undefined;
  const lib = getExercise(cardio.exercise_id);
  return {
    name: lib ? lib.name : cardio.exercise_id,
    durationMin: cardio.duration_min,
    detail: cardio.detail,
  };
}

function buildResolvedDays(): ResolvedDay[] {
  const days: ResolvedDay[] = [];
  let globalIndex = 0;

  for (const wk of PLAN.schedule) {
    const block = BLOCK_FOR_WEEK(wk.week);
    const blockRaw = BLOCKS_BY_ID[wk.block];
    const coachingNote = blockRaw?.weekly_notes?.[String(wk.week)];
    const template = PLAN.session_templates[wk.session_template] ?? [];
    let dayInWeek = 0; // counts only kept (non-rest) slots within the week

    for (const scheduleDay of wk.days) {
      const isSunday = scheduleDay.weekday === 'Sunday';
      const isCheckinSlot = wk.is_checkin_week && isSunday;

      // §4: on even (check-in) weeks the Sunday rest slot BECOMES the check-in.
      if (isCheckinSlot) {
        dayInWeek += 1;
        days.push({
          globalIndex: globalIndex++,
          week: wk.week,
          dayInWeek,
          block,
          isDeload: wk.is_deload,
          coachingNote,
          main: [],
          kind: 'checkin',
          title: '2-Week Check-In',
          checkin: {
            instructions: PLAN.checkin.instructions,
            template: PLAN.checkin.template,
          },
        });
        continue;
      }

      // Rest days are dropped entirely from the program.
      if (scheduleDay.session == null) continue;
      const session = template.find((s) => s.day === scheduleDay.session);
      if (!session) continue;

      dayInWeek += 1;
      days.push({
        globalIndex: globalIndex++,
        week: wk.week,
        dayInWeek,
        block,
        isDeload: wk.is_deload,
        coachingNote,
        main: session.main.map(resolveExercise),
        kind: 'training',
        title: session.name,
        targetMin: session.target_min,
        cardio: resolveCardio(session.cardio),
        forearmFinisher: resolveFinisher(session.forearm_finisher),
        coreFinisher: resolveFinisher(session.core_finisher),
      });
    }
  }

  return days;
}

// ===================================================================
// 5. Public exports (screens use these)
// ===================================================================

export const resolvedDays: ResolvedDay[] = buildResolvedDays();

// Variable, not weeks × 7. Always compute from the flattened program.
export const TOTAL_DAYS = resolvedDays.length;

export const TOTAL_WEEKS = PLAN.schedule.length;

/** globalIndex of the first slot of each week — lets Calendar group by week. */
export const weekStartIndices: number[] = (() => {
  const starts: number[] = [];
  let seen = -1;
  resolvedDays.forEach((d) => {
    if (d.week !== seen) {
      starts.push(d.globalIndex);
      seen = d.week;
    }
  });
  return starts;
})();

// ===================================================================
// 6. Check-in autofill (§6, Option A: fill from logged sets)
// ===================================================================

// One logged working set per exercise per day.
export type SetLog = { weightLbs: string; reps: string; rir: string };

// Maps each {{placeholder}} stem in the check-in template to the exercise_id
// whose best working set fills it, plus which fields that lift reports.
type CheckinLift = {
  key: string; // placeholder stem, e.g. "flat_press" -> {{flat_press_lbs}} ...
  exerciseId: string;
  fields: ('lbs' | 'reps' | 'rir')[];
};

export const CHECKIN_LIFTS: CheckinLift[] = [
  { key: 'flat_press', exerciseId: 'smith_flat_press', fields: ['lbs', 'reps', 'rir'] },
  { key: 'incline_press', exerciseId: 'smith_incline_press', fields: ['lbs', 'reps', 'rir'] },
  { key: 'ohp', exerciseId: 'smith_ohp_seated', fields: ['lbs', 'reps', 'rir'] },
  { key: 'cgbp', exerciseId: 'smith_close_grip_press', fields: ['lbs', 'reps', 'rir'] },
  { key: 'row', exerciseId: 'smith_bent_row', fields: ['lbs', 'reps', 'rir'] },
  { key: 'pulldown', exerciseId: 'lat_pulldown_wide', fields: ['lbs', 'reps', 'rir'] },
  { key: 'cable_row', exerciseId: 'seated_cable_row', fields: ['lbs', 'reps', 'rir'] },
  { key: 'pullup', exerciseId: 'pullup', fields: ['reps'] },
  { key: 'lat_raise', exerciseId: 'cable_lateral_raise', fields: ['lbs', 'reps'] },
  { key: 'curl', exerciseId: 'cable_curl', fields: ['lbs', 'reps'] },
  { key: 'pushdown', exerciseId: 'rope_pushdown', fields: ['lbs', 'reps'] },
  { key: 'cable_crunch', exerciseId: 'cable_crunch', fields: ['lbs', 'reps'] },
  { key: 'wrist_curl', exerciseId: 'smith_wrist_curl', fields: ['lbs', 'reps'] },
  { key: 'rev_wrist_curl', exerciseId: 'smith_reverse_wrist_curl', fields: ['lbs', 'reps'] },
  { key: 'rev_curl', exerciseId: 'cable_reverse_curl', fields: ['lbs', 'reps'] },
];

// Placeholders that map to a duration/max-hold field rather than lbs×reps.
const CHECKIN_SECONDS: { placeholder: string; exerciseId: string }[] = [
  { placeholder: 'dead_hang_sec', exerciseId: 'dead_hang' },
  { placeholder: 'plank_sec', exerciseId: 'long_lever_plank' },
];

// The hanging leg/knee raise fills {{leg_raise_reps}} (best set).
const LEG_RAISE_IDS = ['hanging_leg_raise', 'hanging_knee_raise'];

function num(s: string | undefined): number {
  const n = parseFloat((s ?? '').replace(/[^0-9.]/g, ''));
  return isNaN(n) ? 0 : n;
}

/** Best working set = heaviest load, tie-broken by most reps (reps-only for bodyweight). */
function bestSet(logs: SetLog[]): SetLog | undefined {
  if (logs.length === 0) return undefined;
  return [...logs].sort((a, b) => {
    const w = num(b.weightLbs) - num(a.weightLbs);
    if (w !== 0) return w;
    return num(b.reps) - num(a.reps);
  })[0];
}

/**
 * Fill the check-in template for a check-in day. `logsByExercise` should hold
 * every logged set from the two weeks the check-in covers, grouped by exercise_id.
 * Placeholders with no data become "n/a" per the check-in instructions.
 */
export function fillCheckinTemplate(
  day: ResolvedDay,
  logsByExercise: Record<string, SetLog[]>,
): string {
  let out = day.checkin?.template ?? PLAN.checkin.template;
  const values: Record<string, string> = {
    week_start: String(Math.max(1, day.week - 1)),
    week_end: String(day.week),
    block_name: day.block.name,
  };

  for (const lift of CHECKIN_LIFTS) {
    const best = bestSet(logsByExercise[lift.exerciseId] ?? []);
    for (const f of lift.fields) {
      values[`${lift.key}_${f}`] = best ? best[f === 'lbs' ? 'weightLbs' : f] : 'n/a';
    }
  }

  for (const s of CHECKIN_SECONDS) {
    const best = bestSet(logsByExercise[s.exerciseId] ?? []);
    // Duration lifts store their seconds in the reps field.
    values[s.placeholder] = best ? best.reps : 'n/a';
  }

  const legLogs = LEG_RAISE_IDS.flatMap((id) => logsByExercise[id] ?? []);
  const legBest = bestSet(legLogs);
  values['leg_raise_reps'] = legBest ? legBest.reps : 'n/a';

  // Replace known placeholders; anything left over falls back to "n/a".
  out = out.replace(/\{\{(\w+)\}\}/g, (_, key: string) =>
    key in values ? values[key] : 'n/a',
  );
  return out;
}

// Exercise ids the check-in reports on — the log rows worth defaulting/scanning.
export const CHECKIN_EXERCISE_IDS: string[] = Array.from(
  new Set([
    ...CHECKIN_LIFTS.map((l) => l.exerciseId),
    ...CHECKIN_SECONDS.map((s) => s.exerciseId),
    ...LEG_RAISE_IDS,
  ]),
);
