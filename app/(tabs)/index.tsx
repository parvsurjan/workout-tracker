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
import { resolvedDays, TOTAL_DAYS, TOTAL_WEEKS } from '../../data/workoutPlan';
import { DayDetail } from '../../components/DayDetail';
import { CheckinCard } from '../../components/CheckinCard';
import { theme } from '../../theme';

const STORAGE_KEY = 'currentDayIndex_v3';

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

  const unmarkPrevious = useCallback(async () => {
    const prev = Math.max(currentDayIndex - 1, 0);
    setCurrentDayIndex(prev);
    setViewIndex(prev);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, String(prev));
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
    return <Congrats onReset={resetProgram} onUnmarkPrevious={unmarkPrevious} />;
  }

  const day = resolvedDays[viewIndex];
  const isReviewing = viewIndex < currentDayIndex;
  const isCheckin = day.kind === 'checkin';
  const canGoBack = viewIndex > 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
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
              style={[styles.progressBarFill, { width: `${(currentDayIndex / TOTAL_DAYS) * 100}%` }]}
            />
          </View>
        </View>

        {isCheckin ? <CheckinCard day={day} /> : <DayDetail day={day} />}

        {isReviewing && (
          <View style={styles.reviewBanner}>
            <Ionicons name="eye-outline" size={14} color={theme.textMuted} />
            <Text style={styles.reviewText}>Reviewing an earlier day</Text>
          </View>
        )}

        <View style={{ height: 140 }} />
      </ScrollView>

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
          <Pressable onPress={() => setViewIndex(currentDayIndex)} style={styles.completeButton}>
            <Text style={styles.completeButtonText}>Back to current day</Text>
          </Pressable>
        ) : (
          <>
            <Pressable onPress={markComplete} style={styles.completeButton}>
              <Text style={styles.completeButtonText}>
                {isCheckin ? 'Mark check-in done' : 'Mark workout complete'}
              </Text>
            </Pressable>
            {currentDayIndex > 0 && (
              <Pressable onPress={unmarkPrevious} style={styles.undoButton}>
                <Text style={styles.undoButtonText}>Unmark previous day as done</Text>
              </Pressable>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

function Congrats({
  onReset,
  onUnmarkPrevious,
}: {
  onReset: () => void;
  onUnmarkPrevious: () => void;
}) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.congrats}>
        <Text style={styles.congratsEmoji}>🏆</Text>
        <Text style={styles.congratsTitle}>{TOTAL_WEEKS} weeks complete</Text>
        <Text style={styles.congratsBody}>
          You finished all {TOTAL_DAYS} days of the program. Bigger, stronger, and you've got the
          logbook to prove it. Set your next goal and keep going.
        </Text>
        <Pressable onPress={onReset} style={styles.resetButton}>
          <Text style={styles.completeButtonText}>Restart program</Text>
        </Pressable>
        <Pressable onPress={onUnmarkPrevious} style={styles.undoButton}>
          <Text style={styles.undoButtonText}>Unmark previous day as done</Text>
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
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressLabel: { color: theme.textMuted, fontSize: 12, fontWeight: '600', letterSpacing: 0.5 },
  progressPercent: { color: theme.textMuted, fontSize: 12, fontWeight: '600' },
  progressBarBg: { height: 4, backgroundColor: theme.surface, borderRadius: 2, overflow: 'hidden' },
  progressBarFill: { height: 4, backgroundColor: theme.text, borderRadius: 2 },

  reviewBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
    padding: 8,
    backgroundColor: theme.surfaceAlt,
    borderRadius: 8,
  },
  reviewText: { color: theme.textMuted, fontSize: 12 },

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
  prevButton: { alignSelf: 'center', paddingVertical: 6, marginBottom: 8 },
  prevButtonText: { color: theme.textMuted, fontSize: 13, fontWeight: '600' },
  undoButton: { alignSelf: 'center', paddingVertical: 10 },
  undoButtonText: { color: theme.textMuted, fontSize: 13, fontWeight: '600' },
  completeButton: {
    backgroundColor: theme.text,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  completeButtonText: { color: theme.bg, fontSize: 16, fontWeight: '700' },

  congrats: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
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
