import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, radius, spacing } from '../theme/colors';

interface Props {
  idSiga: string;
  sapId: string;
  cliente: string;
  estado: string;
  statusLabel: string;
  statusColor?: string;
  onPress: () => void;
}

export function OccurrenceCard({
  idSiga,
  sapId,
  cliente,
  estado,
  statusLabel,
  statusColor = colors.red,
  onPress,
}: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.playCircle}>
        <Ionicons name="play" size={16} color={colors.textInverse} />
      </View>
      <View style={styles.info}>
        <View style={styles.topRow}>
          <View>
            <Text style={styles.idText}>
              ID SIGA:<Text style={styles.idBold}>{idSiga}</Text>
            </Text>
            <Text style={styles.idText}>
              SAP ID:<Text style={styles.idBold}>{sapId}</Text>
            </Text>
          </View>
          <View style={[styles.badge, { backgroundColor: statusColor }]}>
            <Text style={styles.badgeText}>{statusLabel}</Text>
          </View>
        </View>
        <Text style={styles.cliente}>Cliente: {cliente}</Text>
        <Text style={styles.estado}>, , {estado}</Text>
      </View>
      <Ionicons name="chevron-forward" size={22} color={colors.navy} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.red,
    borderRadius: radius.lg,
    padding: spacing.md,
    backgroundColor: colors.surface,
  },
  playCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.red,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  info: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  idText: {
    fontSize: 15,
    color: colors.text,
  },
  idBold: {
    fontWeight: '700',
    color: colors.navy,
  },
  badge: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  badgeText: {
    color: colors.textInverse,
    fontSize: 11,
    fontWeight: '700',
  },
  cliente: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.navy,
    marginTop: spacing.xs,
  },
  estado: {
    fontSize: 14,
    color: colors.textMuted,
  },
});
