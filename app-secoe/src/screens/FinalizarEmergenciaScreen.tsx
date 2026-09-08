import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { TextField } from '../components/TextField';
import { YesNoField } from '../components/YesNoField';
import { useOccurrence } from '../context/OccurrenceContext';
import { RootStackParamList } from '../navigation/types';
import { colors, spacing } from '../theme/colors';

type Nav = NativeStackNavigationProp<RootStackParamList, 'FinalizarEmergencia'>;

export function FinalizarEmergenciaScreen() {
  const navigation = useNavigation<Nav>();
  const { state, dispatch } = useOccurrence();

  const canContinue = state.motoristaFinalizacao === 'sim' && state.placaFinalizacao.trim().length > 0;

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title="Finalizar ocorrência" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.question}>Você é o motorista da viatura?</Text>
        <YesNoField
          question=""
          value={state.motoristaFinalizacao}
          onChange={(v) => dispatch({ type: 'SET_MOTORISTA_FINALIZACAO', answer: v })}
        />

        {state.motoristaFinalizacao === 'sim' ? (
          <View>
            <Text style={styles.question}>Confirme a placa da viatura</Text>
            <TextField
              placeholder="Ex: GJL6A11"
              value={state.placaFinalizacao}
              onChangeText={(v) => dispatch({ type: 'SET_PLACA_FINALIZACAO', placa: v.toUpperCase() })}
              autoCapitalize="characters"
            />
          </View>
        ) : null}
      </ScrollView>
      <View style={styles.footer}>
        <PrimaryButton
          label="Continuar para o checklist"
          disabled={!canContinue}
          onPress={() => navigation.navigate('VehicleChecklist')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  question: { fontSize: 16, fontWeight: '600', color: colors.navy, marginBottom: spacing.sm, marginTop: spacing.sm },
  footer: { padding: spacing.md },
});
