import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, spacing } from '../theme/colors';

interface Props {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export function RadioOption({ label, selected, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} hitSlop={8}>
      <View style={[styles.circle, selected && styles.circleSelected]}>
        {selected ? <View style={styles.dot} /> : null}
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.lg,
    marginBottom: spacing.xs,
  },
  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  circleSelected: {
    borderColor: colors.teal,
  },
  dot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: colors.teal,
  },
  label: {
    fontSize: 16,
    color: colors.text,
  },
});
