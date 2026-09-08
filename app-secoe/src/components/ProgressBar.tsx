import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, radius } from '../theme/colors';

interface Props {
  progress: number;
}

export function ProgressBar({ progress }: Props) {
  const pct = Math.max(0, Math.min(1, progress));
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${pct * 100}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.teal,
    borderRadius: radius.pill,
  },
});
