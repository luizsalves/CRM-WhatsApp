import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { IconCircleButton } from '../components/IconCircleButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { useOccurrence } from '../context/OccurrenceContext';
import { RootStackParamList } from '../navigation/types';
import { colors, radius, spacing } from '../theme/colors';

type Nav = NativeStackNavigationProp<RootStackParamList, 'IniciarOs'>;

export function IniciarOsScreen() {
  const navigation = useNavigation<Nav>();
  const { state } = useOccurrence();

  const assessmentDone = state.avaliacaoInicial.enviado;
  const activitiesDone = state.atividades.length > 0;
  const launchesDone = state.lancamentos.length > 0;

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title="Iniciar OS" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.cliente}>Cliente: {state.cliente}</Text>
        <Text style={styles.estado}>, , {state.estado}</Text>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{state.data}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.detailsTitle}>ⓘ  Detalhes da emergência</Text>
        </View>

        <View style={styles.grid}>
          <IconCircleButton
            icon="clipboard-outline"
            label="Avaliação inicial do cenário"
            badge={assessmentDone ? undefined : 'alert'}
            onPress={() => navigation.navigate('InitialAssessment')}
          />
          <IconCircleButton
            icon="camera-outline"
            label="Descrição das atividades"
            badge={!assessmentDone ? undefined : activitiesDone ? undefined : 'alert'}
            disabled={!assessmentDone}
            onPress={() => navigation.navigate('Atividades')}
          />
          <IconCircleButton
            icon="pricetags-outline"
            label="Lançamentos"
            badge={!activitiesDone ? undefined : launchesDone ? undefined : 'alert'}
            disabled={!activitiesDone}
            onPress={() => navigation.navigate('Lancamentos')}
          />
          <IconCircleButton
            icon="create-outline"
            label="Assinatura"
            disabled={!launchesDone}
            onPress={() => navigation.navigate('ResumoAssinatura')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  cliente: { fontSize: 18, fontWeight: '700', color: colors.navy },
  estado: { fontSize: 14, color: colors.textMuted, marginTop: spacing.xs },
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    marginTop: spacing.sm,
  },
  tagText: { fontSize: 12, fontWeight: '700', color: colors.textMuted },
  detailsRow: {
    marginTop: spacing.md,
    marginBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: spacing.sm,
  },
  detailsTitle: { fontSize: 17, fontWeight: '700', color: colors.navy },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
});
