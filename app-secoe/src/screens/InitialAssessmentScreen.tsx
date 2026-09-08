import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ChipGroup } from '../components/ChipGroup';
import { Divider } from '../components/Divider';
import { PhotoPickerRow } from '../components/PhotoPickerRow';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { TextField } from '../components/TextField';
import { YesNoField } from '../components/YesNoField';
import { useOccurrence } from '../context/OccurrenceContext';
import { RootStackParamList } from '../navigation/types';
import { AreaAfetadaPonto, InitialAssessment, Representante } from '../types/models';
import { colors, radius, spacing } from '../theme/colors';

type Nav = NativeStackNavigationProp<RootStackParamList, 'InitialAssessment'>;

const USO_SOLO_OPTIONS = ['Teste', 'Industrial', 'Misto', 'Rural', 'Urbano'] as const;

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function InitialAssessmentScreen() {
  const navigation = useNavigation<Nav>();
  const { state, dispatch } = useOccurrence();
  const assessment = state.avaliacaoInicial;

  const patch = (p: Partial<InitialAssessment>) => dispatch({ type: 'UPDATE_ASSESSMENT', patch: p });

  const addAreaPonto = () => {
    const novo: AreaAfetadaPonto = { id: uid(), local: '', extensaoEstimada: '', tipo: '' };
    patch({ areaAfetada: [...assessment.areaAfetada, novo] });
  };
  const updateAreaPonto = (id: string, field: keyof AreaAfetadaPonto, value: string) => {
    patch({
      areaAfetada: assessment.areaAfetada.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    });
  };
  const removeAreaPonto = (id: string) => {
    patch({ areaAfetada: assessment.areaAfetada.filter((p) => p.id !== id) });
  };

  const addRepresentante = () => {
    const novo: Representante = { id: uid(), empresa: '', nome: '', cargo: '' };
    patch({ representantes: [...assessment.representantes, novo] });
  };
  const updateRepresentante = (id: string, field: keyof Representante, value: string) => {
    patch({
      representantes: assessment.representantes.map((r) =>
        r.id === id ? { ...r, [field]: value } : r
      ),
    });
  };
  const removeRepresentante = (id: string) => {
    patch({ representantes: assessment.representantes.filter((r) => r.id !== id) });
  };

  const canSubmit =
    assessment.descricao.trim().length > 0 &&
    assessment.apresentaVazamento !== null &&
    assessment.proximoRiosLagos !== null &&
    assessment.vitimasFatais !== null &&
    assessment.usoOcupacaoSolo !== null;

  const onSubmit = () => {
    dispatch({ type: 'SUBMIT_ASSESSMENT' });
    navigation.navigate('AssessmentSuccess');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title="Avaliação inicial do cenário" />
      <ScrollView contentContainerStyle={styles.content}>
        <TextField
          label="Descreva a situação encontrada"
          placeholder="Ex: carreta tombada na lateral da rodovia..."
          value={assessment.descricao}
          onChangeText={(v) => patch({ descricao: v })}
          multiline
        />

        <YesNoField
          question="Apresenta vazamento?"
          value={assessment.apresentaVazamento}
          onChange={(v) => patch({ apresentaVazamento: v })}
        />
        <YesNoField
          question="Próximo de rios e lagos?"
          value={assessment.proximoRiosLagos}
          onChange={(v) => patch({ proximoRiosLagos: v })}
        />
        <YesNoField
          question="Vítimas fatais?"
          value={assessment.vitimasFatais}
          onChange={(v) => patch({ vitimasFatais: v })}
        />

        <Divider />

        <YesNoField
          question="Embarcador"
          value={assessment.embarcador.possui}
          onChange={(v) => patch({ embarcador: { ...assessment.embarcador, possui: v } })}
        />
        {assessment.embarcador.possui === 'sim' ? (
          <TextField
            placeholder="Nome do embarcador"
            value={assessment.embarcador.nome}
            onChangeText={(v) => patch({ embarcador: { ...assessment.embarcador, nome: v } })}
          />
        ) : null}

        <YesNoField
          question="Transportador"
          value={assessment.transportador.possui}
          onChange={(v) => patch({ transportador: { ...assessment.transportador, possui: v } })}
        />
        {assessment.transportador.possui === 'sim' ? (
          <TextField
            placeholder="Nome do transportador"
            value={assessment.transportador.nome}
            onChangeText={(v) => patch({ transportador: { ...assessment.transportador, nome: v } })}
          />
        ) : null}

        <YesNoField
          question="Destinatário"
          value={assessment.destinatario.possui}
          onChange={(v) => patch({ destinatario: { ...assessment.destinatario, possui: v } })}
        />
        {assessment.destinatario.possui === 'sim' ? (
          <TextField
            placeholder="Nome do destinatário"
            value={assessment.destinatario.nome}
            onChangeText={(v) => patch({ destinatario: { ...assessment.destinatario, nome: v } })}
          />
        ) : null}

        <Divider />

        <Text style={styles.sectionTitle}>Uso e ocupação do solo</Text>
        <ChipGroup
          options={[...USO_SOLO_OPTIONS]}
          value={assessment.usoOcupacaoSolo}
          onChange={(v) => patch({ usoOcupacaoSolo: v as typeof assessment.usoOcupacaoSolo })}
        />

        <Divider />

        <Text style={styles.sectionTitle}>Fluidos do equipamento</Text>
        <YesNoField
          question="Óleo hidráulico"
          value={assessment.fluidos.oleoHidraulico}
          onChange={(v) => patch({ fluidos: { ...assessment.fluidos, oleoHidraulico: v } })}
        />
        <YesNoField
          question="Óleo diesel combustível"
          value={assessment.fluidos.oleoDieselCombustivel}
          onChange={(v) => patch({ fluidos: { ...assessment.fluidos, oleoDieselCombustivel: v } })}
        />
        <YesNoField
          question="Óleo lubrificante do motor"
          value={assessment.fluidos.oleoLubrificanteMotor}
          onChange={(v) => patch({ fluidos: { ...assessment.fluidos, oleoLubrificanteMotor: v } })}
        />

        <Divider />

        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>Área afetada</Text>
          <TouchableOpacity onPress={addAreaPonto} style={styles.addRow}>
            <Ionicons name="add-circle" size={22} color={colors.teal} />
            <Text style={styles.addRowLabel}>Adicionar ponto</Text>
          </TouchableOpacity>
        </View>
        {assessment.areaAfetada.map((ponto, index) => (
          <View key={ponto.id} style={styles.subCard}>
            <View style={styles.rowBetween}>
              <Text style={styles.subCardTitle}>Ponto {index + 1}</Text>
              <TouchableOpacity onPress={() => removeAreaPonto(ponto.id)}>
                <Ionicons name="trash-outline" size={18} color={colors.red} />
              </TouchableOpacity>
            </View>
            <TextField
              label="Local"
              value={ponto.local}
              onChangeText={(v) => updateAreaPonto(ponto.id, 'local', v)}
            />
            <TextField
              label="Extensão estimada"
              value={ponto.extensaoEstimada}
              onChangeText={(v) => updateAreaPonto(ponto.id, 'extensaoEstimada', v)}
            />
            <TextField
              label="Tipo"
              value={ponto.tipo}
              onChangeText={(v) => updateAreaPonto(ponto.id, 'tipo', v)}
            />
          </View>
        ))}

        <Divider />

        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>Representantes envolvidos</Text>
          <TouchableOpacity onPress={addRepresentante} style={styles.addRow}>
            <Ionicons name="add-circle" size={22} color={colors.teal} />
            <Text style={styles.addRowLabel}>Adicionar</Text>
          </TouchableOpacity>
        </View>
        {assessment.representantes.map((rep, index) => (
          <View key={rep.id} style={styles.subCard}>
            <View style={styles.rowBetween}>
              <Text style={styles.subCardTitle}>Representante {index + 1}</Text>
              <TouchableOpacity onPress={() => removeRepresentante(rep.id)}>
                <Ionicons name="trash-outline" size={18} color={colors.red} />
              </TouchableOpacity>
            </View>
            <TextField
              label="Empresa"
              value={rep.empresa}
              onChangeText={(v) => updateRepresentante(rep.id, 'empresa', v)}
            />
            <TextField
              label="Nome"
              value={rep.nome}
              onChangeText={(v) => updateRepresentante(rep.id, 'nome', v)}
            />
            <TextField
              label="Cargo"
              value={rep.cargo}
              onChangeText={(v) => updateRepresentante(rep.id, 'cargo', v)}
            />
          </View>
        ))}

        <Divider />

        <PhotoPickerRow
          photos={assessment.fotos}
          onAdd={(uri) =>
            patch({
              fotos: [...assessment.fotos, { id: uid(), uri, criadaEm: new Date().toISOString() }],
            })
          }
        />
      </ScrollView>
      <View style={styles.footer}>
        <PrimaryButton label="Enviar avaliação" disabled={!canSubmit} onPress={onSubmit} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.navy, marginBottom: spacing.sm },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  addRow: { flexDirection: 'row', alignItems: 'center' },
  addRowLabel: { color: colors.teal, fontWeight: '600', marginLeft: 4, fontSize: 13 },
  subCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  subCardTitle: { fontSize: 14, fontWeight: '700', color: colors.navy },
  footer: { padding: spacing.md },
});
