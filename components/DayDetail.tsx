import { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ResolvedDay, ResolvedExercise, ResolvedFinisher, SetLog } from '../data/workoutPlan';
import { getDayLogs, getPreviousLogs, setLog, PreviousLog } from '../data/logs';
import { ExerciseFormSheet, FormDetail } from './ExerciseFormSheet';
import { theme } from '../theme';

function loadLabel(ex: ResolvedExercise): string {
  if (ex.loadLbs == null || ex.loadLbs === 0) {
    return ex.equipment.toLowerCase().includes('bodyweight') ? 'Bodyweight' : 'Log it';
  }
  return `${ex.loadLbs} lb`;
}

function prescribed(ex: ResolvedExercise): string {
  const base = `${ex.sets} × ${ex.reps}`;
  return ex.rir ? `${base} · RIR ${ex.rir}` : base;
}

function allExercises(day: ResolvedDay): ResolvedExercise[] {
  return [
    ...day.main,
    ...(day.forearmFinisher?.exercises ?? []),
    ...(day.coreFinisher?.exercises ?? []),
  ];
}

export function DayDetail({ day }: { day: ResolvedDay }) {
  const blockColor = theme.blockColors[day.block.id] ?? theme.kindColors.training;
  const [logs, setLogs] = useState<Record<string, SetLog>>({});
  const [previous, setPrevious] = useState<Record<string, PreviousLog>>({});
  const [formDetail, setFormDetail] = useState<FormDetail | null>(null);

  // Load saved logs and seed each row's defaults (prescribed weight) once per day.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const exercises = allExercises(day);
      const saved = await getDayLogs(day.globalIndex, exercises.map((e) => e.id));
      if (cancelled) return;
      const seeded: Record<string, SetLog> = {};
      for (const ex of exercises) {
        const s = saved[ex.id];
        seeded[ex.id] = {
          weightLbs: s?.weightLbs ?? (ex.loadLbs != null && ex.loadLbs > 0 ? String(ex.loadLbs) : ''),
          reps: s?.reps ?? '',
          rir: s?.rir ?? '',
        };
      }
      setLogs(seeded);
    })();
    return () => {
      cancelled = true;
    };
  }, [day.globalIndex]);

  useEffect(() => {
    let cancelled = false;
    getPreviousLogs(day, allExercises(day).map((e) => e.id)).then((p) => {
      if (!cancelled) setPrevious(p);
    });
    return () => {
      cancelled = true;
    };
  }, [day.globalIndex]);

  const updateLog = useCallback(
    (id: string, patch: Partial<SetLog>) => {
      setLogs((prev) => {
        const next = { ...(prev[id] ?? { weightLbs: '', reps: '', rir: '' }), ...patch };
        setLog(day.globalIndex, id, next);
        return { ...prev, [id]: next };
      });
    },
    [day.globalIndex],
  );

  const openForm = useCallback((ex: ResolvedExercise) => {
    setFormDetail({ name: ex.name, equipment: ex.equipment, form: ex.form });
  }, []);

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.dayHeading}>
          Week {day.week} · Day {day.dayInWeek}
        </Text>
        <Text style={styles.title}>{day.title}</Text>
        <View style={styles.badgeRow}>
          <View style={[styles.badge, { backgroundColor: blockColor + '22', borderColor: blockColor }]}>
            <Text style={[styles.badgeText, { color: blockColor }]}>{day.block.name}</Text>
          </View>
          {day.isDeload && (
            <View style={[styles.badge, { backgroundColor: theme.deloadBg, borderColor: theme.deloadAccent }]}>
              <Text style={[styles.badgeText, { color: theme.deloadAccent }]}>DELOAD</Text>
            </View>
          )}
          {day.targetMin != null && (
            <View style={styles.durationPill}>
              <Ionicons name="time-outline" size={12} color={theme.textMuted} />
              <Text style={styles.durationText}>{day.targetMin} min</Text>
            </View>
          )}
        </View>
      </View>

      {!!day.coachingNote && (
        <View style={styles.noteCard}>
          <Ionicons name="bulb-outline" size={16} color={theme.textMuted} />
          <Text style={styles.noteText}>{day.coachingNote}</Text>
        </View>
      )}

      <Section title="Main workout">
        {day.main.map((ex, i) => (
          <ExerciseRow
            key={i}
            ex={ex}
            showRir
            log={logs[ex.id]}
            prev={previous[ex.id]}
            onChangeLog={(patch) => updateLog(ex.id, patch)}
            onOpenForm={() => openForm(ex)}
          />
        ))}
      </Section>

      {day.cardio && (
        <Section title="Cardio" tint={theme.cardioBg} accent={theme.cardioAccent}>
          <View style={styles.cardioRow}>
            <Ionicons name="walk-outline" size={18} color={theme.cardioAccent} />
            <View style={{ flex: 1 }}>
              <Text style={styles.exerciseName}>{day.cardio.name}</Text>
              <Text style={styles.tipText}>{day.cardio.detail}</Text>
            </View>
            <View style={[styles.durationPill, { backgroundColor: theme.surfaceAlt }]}>
              <Text style={styles.durationText}>{day.cardio.durationMin} min</Text>
            </View>
          </View>
        </Section>
      )}

      <FinisherSection
        finisher={day.forearmFinisher}
        tint={theme.forearmBg}
        accent={theme.forearmAccent}
        logs={logs}
        previous={previous}
        onChangeLog={updateLog}
        onOpenForm={openForm}
      />
      <FinisherSection
        finisher={day.coreFinisher}
        tint={theme.coreBg}
        accent={theme.coreAccent}
        logs={logs}
        previous={previous}
        onChangeLog={updateLog}
        onOpenForm={openForm}
      />

      <ExerciseFormSheet detail={formDetail} onClose={() => setFormDetail(null)} />
    </View>
  );
}

