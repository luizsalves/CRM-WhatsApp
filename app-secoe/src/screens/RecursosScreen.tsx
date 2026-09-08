import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { ScreenHeader } from '../components/ScreenHeader';
import { colors, spacing } from '../theme/colors';

export function RecursosScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title="Recursos" />
      <View style={styles.content}>
        <Ionicons name="cube-outline" size={48} color={colors.textMuted} />
        <Text style={styles.title}>Nenhum recurso registrado</Text>
        <Text style={styles.subtitle}>
          Recursos alocados e finalizados para esta ocorrência aparecerão aqui.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  title: { fontSize: 16, fontWeight: '700', color: colors.navy, marginTop: spacing.md },
  subtitle: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});
