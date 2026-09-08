import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { SuccessScreen } from '../components/SuccessScreen';
import { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'EmergencyFinishedSuccess'>;

export function EmergencyFinishedSuccessScreen() {
  const navigation = useNavigation<Nav>();
  return (
    <SuccessScreen
      message="Emergência finalizada com sucesso!"
      detail="Ao final do serviço, a viatura deve estar com os reservatórios completos (combustível, água, óleos lubrificante e hidráulico e demais fluidos)."
      buttonLabel="Ir para atendimentos finalizados"
      onContinue={() =>
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'Tabs',
              state: { routes: [{ name: 'Finalizados' }] },
            },
          ],
        })
      }
    />
  );
}
