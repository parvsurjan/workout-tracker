import { useEffect, useState, useCallback, useMemo } from 'react';
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
import { useNavigation } from 'expo-router';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { resolvedDays, TOTAL_DAYS, TOTAL_WEEKS, ResolvedDay } from '../../data/workoutPlan';
import { DayDetail } from '../../components/DayDetail';
import { CheckinCard } from '../../components/CheckinCard';
import { theme } from '../../theme';

const STORAGE_KEY = 'currentDayIndex_v3';

type Week = { week: number; block: ResolvedDay['block']; isDeload: boolean; days: ResolvedDay[] };

function groupByWeek(): Week[] {
  const weeks: Week[] = [];
  for (const d of resolvedDays) {
    let w = weeks[weeks.length - 1];
    if (!w || w.week !== d.week) {
      w = { week: d.week, block: d.block, isDeload: d.isDeload, days: [] };
      weeks.push(w);
    }
    w.days.push(d);
  }
  return weeks;
}

export default function CalendarScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<Record<string, undefined>>>();
  const [currentDayIndex, setCurrentDayIndex] = useState<number>(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const weeks = useMemo(groupByWeek, []);

  // Tapping the Calendar tab while a day is open returns to the calendar grid.
  useEffect(() => {
    const unsub = navigation.addListener('tabPress', () => setSelected(null));
    return unsub;
  }, [navigation]);

  const unmarkAsDone = useCallback(async (globalIndex: number) => {
    setCurrentDayIndex(globalIndex);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, String(globalIndex));
    } catch {}
  }, []);

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
    const day = resolvedDays[selected];
    const status =
      selected < currentDayIndex ? 'Completed' : selected === currentDayIndex ? 'Current' : 'Upcoming';
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
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {day.kind === 'checkin' ? <CheckinCard day={day} /> : <DayDetail day={day} />}
          {status === 'Completed' && (
            <Pressable
              onPress={() => unmarkAsDone(day.globalIndex)}
              style={styles.unmarkButton}
            >
              <Text style={styles.unmarkButtonText}>Unmark as done</Text>
            </Pressable>
          )}
          <View style={{ height: 32 }} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.heading}>Calendar</Text>
        <Text style={styles.subheading}>
          {TOTAL_WEEKS}-week program · {TOTAL_DAYS} days
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {weeks.map((w) => {
          const blockColor = theme.blockColors[w.block.id] ?? theme.kindColors.training;
          return (
            <View key={w.week} style={styles.weekBlock}>
              <View style={styles.weekHeader}>
                <Text style={styles.weekTitle}>Week {w.week}</Text>
                <View style={[styles.phaseBadge, { backgroundColor: blockColor + '22', borderColor: blockColor }]}>
                  <Text style={[styles.phaseBadgeText, { color: blockColor }]}>{w.block.name}</Text>
                </View>
                {w.isDeload && (
                  <View style={[styles.phaseBadge, { backgroundColor: theme.deloadBg, borderColor: theme.deloadAccent }]}>
                    <Text style={[styles.phaseBadgeText, { color: theme.deloadAccent }]}>DELOAD</Text>
                  </View>
                )}
              </View>
              {w.days.map((day) => {
                const isCompleted = day.globalIndex < currentDayIndex;
                const isCurrent = day.globalIndex === currentDayIndex;
                const dotColor = theme.kindColors[day.cardio ? 'cardio' : day.kind] ?? theme.kindColors.training;
                const meta =
                  day.kind === 'checkin'
                    ? 'CHECK-IN'
                    : `${day.cardio ? 'CARDIO · ' : ''}${day.targetMin != null ? `${day.targetMin} MIN` : 'TRAINING'}`;
                return (
                  <Pressable
                    key={day.globalIndex}
                    onPress={() => setSelected(day.globalIndex)}
                    style={[styles.dayRow, isCurrent && { borderColor: theme.text, borderWidth: 1.5 }]}
                  >
                    <View style={styles.dayLeft}>
                      <View
                        style={[
                          styles.dayNumberCircle,
                          day.kind === 'checkin' && { backgroundColor: theme.checkinBg },
                          isCompleted && { backgroundColor: theme.weightPillBg },
                          isCurrent && { backgroundColor: theme.text },
                        ]}
                      >
                        {isCompleted ? (
                          <Ionicons name="checkmark" size={14} color={theme.weightPillText} />
                        ) : day.kind === 'checkin' ? (
                          <Ionicons name="clipboard-outline" size={13} color={theme.checkinAccent} />
                        ) : (
                          <Text style={[styles.dayNumberText, isCurrent && { color: theme.bg }]}>
                            {day.dayInWeek}
                          </Text>
                        )}
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.dayTitle, isCompleted && { color: theme.textMuted }]}>
                          {day.title}
                        </Text>
                        <View style={styles.dayMeta}>
                          <View style={[styles.typeDot, { backgroundColor: dotColor }]} />
                          <Text style={styles.dayMetaText}>{meta}</Text>
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
  if (s === 'Completed') return { backgroundColor: theme.weightPillBg, borderColor: theme.weightPillText };
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
  weekHeader: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  weekTitle: { color: theme.text, fontSize: 18, fontWeight: '700' },
  phaseBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999, borderWidth: 1 },
  phaseBadgeText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.3 },

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

  unmarkButton: {
    marginTop: 16,
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.border,
  },
  unmarkButtonText: { color: theme.textMuted, fontSize: 14, fontWeight: '600' },

  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  backText: { color: theme.text, fontSize: 16, fontWeight: '600' },
  statusPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, borderWidth: 1 },
  statusText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
});