function FinisherSection({
  finisher,
  tint,
  accent,
  logs,
  previous,
  onChangeLog,
  onOpenForm,
}: {
  finisher?: ResolvedFinisher;
  tint: string;
  accent: string;
  logs: Record<string, SetLog>;
  previous: Record<string, PreviousLog>;
  onChangeLog: (id: string, patch: Partial<SetLog>) => void;
  onOpenForm: (ex: ResolvedExercise) => void;
}) {
  if (!finisher) return null;
  return (
    <Section title={finisher.name} tint={tint} accent={accent}>
      {finisher.exercises.map((ex, i) => (
        <ExerciseRow
          key={i}
          ex={ex}
          accent={accent}
          log={logs[ex.id]}
          prev={previous[ex.id]}
          onChangeLog={(patch) => onChangeLog(ex.id, patch)}
          onOpenForm={() => onOpenForm(ex)}
        />
      ))}
    </Section>
  );
}

function Section({
  title,
  children,
  tint,
  accent,
}: {
  title: string;
  children: React.ReactNode;
  tint?: string;
  accent?: string;
}) {
  return (
    <View style={[styles.section, tint ? { backgroundColor: tint } : null]}>
      <Text style={[styles.sectionTitle, accent ? { color: accent } : null]}>{title}</Text>
      <View>{children}</View>
    </View>
  );
}

