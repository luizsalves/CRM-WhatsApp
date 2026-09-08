import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, radius, spacing } from '../theme/colors';
import { pickPhoto } from '../utils/imagePicker';

interface Props {
  photos: { id: string; uri: string }[];
  onAdd: (uri: string) => void;
  label?: string;
}

export function PhotoPickerRow({ photos, onAdd, label = 'Anexar evidência' }: Props) {
  const openPicker = () => {
    Alert.alert('Escolher uma ação', undefined, [
      {
        text: 'Câmera',
        onPress: async () => {
          const uri = await pickPhoto('camera');
          if (uri) onAdd(uri);
        },
      },
      {
        text: 'Galeria',
        onPress: async () => {
          const uri = await pickPhoto('library');
          if (uri) onAdd(uri);
        },
      },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {photos.map((photo) => (
          <Image key={photo.id} source={{ uri: photo.uri }} style={styles.thumb} />
        ))}
        <TouchableOpacity style={styles.addButton} onPress={openPicker}>
          <Ionicons name="camera" size={24} color={colors.navy} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.md },
  label: { fontSize: 14, color: colors.textMuted, marginBottom: spacing.sm },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: radius.md,
    marginRight: spacing.sm,
  },
  addButton: {
    width: 72,
    height: 72,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
