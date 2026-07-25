import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Share, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ResolvedDay, fillCheckinTemplate } from '../data/workoutPlan';
import { getLogsForWeeks } from '../data/logs';
import { theme } from '../theme';

export function CheckinCard({ day }: { day: ResolvedDay }) {
  const [filled, setFilled] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // The check-in covers this even week and the odd week before it.
      const logs = await getLogsForWeeks([Math.max(1, day.week - 1), day.week]);
      if (cancelled) return;
      setFilled(fillCheckinTemplate(day, logs));
    })();
    return () => {
      cancelled = true;
    };
  }, [day.globalIndex]);

  const onShare = async () => {
    if (!filled) return;
    try {
      await Share.share({ message: filled });
    } catch {}
  };

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.dayHeading}>
          Week {day.week} · Day {day.dayInWeek}
        </Text>
        <Text style={styles.title}>2-Week Check-In</Text>
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Ionicons name="clipboard-outline" size={12} color={theme.checkinAccent} />
            <Text style={styles.badgeText}>CHECK-IN · NO TRAINING</Text>
          </View>
        </View>
      </View>

      {!!day.checkin && (
        <View style={styles.instructionCard}>
          <Ionicons name="information-circle-outline" size={16} color={theme.textMuted} />
          <Text style={styles.instructionText}>{day.checkin.instructions}</Text>
        </View>
      )}

      <Pressable onPress={onShare} style={styles.shareButton} disabled={!filled}>
        <Ionicons name="share-outline" size={18} color={theme.bg} />
        <Text style={styles.shareText}>Share / copy check-in</Text>
      </Pressable>

      <View style={styles.templateCard}>
        {filled == null ? (
          <ActivityIndicator color={theme.textMuted} />
        ) : (
          <Text style={styles.templateText} selectable>
            {filled}
          </Text>
        )}
      </View>
      <Text style={styles.footnote}>
        Numbers are auto-filled from the best working set you logged over the last 2 weeks. Blanks
        with no logged data show "n/a" — long-press the text to edit before sending.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: 16 },
  dayHeading: { color: theme.textMuted, fontSize: 13, fontWeight: '600', letterSpacing: 0.5 },
  title: { color: theme.text, fontSize: 26, fontWeight: '700', marginTop: 4 },
  badgeRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    backgroundColor: theme.checkinBg,
    borderColor: theme.checkinAccent,
  },
  badgeText: { color: theme.checkinAccent, fontSize: 11, fontWeight: '700', letterSpacing: 0.3 },

  instructionCard: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: theme.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  instructionText: { color: theme.textMuted, fontSize: 13, lineHeight: 19, flex: 1 },

  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.text,
    borderRadius: 14,
    paddingVertical: 14,
    marginBottom: 12,
  },
  shareText: { color: theme.bg, fontSize: 15, fontWeight: '700' },

  templateCard: { backgroundColor: theme.surface, borderRadius: 14, padding: 14 },
  templateText: {
    color: theme.text,
    fontSize: 12,
    lineHeight: 18,
    fontFamily: 'Courier',
  },
  footnote: { color: theme.textDim, fontSize: 11, lineHeight: 16, marginTop: 10, paddingHorizontal: 4 },
});
