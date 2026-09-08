import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { OccurrenceCard } from '../components/OccurrenceCard';
import { useOccurrence } from '../context/OccurrenceContext';
import { RootStackParamList, TabParamList } from '../navigation/types';
import { colors, radius, spacing } from '../theme/colors';

type Kind = 'novas' | 'em_campo' | 'programados' | 'finalizados';

interface Props {
  kind: Kind;
}

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  nao_inicializado: { label: 'NÃO INICIALIZADO', color: colors.red },
  em_campo: { label: 'EM ANDAMENTO', color: colors.orange },
  finalizado: { label: 'FINALIZADO', color: colors.teal },
};

export function HomeScreen({ kind }: Props) {
  const navigation = useNavigation<Nav>();
  const { state } = useOccurrence();

  const showOccurrence =
    (kind === 'novas' && state.status === 'nao_inicializado') ||
    (kind === 'em_campo' && state.status === 'em_campo') ||
    (kind === 'finalizados' && state.status === 'finalizado');

  const onOpen = () => {
    if (state.status === 'nao_inicializado') {
      navigation.navigate('EmergencyResume');
    } else if (state.status === 'em_campo') {
      navigation.navigate('EmergencyPanel');
    } else {
      navigation.navigate('EmergencyPanel');
    }
  };

  const status = STATUS_LABEL[state.status];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Ionicons name="menu" size={26} color={colors.textInverse} />
          <Text style={styles.logo}>
            siga<Text style={styles.logoAccent}>{'>'}</Text>
          </Text>
          <View style={{ width: 26 }} />
        </View>
        <Text style={styles.greeting}>Olá, {state.liderCampo}!</Text>
        <View style={styles.searchBox}>
          <TextInput
            placeholder="Buscar Id"
            placeholderTextColor={colors.placeholder}
            style={styles.searchInput}
          />
          <Ionicons name="search" size={20} color={colors.navy} />
        </View>
      </View>

      <View style={styles.tabsRow}>
        <TabIcon
          icon="alert-circle-outline"
          label="Novas Emergências"
          active={kind === 'novas'}
          badge={state.status === 'nao_inicializado' ? 1 : undefined}
          onPress={() => navigation.navigate('NovasEmergencias')}
        />
        <TabIcon
          icon="document-text-outline"
          label="Em Campo"
          active={kind === 'em_campo'}
          onPress={() => navigation.navigate('EmCampo')}
        />
        <TabIcon
          icon="time-outline"
          label="Atendimentos Programados"
          active={kind === 'programados'}
          onPress={() => navigation.navigate('AtendimentosProgramados')}
        />
        <TabIcon
          icon="checkmark-done-outline"
          label="Finalizados"
          active={kind === 'finalizados'}
          badge={state.status === 'finalizado' ? 1 : undefined}
          onPress={() => navigation.navigate('Finalizados')}
        />
      </View>

      <View style={styles.listArea}>
        {showOccurrence ? (
          <OccurrenceCard
            idSiga={state.idSiga}
            sapId={state.sapId}
            cliente={state.cliente}
            estado={state.estado}
            statusLabel={status.label}
            statusColor={status.color}
            onPress={onOpen}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="file-tray-outline" size={40} color={colors.textMuted} />
            <Text style={styles.emptyText}>Nenhuma ocorrência nesta lista.</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

function TabIcon({
  icon,
  label,
  active,
  badge,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  active: boolean;
  badge?: number;
  onPress: () => void;
}) {
  return (
    <View style={styles.tabIconWrap}>
      <View style={[styles.tabCircle, active && styles.tabCircleActive]}>
        <Ionicons name={icon} size={24} color={colors.navy} onPress={onPress} />
        {badge ? (
          <View style={styles.tabBadge}>
            <Text style={styles.tabBadgeText}>{badge}</Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.tabLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.navy,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textInverse,
  },
  logoAccent: {
    color: colors.lime,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textInverse,
    marginTop: spacing.md,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    marginTop: spacing.md,
  },
  searchInput: {
    flex: 1,
    color: colors.textInverse,
    fontSize: 15,
  },
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
  tabIconWrap: {
    alignItems: 'center',
    width: 76,
  },
  tabCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  tabCircleActive: {
    backgroundColor: colors.lime,
  },
  tabBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.lime,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  tabBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.navy,
  },
  tabLabel: {
    fontSize: 11,
    textAlign: 'center',
    color: colors.text,
  },
  listArea: {
    paddingHorizontal: spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  emptyText: {
    marginTop: spacing.sm,
    color: colors.textMuted,
    fontSize: 14,
  },
});
