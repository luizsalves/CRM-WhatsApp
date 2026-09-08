import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import {
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ChipGroup } from '../components/ChipGroup';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { TextField } from '../components/TextField';
import { YesNoField } from '../components/YesNoField';
import { LANCAMENTO_ITEMS, UNIDADES } from '../data/initialOccurrence';
import { useOccurrence } from '../context/OccurrenceContext';
import { RootStackParamList } from '../navigation/types';
import { LancamentoCategoria, YesNo } from '../types/models';
import { colors, radius, spacing } from '../theme/colors';

type Nav = NativeStackNavigationProp<RootStackParamList, 'LancamentoCategoria'>;
type Rt = RouteProp<RootStackParamList, 'LancamentoCategoria'>;

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function LancamentoCategoriaScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Rt>();
  const categoria = route.params.categoria as LancamentoCategoria;
  const { state, dispatch } = useOccurrence();

  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [unidade, setUnidade] = useState(UNIDADES[0]);
  const [quantidade, setQuantidade] = useState('1');
  const [descartado, setDescartado] = useState<YesNo>(null);
  const [placa, setPlaca] = useState(state.placa);

  const items = LANCAMENTO_ITEMS[categoria] ?? [];
  const filtered = useMemo(
    () => items.filter((item) => item.toLowerCase().includes(search.toLowerCase())),
    [items, search]
  );

  const openItem = (item: string) => {
    setSelectedItem(item);
    setUnidade(UNIDADES[0]);
    setQuantidade('1');
    setDescartado(null);
    setPlaca(state.placa);
  };

  const confirm = () => {
    if (!selectedItem) return;
    dispatch({
      type: 'ADD_LANCAMENTO',
      lancamento: {
        id: uid(),
        categoria,
        item: selectedItem,
        unidade,
        quantidade,
        descartado,
        placa,
        criadaEm: new Date().toISOString(),
      },
    });
    setSelectedItem(null);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title={categoria} />
      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color={colors.textMuted} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar item"
          placeholderTextColor={colors.placeholder}
          style={styles.searchInput}
        />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {filtered.map((item) => (
          <TouchableOpacity key={item} style={styles.itemRow} onPress={() => openItem(item)}>
            <Text style={styles.itemText}>{item}</Text>
            <Ionicons name="add-circle-outline" size={22} color={colors.teal} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal visible={!!selectedItem} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <ScrollView style={styles.modalCard} contentContainerStyle={{ paddingBottom: spacing.lg }}>
            <Text style={styles.modalTitle}>{selectedItem}</Text>

            <Text style={styles.fieldLabel}>Unidade</Text>
            <ChipGroup options={UNIDADES} value={unidade} onChange={setUnidade} />

            <TextField
              label="Quantidade"
              value={quantidade}
              onChangeText={setQuantidade}
              keyboardType="numeric"
            />

            <YesNoField question="Descartado?" value={descartado} onChange={setDescartado} />

            <TextField
              label="Placa"
              value={placa}
              onChangeText={setPlaca}
              autoCapitalize="characters"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setSelectedItem(null)} style={styles.cancelButton}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <PrimaryButton
                label="Confirmar"
                disabled={!quantidade}
                onPress={confirm}
                style={styles.confirmButton}
              />
            </View>
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  searchInput: { flex: 1, paddingVertical: spacing.sm + 2, marginLeft: spacing.sm, color: colors.text },
  content: { paddingHorizontal: spacing.md, paddingBottom: spacing.xl },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  itemText: { fontSize: 14, color: colors.text, flex: 1, marginRight: spacing.sm },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.lg,
    maxHeight: '85%',
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: colors.navy, marginBottom: spacing.md },
  fieldLabel: { fontSize: 14, color: colors.textMuted, marginBottom: spacing.sm },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: spacing.sm },
  cancelButton: { justifyContent: 'center', paddingHorizontal: spacing.md },
  cancelText: { color: colors.textMuted, fontWeight: '600' },
  confirmButton: { minWidth: 140 },
});
