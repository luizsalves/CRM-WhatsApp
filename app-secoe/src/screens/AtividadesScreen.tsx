import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PhotoPickerRow } from '../components/PhotoPickerRow';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { TextField } from '../components/TextField';
import { useOccurrence } from '../context/OccurrenceContext';
import { EvidenciaFoto } from '../types/models';
import { colors, radius, spacing } from '../theme/colors';

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function AtividadesScreen() {
  const { state, dispatch } = useOccurrence();
  const [descricao, setDescricao] = useState('');
  const [fotos, setFotos] = useState<EvidenciaFoto[]>([]);

  const submit = () => {
    dispatch({
      type: 'ADD_ATIVIDADE',
      atividade: {
        id: uid(),
        descricao,
        fotos,
        enviada: true,
        criadaEm: new Date().toISOString(),
      },
    });
    setDescricao('');
    setFotos([]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title="Descrição das atividades" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Nova atividade</Text>
        <TextField
          placeholder="Descreva a atividade realizada"
          value={descricao}
          onChangeText={setDescricao}
          multiline
        />
        <PhotoPickerRow
          photos={fotos}
          onAdd={(uri) => setFotos((prev) => [...prev, { id: uid(), uri, criadaEm: new Date().toISOString() }])}
        />
        <PrimaryButton
          label="Enviar atividade"
          disabled={!descricao.trim()}
          onPress={submit}
          style={styles.submitButton}
        />

        {state.atividades.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>Atividades registradas</Text>
            {state.atividades.map((atividade, index) => (
              <View key={atividade.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>Atividade {index + 1}</Text>
                  <Ionicons name="checkmark-circle" size={18} color={colors.teal} />
                </View>
                <Text style={styles.cardDescription}>{atividade.descricao}</Text>
                {atividade.fotos.length > 0 ? (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosRow}>
                    {atividade.fotos.map((foto) => (
                      <Image key={foto.id} source={{ uri: foto.uri }} style={styles.thumb} />
                    ))}
                  </ScrollView>
                ) : null}
              </View>
            ))}
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.navy, marginTop: spacing.md, marginBottom: spacing.sm },
  submitButton: { marginTop: spacing.sm },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  cardTitle: { fontSize: 14, fontWeight: '700', color: colors.navy },
  cardDescription: { fontSize: 14, color: colors.text, marginBottom: spacing.sm },
  photosRow: { marginTop: spacing.xs },
  thumb: { width: 60, height: 60, borderRadius: radius.sm, marginRight: spacing.sm },
});
