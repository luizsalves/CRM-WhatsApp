import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { SuccessScreen } from '../components/SuccessScreen';
import { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'StartedSuccess'>;

export function StartedSuccessScreen() {
  const navigation = useNavigation<Nav>();
  return (
    <SuccessScreen
      message="Emergência iniciada com sucesso!"
      buttonLabel="Ir para o painel da emergência"
      onContinue={() => navigation.replace('EmergencyPanel')}
    />
  );
}
