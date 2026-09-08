import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { Divider } from '../components/Divider';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { useOccurrence } from '../context/OccurrenceContext';
import { RootStackParamList } from '../navigation/types';
import { colors, radius, spacing } from '../theme/colors';

type Nav = NativeStackNavigationProp<RootStackParamList, 'EmergencyResume'>;

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

export function EmergencyResumeScreen() {
  const navigation = useNavigation<Nav>();
  const { state, dispatch } = useOccurrence();

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title={`Resumo — ID SIGA ${state.idSiga}`} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <InfoRow label="Tipo de ocorrência" value={state.tipoOcorrencia} />
          <InfoRow label="Cliente" value={state.cliente} />
          <InfoRow label="Estado" value={state.estado} />
          <InfoRow label="Produto" value={state.produto} />
          <InfoRow label="Líder de campo" value={state.liderCampo} />
          <InfoRow label="Cenário" value={state.cenario} />
          <InfoRow
            label="Vítima fatal"
            value={state.vitimaFatalResumo === 'sim' ? 'Sim' : 'Não'}
          />
          <InfoRow
            label="Próximo a rios e lagos"
            value={state.proximoRiosLagosResumo === 'sim' ? 'Sim' : 'Não'}
          />
        </View>

        <Divider />

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Sou o motorista da viatura</Text>
          <Switch
            value={state.souMotorista}
            onValueChange={(value) => dispatch({ type: 'SET_SOU_MOTORISTA', value })}
            trackColor={{ true: colors.teal, false: colors.border }}
          />
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <PrimaryButton
          label="Iniciar emergência"
          disabled={!state.souMotorista}
          onPress={() => navigation.navigate('SafetyDialog')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  infoLabel: { color: colors.textMuted, fontSize: 14, flex: 1 },
  infoValue: { color: colors.text, fontSize: 14, fontWeight: '600', flex: 1.4, textAlign: 'right' },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  switchLabel: { fontSize: 16, fontWeight: '600', color: colors.navy, flex: 1, marginRight: spacing.sm },
  footer: { padding: spacing.md },
});
