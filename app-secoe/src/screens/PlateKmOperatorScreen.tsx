import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { OmnilinkBanner } from '../components/OmnilinkBanner';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { TextField } from '../components/TextField';
import { useOccurrence } from '../context/OccurrenceContext';
import { RootStackParamList } from '../navigation/types';
import { colors, radius, spacing } from '../theme/colors';

type Nav = NativeStackNavigationProp<RootStackParamList, 'PlateKmOperator'>;

export function PlateKmOperatorScreen() {
  const navigation = useNavigation<Nav>();
  const { state, dispatch } = useOccurrence();

  const canConfirm = state.placa.trim().length > 0 && state.kmInicial.trim().length > 0;

  const onConfirm = () => {
    dispatch({ type: 'START_EMERGENCY' });
    navigation.navigate('StartedSuccess');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title="Abertura de KM" />
      <ScrollView contentContainerStyle={styles.content}>
        <OmnilinkBanner />

        <Text style={styles.sectionTitle}>Selecionar placa</Text>
        <TextField
          placeholder="Ex: GJL6A11"
          value={state.placa}
          onChangeText={(v) => dispatch({ type: 'SET_PLACA', placa: v.toUpperCase() })}
          autoCapitalize="characters"
        />

        <Text style={styles.sectionTitle}>Abertura de KM inicial</Text>
        <TextField
          placeholder="Ex: 01"
          value={state.kmInicial}
          onChangeText={(v) => dispatch({ type: 'SET_KM_INICIAL', km: v })}
          keyboardType="numeric"
        />

        <Text style={styles.sectionTitle}>Selecionar operador</Text>
        <TouchableOpacity style={styles.operatorRow} activeOpacity={0.7}>
          <Text style={styles.operatorText}>{state.operador}</Text>
          <View style={styles.checkCircle}>
            <Text style={styles.checkMark}>✓</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
      <View style={styles.footer}>
        <PrimaryButton label="Confirmar" disabled={!canConfirm} onPress={onConfirm} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.navy,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  operatorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  operatorText: { fontSize: 15, color: colors.text, fontWeight: '600' },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: { color: colors.textInverse, fontWeight: '700' },
  footer: { padding: spacing.md },
});
