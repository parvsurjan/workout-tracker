import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DayPlan, ExerciseType, PHASE_FOR_WEEK } from '../data/workoutPlan';
import { theme } from '../theme';

export function DayDetail({ day, weekIdx, dayInWeek }: { day: DayPlan; weekIdx: number; dayInWeek: number }) {
  const phase = PHASE_FOR_WEEK(weekIdx);

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.dayHeading}>
          Week {weekIdx + 1} · Day {dayInWeek + 1}
        </Text>
        <Text style={styles.title}>{day.title}</Text>
        <View style={styles.badgeRow}>
          <View
            style={[
              styles.badge,
              {
                backgroundColor: theme.phaseColors[phase] + '22',
                borderColor: theme.phaseColors[phase],
              },
            ]}
          >
            <Text style={[styles.badgeText, { color: theme.phaseColors[phase] }]}>{phase}</Text>
          </View>
          <View
            style={[
              styles.badge,
              {
                backgroundColor: theme.typeColors[day.type] + '22',
                borderColor: theme.typeColors[day.type],
              },
            ]}
          >
            <Text style={[styles.badgeText, { color: theme.typeColors[day.type] }]}>
              {day.type.toUpperCase()}
            </Text>
          </View>
          {day.duration !== '—' && (
            <View style={styles.durationPill}>
              <Ionicons name="time-outline" size={12} color={theme.textMuted} />
              <Text style={styles.durationText}>{day.duration}</Text>
            </View>
          )}
        </View>
      </View>

      <Section title="Main workout">
        {day.exercises.map((ex, i) => (
          <ExerciseRow key={i} ex={ex} />
        ))}
      </Section>

      {day.forearmFinisher.length > 0 && (
        <Section title="Forearm finisher" tint={theme.forearmBg} accent={theme.forearmAccent}>
          {day.forearmFinisher.map((ex, i) => (
            <ExerciseRow key={i} ex={ex} accent={theme.forearmAccent} />
          ))}
        </Section>
      )}

      {day.pronationDrill && (
        <Section title="Pronation drill" tint={theme.pronationBg} accent={theme.pronationAccent}>
          <View style={styles.exerciseRow}>
            <View style={styles.exerciseLeft}>
              <Text style={styles.exerciseName}>{day.pronationDrill.name}</Text>
              <Text style={[styles.exerciseSource, { color: theme.pronationAccent }]}>
                {day.pronationDrill.sets}
              </Text>
              <Text style={styles.tipText}>{day.pronationDrill.tip}</Text>
            </View>
            <View style={styles.weightPill}>
              <Text style={styles.weightPillText}>{day.pronationDrill.weight}</Text>
            </View>
          </View>
        </Section>
      )}

      {day.coreFinisher.length > 0 && (
        <Section title="Core finisher — 10–12 min" tint={theme.coreBg} accent={theme.coreAccent}>
          {day.coreFinisher.map((ex, i) => (
            <ExerciseRow key={i} ex={ex} accent={theme.coreAccent} />
          ))}
        </Section>
      )}

      <View style={styles.noteCard}>
        <Ionicons name="bulb-outline" size={16} color={theme.textMuted} />
        <Text style={styles.noteText}>{day.note}</Text>
      </View>
    </View>
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

function ExerciseRow({ ex, accent }: { ex: ExerciseType; accent?: string }) {
  return (
    <View style={styles.exerciseRow}>
      <View style={styles.exerciseLeft}>
        <Text style={styles.exerciseName}>{ex.name}</Text>
        <View style={styles.metaRow}>
          {!!ex.source && (
            <Text style={[styles.exerciseSource, accent ? { color: accent } : null]}>
              {ex.source}
            </Text>
          )}
          <Text style={styles.exerciseSets}>{ex.sets}</Text>
        </View>
      </View>
      {ex.weight && ex.weight !== '—' ? (
        <View style={styles.weightPill}>
          <Text style={styles.weightPillText}>{ex.weight}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: 20 },
  dayHeading: { color: theme.textMuted, fontSize: 13, fontWeight: '600', letterSpacing: 0.5 },
  title: { color: theme.text, fontSize: 28, fontWeight: '700', marginTop: 4 },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, borderWidth: 1 },
  badgeText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
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
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.border,
  },
  exerciseLeft: { flex: 1, paddingRight: 10 },
  exerciseName: { color: theme.text, fontSize: 15, fontWeight: '600' },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  exerciseSource: { color: theme.textMuted, fontSize: 12 },
  exerciseSets: { color: theme.textDim, fontSize: 12, fontWeight: '500' },
  tipText: { color: theme.textMuted, fontSize: 12, marginTop: 6, lineHeight: 17 },
  weightPill: {
    backgroundColor: theme.weightPillBg,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 2,
  },
  weightPillText: { color: theme.weightPillText, fontSize: 12, fontWeight: '700' },
  noteCard: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: theme.surface,
    borderRadius: 12,
    padding: 14,
    alignItems: 'flex-start',
  },
  noteText: { color: theme.textMuted, fontSize: 13, lineHeight: 19, flex: 1 },
});
