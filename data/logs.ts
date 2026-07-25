// Per-exercise working-set logging (§6, Option A).
//
// One set is stored per exercise per day under `log:{globalIndex}:{exerciseId}`.
// The check-in screen scans these to auto-fill the 2-week template.

import AsyncStorage from '@react-native-async-storage/async-storage';
import { SetLog, resolvedDays } from './workoutPlan';

export type { SetLog };

export const logKey = (globalIndex: number, exerciseId: string) =>
  `log:${globalIndex}:${exerciseId}`;

export async function getLog(
  globalIndex: number,
  exerciseId: string,
): Promise<SetLog | null> {
  try {
    const raw = await AsyncStorage.getItem(logKey(globalIndex, exerciseId));
    return raw ? (JSON.parse(raw) as SetLog) : null;
  } catch {
    return null;
  }
}

export async function setLog(
  globalIndex: number,
  exerciseId: string,
  log: SetLog,
): Promise<void> {
  try {
    await AsyncStorage.setItem(logKey(globalIndex, exerciseId), JSON.stringify(log));
  } catch {}
}

/** All saved logs for one day, keyed by exercise_id (for prefilling the rows). */
export async function getDayLogs(
  globalIndex: number,
  exerciseIds: string[],
): Promise<Record<string, SetLog>> {
  const result: Record<string, SetLog> = {};
  if (exerciseIds.length === 0) return result;
  try {
    const keys = exerciseIds.map((id) => logKey(globalIndex, id));
    const entries = await AsyncStorage.multiGet(keys);
    entries.forEach(([, raw], i) => {
      if (!raw) return;
      try {
        result[exerciseIds[i]] = JSON.parse(raw) as SetLog;
      } catch {}
    });
  } catch {}
  return result;
}

/**
 * Every logged set from `weeks`, grouped by exercise_id — the input to
 * fillCheckinTemplate. Reads only the log keys for the relevant day indices.
 */
export async function getLogsForWeeks(
  weeks: number[],
): Promise<Record<string, SetLog[]>> {
  const grouped: Record<string, SetLog[]> = {};
  const weekSet = new Set(weeks);
  const days = resolvedDays.filter((d) => weekSet.has(d.week) && d.kind === 'training');

  const pairs = days.flatMap((d) =>
    d.main
      .concat(d.forearmFinisher?.exercises ?? [])
      .concat(d.coreFinisher?.exercises ?? [])
      .map((ex) => ({ key: logKey(d.globalIndex, ex.id), id: ex.id })),
  );
  if (pairs.length === 0) return grouped;

  try {
    const entries = await AsyncStorage.multiGet(pairs.map((p) => p.key));
    entries.forEach(([key, raw], i) => {
      if (!raw) return;
      try {
        const log = JSON.parse(raw) as SetLog;
        const id = pairs[i].id;
        (grouped[id] ??= []).push(log);
      } catch {}
    });
  } catch {}
  return grouped;
}
