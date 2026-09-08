import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScreenHeader } from '../components/ScreenHeader';
import { LANCAMENTO_ITEMS } from '../data/initialOccurrence';
import { useOccurrence } from '../context/OccurrenceContext';
import { RootStackParamList } from '../navigation/types';
import { colors, radius, spacing } from '../theme/colors';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Lancamentos'>;

const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  'Equipamentos de monitoramento': 'speedometer-outline',
  'Equipamentos de transbordo': 'swap-horizontal-outline',
  'Serviços adicionais': 'construct-outline',
};

export function LancamentosScreen() {
  const navigation = useNavigation<Nav>();
  const { state } = useOccurrence();

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title="Lançamentos" />
      <ScrollView contentContainerStyle={styles.content}>
        {Object.keys(LANCAMENTO_ITEMS).map((categoria) => {
          const count = state.lancamentos.filter((l) => l.categoria === categoria).length;
          return (
            <TouchableOpacity
              key={categoria}
              style={styles.card}
              onPress={() => navigation.navigate('LancamentoCategoria', { categoria })}
            >
              <View style={styles.iconCircle}>
                <Ionicons name={CATEGORY_ICONS[categoria]} size={24} color={colors.navy} />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{categoria}</Text>
                {count > 0 ? (
                  <Text style={styles.cardSubtitle}>{count} lançamento(s) registrado(s)</Text>
                ) : (
                  <Text style={styles.cardSubtitle}>Nenhum lançamento registrado</Text>
                )}
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.navy} />
            </TouchableOpacity>
          );
        })}

        {state.lancamentos.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>Lançamentos consolidados</Text>
            {state.lancamentos.map((lancamento) => (
              <View key={lancamento.id} style={styles.consolidatedRow}>
                <Ionicons name="checkmark-circle" size={18} color={colors.teal} />
                <Text style={styles.consolidatedText}>
                  {lancamento.item} — {lancamento.quantidade} {lancamento.unidade}
                </Text>
              </View>
            ))}
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: colors.navy },
  cardSubtitle: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.navy, marginTop: spacing.md, marginBottom: spacing.sm },
  consolidatedRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  consolidatedText: { marginLeft: spacing.sm, fontSize: 14, color: colors.text },
});
