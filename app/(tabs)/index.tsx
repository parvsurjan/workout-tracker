import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { WORKOUT_PLAN, PHASE_FOR_WEEK, DayPlan, ExerciseType } from '../../data/workoutPlan';
import { theme } from '../../theme';

const STORAGE_KEY = 'currentDayIndex';
const TOTAL_DAYS = 42;

export default function WorkoutScreen() {
  const [currentDayIndex, setCurrentDayIndex] = useState<number>(0);
  const [viewIndex, setViewIndex] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        const idx = raw ? parseInt(raw, 10) : 0;
        const safe = isNaN(idx) ? 0 : Math.max(0, Math.min(idx, TOTAL_DAYS));
        setCurrentDayIndex(safe);
        setViewIndex(Math.min(safe, TOTAL_DAYS - 1));
      } catch {}
      setLoading(false);
    })();
  }, []);

  const markComplete = useCallback(async () => {
    const next = Math.min(currentDayIndex + 1, TOTAL_DAYS);
    setCurrentDayIndex(next);
    setViewIndex(Math.min(next, TOTAL_DAYS - 1));
    try {
      await AsyncStorage.setItem(STORAGE_KEY, String(next));
    } catch {}
  }, [currentDayIndex]);

  const resetProgram = useCallback(async () => {
    setCurrentDayIndex(0);
    setViewIndex(0);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, '0');
    } catch {}
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loading}>
          <ActivityIndicator color={theme.text} />
        </View>
      </SafeAreaView>
    );
  }

  if (currentDayIndex >= TOTAL_DAYS) {
    return <Congrats onReset={resetProgram} />;
  }

  const weekIdx = Math.floor(viewIndex / 7);
  const dayInWeek = viewIndex % 7;
  const day = WORKOUT_PLAN[weekIdx][dayInWeek];
  const phase = PHASE_FOR_WEEK(weekIdx);
  const isReviewing = viewIndex < currentDayIndex;
  const canGoBack = viewIndex > 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Progress */}
        <View style={styles.progressWrap}>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>
              Day {Math.min(currentDayIndex + 1, TOTAL_DAYS)} of {TOTAL_DAYS}
            </Text>
            <Text style={styles.progressPercent}>
              {Math.round((currentDayIndex / TOTAL_DAYS) * 100)}%
            </Text>
          </View>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${(currentDayIndex / TOTAL_DAYS) * 100}%` },
              ]}
            />
          </View>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.dayHeading}>
            Week {weekIdx + 1} · Day {dayInWeek + 1}
          </Text>
          <Text style={styles.title}>{day.title}</Text>
          <View style={styles.badgeRow}>
            <View style={[styles.badge, { backgroundColor: theme.phaseColors[phase] + '22', borderColor: theme.phaseColors[phase] }]}>
              <Text style={[styles.badgeText, { color: theme.phaseColors[phase] }]}>{phase}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: theme.typeColors[day.type] + '22', borderColor: theme.typeColors[day.type] }]}>
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
          {isReviewing && (
            <View style={styles.reviewBanner}>
              <Ionicons name="eye-outline" size={14} color={theme.textMuted} />
              <Text style={styles.reviewText}>Reviewing past workout</Text>
            </View>
          )}
        </View>

        {/* Main exercises */}
        <Section title="Main workout">
          {day.exercises.map((ex, i) => (
            <ExerciseRow key={i} ex={ex} />
          ))}
        </Section>

        {/* Forearm finisher */}
        {day.forearmFinisher.length > 0 && (
          <Section
            title="Forearm finisher"
            tint={theme.forearmBg}
            accent={theme.forearmAccent}
          >
            {day.forearmFinisher.map((ex, i) => (
              <ExerciseRow key={i} ex={ex} accent={theme.forearmAccent} />
            ))}
          </Section>
        )}

        {/* Pronation drill */}
        {day.pronationDrill && (
          <Section
            title="Pronation drill"
            tint={theme.pronationBg}
            accent={theme.pronationAccent}
          >
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

        {/* Coaching note */}
        <View style={styles.noteCard}>
          <Ionicons name="bulb-outline" size={16} color={theme.textMuted} />
          <Text style={styles.noteText}>{day.note}</Text>
        </View>

        <View style={{ height: 140 }} />
      </ScrollView>

      {/* Sticky footer */}
      <View style={styles.footer}>
        {canGoBack && (
          <Pressable
            onPress={() => setViewIndex(Math.max(0, viewIndex - 1))}
            style={styles.prevButton}
          >
            <Text style={styles.prevButtonText}>← Previous</Text>
          </Pressable>
        )}
        {isReviewing ? (
          <Pressable
            onPress={() => setViewIndex(currentDayIndex)}
            style={styles.completeButton}
          >
            <Text style={styles.completeButtonText}>Back to current workout</Text>
          </Pressable>
        ) : (
          <Pressable onPress={markComplete} style={styles.completeButton}>
            <Text style={styles.completeButtonText}>Mark workout complete</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
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

function Congrats({ onReset }: { onReset: () => void }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.congrats}>
        <Text style={styles.congratsEmoji}>🏆</Text>
        <Text style={styles.congratsTitle}>6 weeks complete</Text>
        <Text style={styles.congratsBody}>
          You finished all 42 days. Stronger, leaner, more defined. Set your next goal and keep
          going.
        </Text>
        <Pressable onPress={onReset} style={styles.resetButton}>
          <Text style={styles.completeButtonText}>Restart program</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg },
  scroll: { padding: 16, paddingBottom: 32 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  progressWrap: { marginBottom: 16 },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: { color: theme.textMuted, fontSize: 12, fontWeight: '600', letterSpacing: 0.5 },
  progressPercent: { color: theme.textMuted, fontSize: 12, fontWeight: '600' },
  progressBarBg: {
    height: 4,
    backgroundColor: theme.surface,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: { height: 4, backgroundColor: theme.text, borderRadius: 2 },

  header: { marginBottom: 20 },
  dayHeading: { color: theme.textMuted, fontSize: 13, fontWeight: '600', letterSpacing: 0.5 },
  title: { color: theme.text, fontSize: 28, fontWeight: '700', marginTop: 4 },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
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
  reviewBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    padding: 8,
    backgroundColor: theme.surfaceAlt,
    borderRadius: 8,
  },
  reviewText: { color: theme.textMuted, fontSize: 12 },

  section: {
    backgroundColor: theme.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
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

  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    paddingBottom: 28,
    backgroundColor: theme.bg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.border,
  },
  prevButton: {
    alignSelf: 'center',
    paddingVertical: 6,
    marginBottom: 8,
  },
  prevButtonText: { color: theme.textMuted, fontSize: 13, fontWeight: '600' },
  completeButton: {
    backgroundColor: theme.text,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  completeButtonText: { color: theme.bg, fontSize: 16, fontWeight: '700' },

  congrats: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  congratsEmoji: { fontSize: 64, marginBottom: 16 },
  congratsTitle: { color: theme.text, fontSize: 28, fontWeight: '700', marginBottom: 12 },
  congratsBody: {
    color: theme.textMuted,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 24,
  },
  resetButton: {
    backgroundColor: theme.text,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 28,
  },
});
