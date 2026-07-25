import { useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { EXERCISE_LIBRARY, PROGRAM_INFO, LibraryExercise } from '../../data/workoutPlan';
import { ExerciseFormSheet, FormDetail } from '../../components/ExerciseFormSheet';
import { theme } from '../../theme';

function humanize(key: string): string {
  return key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function toDetail(ex: LibraryExercise): FormDetail {
  return {
    name: ex.name,
    equipment: ex.equipment,
    category: ex.category,
    form: {
      setup: ex.setup,
      grip: ex.grip,
      execution: ex.execution,
      cues: ex.cues ?? [],
      commonMistakes: ex.common_mistakes ?? [],
      notes: ex.notes,
    },
  };
}

export default function LibraryScreen() {
  const [tab, setTab] = useState<'exercises' | 'program'>('exercises');
  const [detail, setDetail] = useState<FormDetail | null>(null);

  const grouped = useMemo(() => {
    const map: Record<string, LibraryExercise[]> = {};
    for (const ex of EXERCISE_LIBRARY) {
      (map[ex.category] ??= []).push(ex);
    }
    return Object.entries(map).sort((a, b) => a[0].localeCompare(b[0]));
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.heading}>Library</Text>
        <View style={styles.segment}>
          <SegmentButton label="Exercises" active={tab === 'exercises'} onPress={() => setTab('exercises')} />
          <SegmentButton label="Program" active={tab === 'program'} onPress={() => setTab('program')} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {tab === 'exercises'
          ? grouped.map(([category, list]) => (
              <View key={category} style={styles.group}>
                <Text style={styles.groupTitle}>{humanize(category)}</Text>
                {list.map((ex) => (
                  <Pressable key={ex.id} style={styles.exRow} onPress={() => setDetail(toDetail(ex))}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.exName}>{ex.name}</Text>
                      <Text style={styles.exEquip}>{ex.equipment}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color={theme.textDim} />
                  </Pressable>
                ))}
              </View>
            ))
          : Object.entries(PROGRAM_INFO).map(([section, value]) => (
              <View key={section} style={styles.group}>
                <Text style={styles.groupTitle}>{humanize(section)}</Text>
                <View style={styles.infoCard}>
                  <InfoValue value={value} />
                </View>
              </View>
            ))}
        <View style={{ height: 32 }} />
      </ScrollView>

      <ExerciseFormSheet detail={detail} onClose={() => setDetail(null)} />
    </SafeAreaView>
  );
}

function SegmentButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.segmentBtn, active && styles.segmentBtnActive]}>
      <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{label}</Text>
    </Pressable>
  );
}

// Recursively renders the program-info JSON (strings, string lists, nested objects).
function InfoValue({ value, depth = 0 }: { value: unknown; depth?: number }) {
  if (typeof value === 'string' || typeof value === 'number') {
    return <Text style={styles.infoText}>{String(value)}</Text>;
  }
  if (Array.isArray(value)) {
    return (
      <View>
        {value.map((item, i) => (
          <View key={i} style={styles.bulletRow}>
            <View style={styles.bulletDot} />
            <View style={{ flex: 1 }}>
              <InfoValue value={item} depth={depth + 1} />
            </View>
          </View>
        ))}
      </View>
    );
  }
  if (value && typeof value === 'object') {
    return (
      <View>
        {Object.entries(value as Record<string, unknown>).map(([k, v]) => (
          <View key={k} style={depth === 0 ? styles.infoField : styles.infoSubField}>
            <Text style={styles.infoKey}>{humanize(k)}</Text>
            <InfoValue value={v} depth={depth + 1} />
          </View>
        ))}
      </View>
    );
  }
  return null;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg },
  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 10 },
  heading: { color: theme.text, fontSize: 32, fontWeight: '700', marginBottom: 12 },
  segment: {
    flexDirection: 'row',
    backgroundColor: theme.surface,
    borderRadius: 10,
    padding: 3,
    gap: 3,
  },
  segmentBtn: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  segmentBtnActive: { backgroundColor: theme.surfaceAlt },
  segmentText: { color: theme.textMuted, fontSize: 14, fontWeight: '600' },
  segmentTextActive: { color: theme.text },

  scroll: { paddingHorizontal: 16, paddingTop: 4 },
  group: { marginBottom: 18 },
  groupTitle: {
    color: theme.textMuted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  exRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  exName: { color: theme.text, fontSize: 15, fontWeight: '600' },
  exEquip: { color: theme.textMuted, fontSize: 12, marginTop: 2 },

  infoCard: { backgroundColor: theme.surface, borderRadius: 12, padding: 14 },
  infoField: { marginBottom: 14 },
  infoSubField: { marginBottom: 8 },
  infoKey: {
    color: theme.textDim,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  infoText: { color: theme.text, fontSize: 14, lineHeight: 21 },
  bulletRow: { flexDirection: 'row', gap: 8, marginBottom: 6, alignItems: 'flex-start' },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 7,
    backgroundColor: theme.weightPillText,
  },
});
