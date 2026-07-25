export const theme = {
  bg: '#0d0d0d',
  surface: '#141414',
  surfaceAlt: '#1c1c1c',
  border: '#2a2a2a',
  text: '#f5f5f5',
  textMuted: '#9ca3af',
  textDim: '#6b7280',

  weightPillBg: 'rgba(34, 197, 94, 0.15)',
  weightPillText: '#22c55e',

  // Muted pill for bodyweight / unlogged lifts (loadLbs === null).
  bodyweightPillBg: 'rgba(148, 163, 184, 0.14)',
  bodyweightPillText: '#94a3b8',

  forearmBg: 'rgba(245, 158, 11, 0.12)',
  forearmAccent: '#f59e0b',

  coreBg: 'rgba(20, 184, 166, 0.12)',
  coreAccent: '#14b8a6',

  cardioBg: 'rgba(56, 189, 248, 0.12)',
  cardioAccent: '#38bdf8',

  checkinBg: 'rgba(168, 85, 247, 0.12)',
  checkinAccent: '#a855f7',

  // Deload weeks read desaturated/muted at a glance.
  deloadBg: 'rgba(107, 114, 128, 0.14)',
  deloadAccent: '#94a3b8',

  // Day kinds (rest is dropped from the program but kept for safety).
  kindColors: {
    training: '#3a9ee8',
    cardio: '#38bdf8',
    checkin: '#a855f7',
    rest: '#6b7280',
  } as Record<string, string>,

  // Five training blocks across the 34-week program.
  blockColors: {
    block_1: '#3a9ee8', // Foundation & Calibration — blue
    block_2: '#22c55e', // Hypertrophy Accumulation — green
    block_3: '#f59e0b', // Intensification — amber
    block_4: '#ef4444', // Volume Peak & Definition — red
    block_5: '#a855f7', // Consolidation & Best-Of — purple
  } as Record<string, string>,
};
