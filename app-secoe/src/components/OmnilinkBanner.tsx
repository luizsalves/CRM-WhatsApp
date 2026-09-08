import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../theme/colors';

export function OmnilinkBanner() {
  return (
    <View style={styles.container}>
      <Ionicons name="warning" size={20} color={colors.red} />
      <Text style={styles.text}>
        Erro Integração Omnilink. Entre em contato com o CECOE.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.redLight,
    borderRadius: radius.md,
    padding: spacing.sm + 2,
    marginBottom: spacing.md,
  },
  text: {
    flex: 1,
    marginLeft: spacing.sm,
    color: colors.red,
    fontSize: 13,
    fontWeight: '600',
  },
});
