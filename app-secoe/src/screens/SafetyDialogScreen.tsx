import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Divider } from '../components/Divider';
import { PrimaryButton } from '../components/PrimaryButton';
import { ProgressBar } from '../components/ProgressBar';
import { RadioOption } from '../components/RadioOption';
import { ScreenHeader } from '../components/ScreenHeader';
import { useOccurrence } from '../context/OccurrenceContext';
import { RootStackParamList } from '../navigation/types';
import { colors, spacing } from '../theme/colors';

type Nav = NativeStackNavigationProp<RootStackParamList, 'SafetyDialog'>;

export function SafetyDialogScreen() {
  const navigation = useNavigation<Nav>();
  const { state, dispatch } = useOccurrence();

  const answeredCount = useMemo(
    () => state.dialogoSeguranca.filter((i) => i.answer).length + (state.duvidas ? 1 : 0),
    [state.dialogoSeguranca, state.duvidas]
  );
  const total = state.dialogoSeguranca.length + 1;
  const allAnswered = answeredCount === total;

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title={`Nova emergência - ID SIGA ${state.idSiga}`} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Diálogo de segurança</Text>
        <Text style={styles.operator}>
          Operador: <Text style={styles.operatorBold}>{state.operador}</Text>
        </Text>
        <View style={{ marginTop: spacing.md, marginBottom: spacing.lg }}>
          <ProgressBar progress={answeredCount / total} />
        </View>

        {state.dialogoSeguranca.map((item) => (
          <View key={item.id}>
            <Text style={styles.question}>
              {item.id}. {item.text}
            </Text>
            <View style={styles.options}>
              <RadioOption
                label="Sim"
                selected={item.answer === 'sim'}
                onPress={() => dispatch({ type: 'ANSWER_DIALOG_ITEM', id: item.id, answer: 'sim' })}
              />
              <RadioOption
                label="Não"
                selected={item.answer === 'nao'}
                onPress={() => dispatch({ type: 'ANSWER_DIALOG_ITEM', id: item.id, answer: 'nao' })}
              />
            </View>
            <Divider />
          </View>
        ))}

        <Text style={styles.question}>
          18. Você tem dúvidas quanto aos procedimentos acima?
        </Text>
        <View style={styles.options}>
          <RadioOption
            label="Sim"
            selected={state.duvidas === 'sim'}
            onPress={() => dispatch({ type: 'SET_DUVIDAS', answer: 'sim' })}
          />
          <RadioOption
            label="Não"
            selected={state.duvidas === 'nao'}
            onPress={() => dispatch({ type: 'SET_DUVIDAS', answer: 'nao' })}
          />
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <PrimaryButton
          label="Continuar"
          disabled={!allAnswered}
          onPress={() => navigation.navigate('PlateKmOperator')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  title: { fontSize: 22, fontWeight: '700', color: colors.navy },
  operator: { fontSize: 14, color: colors.textMuted, marginTop: spacing.xs },
  operatorBold: { fontWeight: '700', color: colors.text },
  question: { fontSize: 16, color: colors.text, marginBottom: spacing.sm },
  options: { flexDirection: 'row', marginBottom: spacing.sm },
  footer: { padding: spacing.md },
});
