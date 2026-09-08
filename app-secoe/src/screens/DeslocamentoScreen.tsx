import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { OmnilinkBanner } from '../components/OmnilinkBanner';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { TextField } from '../components/TextField';
import { useOccurrence } from '../context/OccurrenceContext';
import { DeslocamentoTipo } from '../types/models';
import { colors, radius, spacing } from '../theme/colors';

function formatDateTime(iso: string) {
  const date = new Date(iso);
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function DeslocamentoScreen() {
  const { state, dispatch } = useOccurrence();
  const [editing, setEditing] = useState<DeslocamentoTipo | null>(null);
  const [km, setKm] = useState('');
  const [placa, setPlaca] = useState(state.placa);

  const nextPendingIndex = state.deslocamentos.findIndex((m) => !m.registrado);

  const openEditor = (tipo: DeslocamentoTipo) => {
    setKm('');
    setPlaca(state.placa);
    setEditing(tipo);
  };

  const confirm = () => {
    if (!editing) return;
    dispatch({ type: 'REGISTER_DESLOCAMENTO', tipo: editing, km, placa });
    setEditing(null);
  };

  const allDone = state.deslocamentos.every((m) => m.registrado);

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title="Deslocamento" />
      <ScrollView contentContainerStyle={styles.content}>
        {allDone ? (
          <View style={styles.doneBanner}>
            <Ionicons name="checkmark-circle" size={20} color={colors.teal} />
            <Text style={styles.doneBannerText}>Deslocamento encerrado</Text>
          </View>
        ) : null}

        {state.deslocamentos.map((marco, index) => {
          const isNext = index === nextPendingIndex;
          return (
            <View key={marco.tipo} style={styles.card}>
              <View style={styles.cardHeader}>
                <View
                  style={[
                    styles.stepCircle,
                    marco.registrado && styles.stepCircleDone,
                  ]}
                >
                  {marco.registrado ? (
                    <Ionicons name="checkmark" size={16} color={colors.textInverse} />
                  ) : (
                    <Text style={styles.stepNumber}>{index + 1}</Text>
                  )}
                </View>
                <Text style={styles.cardTitle}>{marco.label}</Text>
              </View>
              {marco.registrado ? (
                <Text style={styles.cardDetail}>
                  {marco.dataHora ? formatDateTime(marco.dataHora) : ''} — KM {marco.km}
                </Text>
              ) : (
                <PrimaryButton
                  label="Registrar"
                  variant="outline"
                  disabled={!isNext}
                  onPress={() => openEditor(marco.tipo)}
                />
              )}
            </View>
          );
        })}
      </ScrollView>

      <Modal visible={!!editing} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {editing ? state.deslocamentos.find((m) => m.tipo === editing)?.label : ''}
            </Text>
            <OmnilinkBanner />
            <TextField label="Placa" value={placa} onChangeText={setPlaca} autoCapitalize="characters" />
            <TextField label="KM" value={km} onChangeText={setKm} keyboardType="numeric" />
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setEditing(null)} style={styles.cancelButton}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <PrimaryButton
                label="Confirmar"
                disabled={!km || !placa}
                onPress={confirm}
                style={styles.confirmButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  doneBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  doneBannerText: { marginLeft: spacing.sm, color: colors.teal, fontWeight: '700' },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  stepCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  stepCircleDone: { backgroundColor: colors.teal },
  stepNumber: { color: colors.navy, fontWeight: '700', fontSize: 12 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: colors.navy, flexShrink: 1 },
  cardDetail: { fontSize: 13, color: colors.textMuted, marginLeft: 34 },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.lg,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: colors.navy, marginBottom: spacing.md },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: spacing.sm },
  cancelButton: { justifyContent: 'center', paddingHorizontal: spacing.md },
  cancelText: { color: colors.textMuted, fontWeight: '600' },
  confirmButton: { minWidth: 140 },
});
