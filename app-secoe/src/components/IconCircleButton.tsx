import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, spacing } from '../theme/colors';

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  badge?: number | 'alert';
  variant?: 'default' | 'danger';
  disabled?: boolean;
}

export function IconCircleButton({ icon, label, onPress, badge, variant = 'default', disabled }: Props) {
  const isDanger = variant === 'danger';
  return (
    <TouchableOpacity
      style={styles.wrapper}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.circle,
          isDanger ? styles.circleDanger : styles.circleDefault,
          disabled && styles.circleDisabled,
        ]}
      >
        <Ionicons name={icon} size={28} color={isDanger ? colors.red : colors.navy} />
        {badge ? (
          <View style={styles.badge}>
            {badge === 'alert' ? (
              <Ionicons name="alert" size={12} color={colors.textInverse} />
            ) : (
              <Text style={styles.badgeText}>{badge}</Text>
            )}
          </View>
        ) : null}
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    width: 96,
    marginBottom: spacing.lg,
  },
  circle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  circleDefault: {
    backgroundColor: colors.surfaceMuted,
  },
  circleDanger: {
    backgroundColor: colors.redLight,
  },
  circleDisabled: {
    opacity: 0.4,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.red,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: colors.textInverse,
    fontSize: 11,
    fontWeight: '700',
  },
  label: {
    fontSize: 13,
    textAlign: 'center',
    color: colors.text,
    fontWeight: '600',
  },
});
