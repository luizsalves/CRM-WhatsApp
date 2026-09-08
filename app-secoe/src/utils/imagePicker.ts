import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

export async function pickPhoto(source: 'camera' | 'library'): Promise<string | null> {
  const permission =
    source === 'camera'
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    Alert.alert(
      'Permissão necessária',
      'Permita o acesso à câmera/galeria para anexar fotos e vídeos ao app Siga.'
    );
    return null;
  }

  const result =
    source === 'camera'
      ? await ImagePicker.launchCameraAsync({ quality: 0.7 })
      : await ImagePicker.launchImageLibraryAsync({ quality: 0.7 });

  if (result.canceled || !result.assets?.length) {
    return null;
  }
  return result.assets[0].uri;
}
