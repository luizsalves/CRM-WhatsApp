import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Divider } from '../components/Divider';
import { PrimaryButton } from '../components/PrimaryButton';
import { ProgressBar } from '../components/ProgressBar';
import { RadioOption } from '../components/RadioOption';
import { ScreenHeader } from '../components/ScreenHeader';
import { TextField } from '../components/TextField';
import { useOccurrence } from '../context/OccurrenceContext';
import { RootStackParamList } from '../navigation/types';
import { colors, spacing } from '../theme/colors';

type Nav = NativeStackNavigationProp<RootStackParamList, 'VehicleChecklist'>;

export function VehicleChecklistScreen() {
  const navigation = useNavigation<Nav>();
  const { state, dispatch } = useOccurrence();
  const [sectionIndex, setSectionIndex] = useState(0);

  const section = state.checklist[sectionIndex];
  const isLast = sectionIndex === state.checklist.length - 1;
  const answeredCount = section.itens.filter((i) => i.answer).length;
  const allAnswered = answeredCount === section.itens.length;

  const onContinue = () => {
    if (isLast) {
      dispatch({ type: 'FINALIZAR_EMERGENCIA' });
      navigation.navigate('EmergencyFinishedSuccess');
    } else {
      setSectionIndex((prev) => prev + 1);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader
        title="Checklist do Veiculo"
        subtitle={`${state.viatura} - ${state.data} - 14:12`}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>{section.titulo}</Text>
        <View style={{ marginTop: spacing.sm, marginBottom: spacing.lg }}>
          <ProgressBar progress={(sectionIndex + answeredCount / section.itens.length) / state.checklist.length} />
        </View>

        {section.itens.map((item) => (
          <View key={item.id}>
            <Text style={styles.question}>{item.label}</Text>
            <View style={styles.options}>
              <RadioOption
                label="Sim"
                selected={item.answer === 'sim'}
                onPress={() =>
                  dispatch({
                    type: 'UPDATE_CHECKLIST_ITEM',
                    sectionId: section.id,
                    itemId: item.id,
                    patch: { answer: 'sim' },
                  })
                }
              />
              <RadioOption
                label="Não"
                selected={item.answer === 'nao'}
                onPress={() =>
                  dispatch({
                    type: 'UPDATE_CHECKLIST_ITEM',
                    sectionId: section.id,
                    itemId: item.id,
                    patch: { answer: 'nao' },
                  })
                }
              />
              <RadioOption
                label="Não aplicável"
                selected={item.answer === 'nao_aplicavel'}
                onPress={() =>
                  dispatch({
                    type: 'UPDATE_CHECKLIST_ITEM',
                    sectionId: section.id,
                    itemId: item.id,
                    patch: { answer: 'nao_aplicavel' },
                  })
                }
              />
            </View>

            <TouchableOpacity
              style={styles.observacaoToggle}
              onPress={() =>
                dispatch({
                  type: 'UPDATE_CHECKLIST_ITEM',
                  sectionId: section.id,
                  itemId: item.id,
                  patch: { observacaoAtiva: !item.observacaoAtiva },
                })
              }
            >
              <Ionicons name="add-circle" size={20} color={colors.navy} />
              <Text style={styles.observacaoLabel}>Incluir observação</Text>
            </TouchableOpacity>

            {item.observacaoAtiva ? (
              <TextField
                placeholder="Descreva a observação"
                value={item.observacao}
                onChangeText={(v) =>
                  dispatch({
                    type: 'UPDATE_CHECKLIST_ITEM',
                    sectionId: section.id,
                    itemId: item.id,
                    patch: { observacao: v },
                  })
                }
                multiline
              />
            ) : null}

            <Divider />
          </View>
        ))}
      </ScrollView>
      <View style={styles.footer}>
        <PrimaryButton
          label={isLast ? 'Confirmar' : 'Confirmar e continuar'}
          disabled={!allAnswered}
          onPress={onContinue}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: colors.navy, textAlign: 'center' },
  question: { fontSize: 16, color: colors.text, marginBottom: spacing.sm },
  options: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.sm },
  observacaoToggle: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  observacaoLabel: { marginLeft: spacing.sm, color: colors.navy, fontWeight: '700', fontSize: 14 },
  footer: { padding: spacing.md },
});