function ExerciseRow({
  ex,
  accent,
  showRir,
  log,
  prev,
  onChangeLog,
  onOpenForm,
}: {
  ex: ResolvedExercise;
  accent?: string;
  showRir?: boolean;
  log?: SetLog;
  prev?: PreviousLog;
  onChangeLog: (patch: Partial<SetLog>) => void;
  onOpenForm: () => void;
}) {
  const label = loadLabel(ex);
  const isNumericLoad = ex.loadLbs != null && ex.loadLbs > 0;

  return (
    <View style={styles.exerciseRow}>
      <View style={styles.exerciseTop}>
        <Pressable style={styles.exerciseLeft} onPress={onOpenForm} hitSlop={4}>
          <View style={styles.nameRow}>
            <Text style={styles.exerciseName}>{ex.name}</Text>
            <Ionicons name="information-circle-outline" size={15} color={theme.textDim} />
          </View>
          <View style={styles.metaRow}>
            {!!ex.equipment && (
              <Text style={[styles.exerciseSource, accent ? { color: accent } : null]}>
                {ex.equipment}
              </Text>
            )}
            <Text style={styles.exerciseSets}>{prescribed(ex)}</Text>
          </View>
          {!!ex.note && <Text style={styles.tipText}>{ex.note}</Text>}
          {prev && (
            <Text style={styles.prevText}>
              Last (wk {prev.week}): {prev.weightLbs || '—'} lb × {prev.reps || '—'}
              {showRir ? ` @ RIR ${prev.rir || '—'}` : ''}
            </Text>
          )}
        </Pressable>
        <View
          style={[
            styles.weightPill,
            !isNumericLoad && { backgroundColor: theme.bodyweightPillBg },
          ]}
        >
          <Text
            style={[
              styles.weightPillText,
              !isNumericLoad && { color: theme.bodyweightPillText },
            ]}
          >
            {label}
          </Text>
        </View>
      </View>

      {/* Log what you actually did — defaults to the prescribed weight. */}
      <View style={styles.logRow}>
        <LogField
          value={log?.weightLbs ?? ''}
          onChange={(v) => onChangeLog({ weightLbs: v })}
          placeholder={isNumericLoad ? String(ex.loadLbs) : 'BW'}
          fieldLabel="lbs"
        />
        <Text style={styles.logX}>×</Text>
        <LogField
          value={log?.reps ?? ''}
          onChange={(v) => onChangeLog({ reps: v })}
          placeholder={ex.reps.replace(/[^0-9\-]/g, '') || '—'}
          fieldLabel="reps"
        />
        {showRir && (
          <>
            <Text style={styles.logX}>@</Text>
            <LogField
              value={log?.rir ?? ''}
              onChange={(v) => onChangeLog({ rir: v })}
              placeholder={ex.rir ?? '—'}
              fieldLabel="RIR"
            />
          </>
        )}
      </View>
    </View>
  );
}

function LogField({
  value,
  onChange,
  placeholder,
  fieldLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  fieldLabel: string;
}) {
  return (
    <View style={styles.logField}>
      <TextInput
        style={styles.logInput}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={theme.textDim}
        keyboardType="numbers-and-punctuation"
        returnKeyType="done"
      />
      <Text style={styles.logLabel}>{fieldLabel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: 16 },
  dayHeading: { color: theme.textMuted, fontSize: 13, fontWeight: '600', letterSpacing: 0.5 },
  title: { color: theme.text, fontSize: 26, fontWeight: '700', marginTop: 4 },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, borderWidth: 1 },
  badgeText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.3 },
  durationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: theme.surface,
    borderRadius: 999,
  },
  durationText: { color: theme.textMuted, fontSize: 11, fontWeight: '600' },

  section: { backgroundColor: theme.surface, borderRadius: 14, padding: 14, marginBottom: 12 },
  sectionTitle: {
    color: theme.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 10,
  },

  exerciseRow: {
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.border,
  },
  exerciseTop: { flexDirection: 'row', alignItems: 'flex-start' },
  exerciseLeft: { flex: 1, paddingRight: 10 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  exerciseName: { color: theme.text, fontSize: 15, fontWeight: '600' },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  exerciseSource: { color: theme.textMuted, fontSize: 12 },
  exerciseSets: { color: theme.textDim, fontSize: 12, fontWeight: '500' },
  tipText: { color: theme.textMuted, fontSize: 12, marginTop: 6, lineHeight: 17 },
  prevText: { color: theme.textMuted, fontSize: 12, fontWeight: '600', marginTop: 6 },
  weightPill: {
    backgroundColor: theme.weightPillBg,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 2,
  },
  weightPillText: { color: theme.weightPillText, fontSize: 12, fontWeight: '700' },

  logRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginTop: 10 },
  logField: { alignItems: 'center' },
  logInput: {
    width: 58,
    backgroundColor: theme.surfaceAlt,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.border,
    color: theme.text,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: 7,
  },
  logLabel: { color: theme.textDim, fontSize: 10, fontWeight: '600', marginTop: 3, letterSpacing: 0.5 },
  logX: { color: theme.textDim, fontSize: 14, paddingBottom: 9 },

  cardioRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },

  noteCard: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: theme.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  noteText: { color: theme.textMuted, fontSize: 13, lineHeight: 19, flex: 1 },
});
