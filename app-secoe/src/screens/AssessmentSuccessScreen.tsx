import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { SuccessScreen } from '../components/SuccessScreen';
import { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'AssessmentSuccess'>;

export function AssessmentSuccessScreen() {
  const navigation = useNavigation<Nav>();
  return (
    <SuccessScreen
      message="Avaliação inicial do cenário enviada com sucesso!"
      buttonLabel="Voltar para Iniciar OS"
      onContinue={() => navigation.replace('IniciarOs')}
    />
  );
}
