import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { IconCircleButton } from '../components/IconCircleButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { useOccurrence } from '../context/OccurrenceContext';
import { RootStackParamList } from '../navigation/types';
import { colors, radius, spacing } from '../theme/colors';

type Nav = NativeStackNavigationProp<RootStackParamList, 'EmergencyPanel'>;

function notAvailable(feature: string) {
  Alert.alert(feature, 'Esta funcionalidade não faz parte do fluxo gravado nesta demonstração.');
}

export function EmergencyPanelScreen() {
  const navigation = useNavigation<Nav>();
  const { state } = useOccurrence();

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title={`ID SIGA ${state.idSiga}`} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.cliente}>Cliente: {state.cliente}</Text>
        <Text style={styles.estado}>, , {state.estado}</Text>
        <View style={styles.tag}>
          <Text style={styles.tagText}>INÍCIO: {state.data}</Text>
        </View>

        <View style={styles.detailsRow}>
          <Text style={styles.detailsTitle}>ⓘ  Detalhes da emergência</Text>
        </View>

        <View style={styles.grid}>
          <IconCircleButton
            icon="play-circle-outline"
            label="Iniciar OS"
            onPress={() => navigation.navigate('IniciarOs')}
          />
          <IconCircleButton
            icon="bed-outline"
            label="Diárias"
            onPress={() => notAvailable('Diárias')}
          />
          <IconCircleButton
            icon="cube-outline"
            label="Recursos"
            onPress={() => navigation.navigate('Recursos')}
          />
          <IconCircleButton
            icon="car-outline"
            label="Deslocamento"
            onPress={() => navigation.navigate('Deslocamento')}
          />
          <IconCircleButton
            icon="clipboard-outline"
            label="APT"
            onPress={() => notAvailable('APT')}
          />
          <IconCircleButton
            icon="stop-circle-outline"
            label="Finalizar emergência"
            variant="danger"
            onPress={() => navigation.navigate('FinalizarEmergencia')}
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
    justifyContent: 'space-between',
  },
});
