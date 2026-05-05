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
import { WORKOUT_PLAN, PHASE_FOR_WEEK } from '../../data/workoutPlan';
import { DayDetail } from '../../components/DayDetail';
import { theme } from '../../theme';

const STORAGE_KEY = 'currentDayIndex';
const TOTAL_DAYS = 42;

export default function CalendarScreen() {
  const [currentDayIndex, setCurrentDayIndex] = useState<number>(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const idx = raw ? parseInt(raw, 10) : 0;
      const safe = isNaN(idx) ? 0 : Math.max(0, Math.min(idx, TOTAL_DAYS));
      setCurrentDayIndex(safe);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 1500);
    return () => clearInterval(interval);
  }, [load]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loading}>
          <ActivityIndicator color={theme.text} />
        </View>
      </SafeAreaView>
    );
  }

  if (selected !== null) {
    const weekIdx = Math.floor(selected / 7);
    const dayInWeek = selected % 7;
    const day = WORKOUT_PLAN[weekIdx][dayInWeek];
    const status =
      selected < currentDayIndex
        ? 'Completed'
        : selected === currentDayIndex
          ? 'Current'
          : 'Upcoming';
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.detailHeader}>
          <Pressable onPress={() => setSelected(null)} style={styles.backButton} hitSlop={12}>
            <Ionicons name="chevron-back" size={20} color={theme.text} />
            <Text style={styles.backText}>Calendar</Text>
          </Pressable>
          <View style={[styles.statusPill, statusStyle(status)]}>
            <Text style={[styles.statusText, statusTextStyle(status)]}>{status}</Text>
          </View>
        </View>
        <ScrollView contentContainerStyle={styles.scroll}>
          <DayDetail day={day} weekIdx={weekIdx} dayInWeek={dayInWeek} />
          <View style={{ height: 32 }} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.heading}>Calendar</Text>
        <Text style={styles.subheading}>Full 6-week program · {TOTAL_DAYS} days</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {WORKOUT_PLAN.map((week, wIdx) => {
          const phase = PHASE_FOR_WEEK(wIdx);
          return (
            <View key={wIdx} style={styles.weekBlock}>
              <View style={styles.weekHeader}>
                <Text style={styles.weekTitle}>Week {wIdx + 1}</Text>
                <View
                  style={[
                    styles.phaseBadge,
                    {
                      backgroundColor: theme.phaseColors[phase] + '22',
                      borderColor: theme.phaseColors[phase],
                    },
                  ]}
                >
                  <Text style={[styles.phaseBadgeText, { color: theme.phaseColors[phase] }]}>
                    {phase}
                  </Text>
                </View>
              </View>
              {week.map((day, dIdx) => {
                const globalIdx = wIdx * 7 + dIdx;
                const isCompleted = globalIdx < currentDayIndex;
                const isCurrent = globalIdx === currentDayIndex;
                return (
                  <Pressable
                    key={dIdx}
                    onPress={() => setSelected(globalIdx)}
                    style={[
                      styles.dayRow,
                      isCurrent && {
                        borderColor: theme.text,
                        borderWidth: 1.5,
                      },
                    ]}
                  >
                    <View style={styles.dayLeft}>
                      <View
                        style={[
                          styles.dayNumberCircle,
                          isCompleted && { backgroundColor: theme.weightPillBg },
                          isCurrent && { backgroundColor: theme.text },
                        ]}
                      >
                        {isCompleted ? (
                          <Ionicons
                            name="checkmark"
                            size={14}
                            color={theme.weightPillText}
                          />
                        ) : (
                          <Text
                            style={[
                              styles.dayNumberText,
                              isCurrent && { color: theme.bg },
                            ]}
                          >
                            {dIdx + 1}
                          </Text>
                        )}
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={[
                            styles.dayTitle,
                            isCompleted && { color: theme.textMuted },
                          ]}
                        >
                          {day.title}
                        </Text>
                        <View style={styles.dayMeta}>
                          <View
                            style={[
                              styles.typeDot,
                              { backgroundColor: theme.typeColors[day.type] },
                            ]}
                          />
                          <Text style={styles.dayMetaText}>
                            {day.type.toUpperCase()}
                            {day.duration !== '—' ? ` · ${day.duration}` : ''}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color={theme.textDim} />
                  </Pressable>
                );
              })}
            </View>
          );
        })}
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function statusStyle(s: string) {
  if (s === 'Completed')
    return { backgroundColor: theme.weightPillBg, borderColor: theme.weightPillText };
  if (s === 'Current') return { backgroundColor: theme.text, borderColor: theme.text };
  return { backgroundColor: theme.surfaceAlt, borderColor: theme.border };
}
function statusTextStyle(s: string) {
  if (s === 'Completed') return { color: theme.weightPillText };
  if (s === 'Current') return { color: theme.bg };
  return { color: theme.textMuted };
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 },
  heading: { color: theme.text, fontSize: 32, fontWeight: '700' },
  subheading: { color: theme.textMuted, fontSize: 14, marginTop: 2 },

  scroll: { paddingHorizontal: 16, paddingTop: 4 },

  weekBlock: { marginBottom: 18 },
  weekHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  weekTitle: { color: theme.text, fontSize: 18, fontWeight: '700' },
  phaseBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1,
  },
  phaseBadgeText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },

  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  dayLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  dayNumberCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayNumberText: { color: theme.text, fontSize: 13, fontWeight: '700' },
  dayTitle: { color: theme.text, fontSize: 15, fontWeight: '600' },
  dayMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 },
  typeDot: { width: 6, height: 6, borderRadius: 3 },
  dayMetaText: { color: theme.textDim, fontSize: 11, fontWeight: '600', letterSpacing: 0.5 },

  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  backText: { color: theme.text, fontSize: 16, fontWeight: '600' },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  statusText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
});
