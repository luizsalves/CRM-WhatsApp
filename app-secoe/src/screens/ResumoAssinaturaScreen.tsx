import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Divider } from '../components/Divider';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { SignaturePad } from '../components/SignaturePad';
import { useOccurrence } from '../context/OccurrenceContext';
import { RootStackParamList } from '../navigation/types';
import { colors, radius, spacing } from '../theme/colors';

type Nav = NativeStackNavigationProp<RootStackParamList, 'ResumoAssinatura'>;

export function ResumoAssinaturaScreen() {
  const navigation = useNavigation<Nav>();
  const { state, dispatch } = useOccurrence();

  const deslocamentosCount = state.deslocamentos.filter((m) => m.registrado).length;
  const lancamentosCount = state.lancamentos.length;

  const onFinalizar = () => {
    Alert.alert('Finalizar OS', 'Confirma finalização do dia?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Confirmar',
        onPress: () => {
          dispatch({ type: 'FINALIZAR_OS_DIA' });
          navigation.navigate('EmergencyPanel');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title="Resumo de emergência" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{deslocamentosCount}</Text>
            <Text style={styles.statLabel}>Deslocamentos</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{lancamentosCount}</Text>
            <Text style={styles.statLabel}>Lançamentos</Text>
          </View>
        </View>

        <Divider />

        <Text style={styles.sectionTitle}>Assinatura</Text>
        <SignaturePad
          value={state.assinatura}
          onChange={(v) => dispatch({ type: 'SET_ASSINATURA', assinatura: v })}
        />
      </ScrollView>
      <View style={styles.footer}>
        <PrimaryButton
          label="Finalizar OS do dia"
          variant="danger"
          disabled={!state.assinatura || state.osFinalizadaDia}
          onPress={onFinalizar}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  statsRow: { flexDirection: 'row' },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  statNumber: { fontSize: 28, fontWeight: '800', color: colors.navy },
  statLabel: { fontSize: 13, color: colors.textMuted, marginTop: spacing.xs },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.navy, marginBottom: spacing.sm },
  footer: { padding: spacing.md },
});
