import React, { useMemo, useRef, useState } from 'react';
import { GestureResponderEvent, PanResponder, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, radius, spacing } from '../theme/colors';

interface Props {
  onChange: (svgPaths: string | null) => void;
  value: string | null;
}

export function SignaturePad({ onChange, value }: Props) {
  const [completedPaths, setCompletedPaths] = useState<string[]>(
    value ? value.split('|') : []
  );
  const [activePath, setActivePath] = useState<string>('');
  const activePathRef = useRef<string>('');

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt: GestureResponderEvent) => {
          const { locationX, locationY } = evt.nativeEvent;
          activePathRef.current = `M${locationX.toFixed(1)},${locationY.toFixed(1)}`;
          setActivePath(activePathRef.current);
        },
        onPanResponderMove: (evt: GestureResponderEvent) => {
          const { locationX, locationY } = evt.nativeEvent;
          activePathRef.current += ` L${locationX.toFixed(1)},${locationY.toFixed(1)}`;
          setActivePath(activePathRef.current);
        },
        onPanResponderRelease: () => {
          const finished = activePathRef.current;
          activePathRef.current = '';
          setActivePath('');
          setCompletedPaths((prev) => {
            const next = finished ? [...prev, finished] : prev;
            onChange(next.length ? next.join('|') : null);
            return next;
          });
        },
      }),
    [onChange]
  );

  const clear = () => {
    setCompletedPaths([]);
    setActivePath('');
    onChange(null);
  };

  const hasStrokes = completedPaths.length > 0 || !!activePath;

  return (
    <View>
      <View style={styles.canvas} {...panResponder.panHandlers}>
        <Svg width="100%" height="100%">
          {completedPaths.map((d, index) => (
            <Path key={index} d={d} stroke={colors.navy} strokeWidth={2.5} fill="none" />
          ))}
          {activePath ? <Path d={activePath} stroke={colors.navy} strokeWidth={2.5} fill="none" /> : null}
        </Svg>
        {!hasStrokes ? <Text style={styles.placeholder}>Assine aqui</Text> : null}
      </View>
      <TouchableOpacity onPress={clear} style={styles.clearButton}>
        <Text style={styles.clearText}>Limpar assinatura</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: {
    height: 180,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    position: 'absolute',
    color: colors.placeholder,
    fontSize: 14,
  },
  clearButton: {
    alignSelf: 'flex-end',
    marginTop: spacing.sm,
  },
  clearText: {
    color: colors.teal,
    fontWeight: '600',
    fontSize: 13,
  },
});
