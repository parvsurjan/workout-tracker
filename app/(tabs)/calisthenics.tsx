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
import { TRACKS, TrackKey, CalisthenicsStep, MAX_TIMELINE_MONTHS } from '../../data/calisthenics';
import { theme } from '../../theme';

const STORAGE_KEY = 'calisthenicsProgress';

type Progress = Record<TrackKey, number>;
const DEFAULT_PROGRESS: Progress = { push: 0, pull: 0, core: 0, skill: 0 };

export default function CalisthenicsScreen() {
  const [progress, setProgress] = useState<Progress>(DEFAULT_PROGRESS);
  const [activeTrack, setActiveTrack] = useState<TrackKey>('push');
  const [expanded, setExpanded] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          setProgress({ ...DEFAULT_PROGRESS, ...parsed });
        }
      } catch {}
      setLoading(false);
    })();
  }, []);

  const persist = useCallback(async (next: Progress) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  }, []);

  const markMastered = useCallback(
    (trackKey: TrackKey) => {
      const track = TRACKS.find((t) => t.key === trackKey)!;
      const cur = progress[trackKey];
      const next: Progress = {
        ...progress,
        [trackKey]: Math.min(cur + 1, track.steps.length),
      };
      setProgress(next);
      persist(next);
      setExpanded(null);
    },
    [progress, persist],
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loading}>
          <ActivityIndicator color={theme.text} />
        </View>
      </SafeAreaView>
    );
  }

  const track = TRACKS.find((t) => t.key === activeTrack)!;
  const activeIdx = progress[activeTrack];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.heading}>Calisthenics</Text>
        <Text style={styles.subheading}>4 progression tracks</Text>
      </View>

      {/* Track tabs */}
      <View style={styles.trackTabs}>
        {TRACKS.map((t) => {
          const isActive = t.key === activeTrack;
          return (
            <Pressable
              key={t.key}
              onPress={() => {
                setActiveTrack(t.key);
                setExpanded(null);
              }}
              style={[
                styles.trackTab,
                isActive && { backgroundColor: t.color + '22', borderColor: t.color },
              ]}
            >
              <Text style={[styles.trackTabText, isActive && { color: t.color }]}>
                {t.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {track.steps.map((step, idx) => {
          const isCompleted = idx < activeIdx;
          const isActiveStep = idx === activeIdx;
          const isLocked = idx > activeIdx;
          const isExpanded = expanded === idx;

          return (
            <StepCard
              key={step.number}
              step={step}
              color={track.color}
              state={isCompleted ? 'completed' : isActiveStep ? 'active' : 'locked'}
              expanded={isExpanded}
              onToggle={() => {
                if (isLocked) return;
                setExpanded(isExpanded ? null : idx);
              }}
              onMaster={() => markMastered(track.key)}
            />
          );
        })}
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function StepCard({
  step,
  color,
  state,
  expanded,
  onToggle,
  onMaster,
}: {
  step: CalisthenicsStep;
  color: string;
  state: 'completed' | 'active' | 'locked';
  expanded: boolean;
  onToggle: () => void;
  onMaster: () => void;
}) {
  const isLocked = state === 'locked';
  const isCompleted = state === 'completed';
  const isActive = state === 'active';

  return (
    <Pressable
      onPress={onToggle}
      style={[
        styles.card,
        isActive && { borderColor: color, borderWidth: 1.5 },
        isLocked && { opacity: 0.5 },
      ]}
    >
      <View style={styles.cardHeader}>
        <View style={styles.stepBadge}>
          {isCompleted ? (
            <Ionicons name="checkmark-circle" size={22} color={color} />
          ) : isLocked ? (
            <Ionicons name="lock-closed" size={18} color={theme.textDim} />
          ) : (
            <View style={[styles.stepNumberCircle, { borderColor: color }]}>
              <Text style={[styles.stepNumberText, { color }]}>{step.number}</Text>
            </View>
          )}
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={[
              styles.stepName,
              isCompleted && { color: theme.textMuted, textDecorationLine: 'line-through' },
            ]}
          >
            {step.name}
          </Text>
          <Text style={styles.stepDifficulty}>{step.difficulty}</Text>
        </View>
        {!isLocked && (
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={18}
            color={theme.textDim}
          />
        )}
      </View>

      {expanded && !isLocked && (
        <View style={styles.expandedBody}>
          {/* Unlock criteria */}
          <View style={[styles.criteriaBox, { borderLeftColor: color }]}>
            <Text style={styles.criteriaLabel}>MOVE ON WHEN YOU CAN</Text>
            <Text style={styles.criteriaText}>{step.unlock}</Text>
          </View>

          {/* Sets */}
          <View style={styles.pillRow}>
            <View style={[styles.setsPill, { backgroundColor: color + '22' }]}>
              <Text style={[styles.setsPillText, { color }]}>{step.sets}</Text>
            </View>
          </View>

          {/* Timeline */}
          <View style={styles.timelineSection}>
            <Text style={styles.subsectionLabel}>ESTIMATED TIME AT THIS STEP</Text>
            <TimelineBar
              label={step.timeline2x.label}
              value={step.timeline2x.value}
              months={step.timeline2x.months}
              color={color}
            />
            <TimelineBar
              label={step.timeline3x.label}
              value={step.timeline3x.value}
              months={step.timeline3x.months}
              color={color}
            />
          </View>

          {/* Coaching note (italic small) */}
          {!!step.note && (
            <View style={styles.noteBox}>
              <Ionicons name="bulb-outline" size={14} color={theme.textMuted} />
              <Text style={styles.noteBoxText}>{step.note}</Text>
            </View>
          )}

          {/* Tips */}
          <View style={styles.tipsSection}>
            <Text style={styles.subsectionLabel}>COACHING NOTES</Text>
            {step.tips.map((tip, i) => (
              <View key={i} style={styles.tipRow}>
                <Text style={[styles.tipBullet, { color }]}>•</Text>
                <Text style={styles.tipBody}>{tip}</Text>
              </View>
            ))}
          </View>

          {/* Next progression */}
          <View style={styles.nextBox}>
            <Text style={styles.nextLabel}>NEXT PROGRESSION</Text>
            <Text style={styles.nextValue}>{step.next}</Text>
          </View>

          {isActive && (
            <Pressable
              onPress={onMaster}
              style={[styles.masterButton, { backgroundColor: color }]}
            >
              <Text style={styles.masterButtonText}>Mark as mastered</Text>
            </Pressable>
          )}

          {isCompleted && (
            <View style={styles.completedTag}>
              <Ionicons name="checkmark-circle" size={14} color={color} />
              <Text style={[styles.completedTagText, { color }]}>Mastered</Text>
            </View>
          )}
        </View>
      )}
    </Pressable>
  );
}

function TimelineBar({
  label,
  value,
  months,
  color,
}: {
  label: string;
  value: string;
  months: number;
  color: string;
}) {
  const pct = Math.max(0.04, Math.min(1, months / MAX_TIMELINE_MONTHS));
  return (
    <View style={styles.timelineRow}>
      <Text style={styles.timelineLabel}>{label}</Text>
      <View style={styles.timelineBarWrap}>
        <View style={styles.timelineBarBg}>
          <View
            style={[styles.timelineBarFill, { width: `${pct * 100}%`, backgroundColor: color }]}
          />
        </View>
      </View>
      <Text style={styles.timelineValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 },
  heading: { color: theme.text, fontSize: 32, fontWeight: '700' },
  subheading: { color: theme.textMuted, fontSize: 14, marginTop: 2 },

  trackTabs: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  trackTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  trackTabText: { color: theme.textMuted, fontSize: 13, fontWeight: '700' },

  scroll: { paddingHorizontal: 16 },

  card: {
    backgroundColor: theme.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stepBadge: { width: 28, alignItems: 'center' },
  stepNumberCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: { fontSize: 12, fontWeight: '700' },
  stepName: { color: theme.text, fontSize: 15, fontWeight: '600' },
  stepDifficulty: { color: theme.textDim, fontSize: 12, marginTop: 2 },

  expandedBody: { marginTop: 14, gap: 14 },
  criteriaBox: {
    backgroundColor: theme.surfaceAlt,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
  },
  criteriaLabel: {
    color: theme.textDim,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  criteriaText: { color: theme.text, fontSize: 14, fontWeight: '500', lineHeight: 19 },

  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  setsPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  setsPillText: { fontSize: 12, fontWeight: '700' },

  timelineSection: { gap: 8 },
  subsectionLabel: {
    color: theme.textDim,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  timelineLabel: { color: theme.textMuted, fontSize: 11, fontWeight: '600', width: 64 },
  timelineBarWrap: { flex: 1 },
  timelineBarBg: {
    height: 6,
    backgroundColor: theme.surfaceAlt,
    borderRadius: 3,
    overflow: 'hidden',
  },
  timelineBarFill: { height: 6, borderRadius: 3 },
  timelineValue: {
    color: theme.text,
    fontSize: 11,
    fontWeight: '600',
    width: 78,
    textAlign: 'right',
  },

  noteBox: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: theme.surfaceAlt,
    padding: 10,
    borderRadius: 8,
    alignItems: 'flex-start',
  },
  noteBoxText: { color: theme.textMuted, fontSize: 12, lineHeight: 17, flex: 1, fontStyle: 'italic' },

  tipsSection: { gap: 6 },
  tipRow: { flexDirection: 'row', gap: 8 },
  tipBullet: { fontSize: 14, lineHeight: 18 },
  tipBody: { color: theme.text, fontSize: 13, lineHeight: 18, flex: 1 },

  nextBox: {
    backgroundColor: theme.surfaceAlt,
    padding: 10,
    borderRadius: 8,
  },
  nextLabel: {
    color: theme.textDim,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  nextValue: { color: theme.text, fontSize: 13, fontWeight: '500' },

  masterButton: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  masterButtonText: { color: '#0d0d0d', fontSize: 15, fontWeight: '700' },

  completedTag: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  completedTagText: { fontSize: 12, fontWeight: '700' },
});
