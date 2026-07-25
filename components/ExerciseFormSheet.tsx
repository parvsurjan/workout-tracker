import { Modal, View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ExerciseForm } from '../data/workoutPlan';
import { theme } from '../theme';

export type FormDetail = {
  name: string;
  equipment: string;
  category?: string;
  form: ExerciseForm;
};

export function ExerciseFormSheet({
  detail,
  onClose,
}: {
  detail: FormDetail | null;
  onClose: () => void;
}) {
  return (
    <Modal
      visible={!!detail}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.grabber} />
        {detail && (
          <>
            <View style={styles.sheetHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{detail.name}</Text>
                <Text style={styles.equipment}>{detail.equipment}</Text>
              </View>
              <Pressable onPress={onClose} hitSlop={12} style={styles.closeBtn}>
                <Ionicons name="close" size={22} color={theme.textMuted} />
              </Pressable>
            </View>
            <ScrollView contentContainerStyle={styles.body}>
              <Field label="Setup" value={detail.form.setup} />
              <Field label="Grip" value={detail.form.grip} />
              <Field label="Execution" value={detail.form.execution} />
              <ListField label="Cues" items={detail.form.cues} accent={theme.weightPillText} />
              <ListField
                label="Common mistakes"
                items={detail.form.commonMistakes}
                accent="#ef4444"
              />
              <Field label="Notes" value={detail.form.notes} />
              <View style={{ height: 24 }} />
            </ScrollView>
          </>
        )}
      </View>
    </Modal>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value}</Text>
    </View>
  );
}

function ListField({
  label,
  items,
  accent,
}: {
  label: string;
  items: string[];
  accent: string;
}) {
  if (!items || items.length === 0) return null;
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {items.map((item, i) => (
        <View key={i} style={styles.bulletRow}>
          <View style={[styles.bulletDot, { backgroundColor: accent }]} />
          <Text style={styles.bulletText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: '85%',
    backgroundColor: theme.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: theme.border,
  },
  grabber: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.border,
    marginBottom: 12,
  },
  sheetHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  name: { color: theme.text, fontSize: 20, fontWeight: '700' },
  equipment: { color: theme.textMuted, fontSize: 13, marginTop: 2 },
  closeBtn: { padding: 2 },
  body: { paddingTop: 8 },
  field: { marginBottom: 16 },
  fieldLabel: {
    color: theme.textDim,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  fieldValue: { color: theme.text, fontSize: 14, lineHeight: 21 },
  bulletRow: { flexDirection: 'row', gap: 8, marginBottom: 6, alignItems: 'flex-start' },
  bulletDot: { width: 6, height: 6, borderRadius: 3, marginTop: 7 },
  bulletText: { color: theme.text, fontSize: 14, lineHeight: 21, flex: 1 },
});
