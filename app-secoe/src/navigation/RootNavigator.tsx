import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { RootStackParamList } from './types';
import { MainTabs } from './MainTabs';
import { EmergencyResumeScreen } from '../screens/EmergencyResumeScreen';
import { SafetyDialogScreen } from '../screens/SafetyDialogScreen';
import { PlateKmOperatorScreen } from '../screens/PlateKmOperatorScreen';
import { StartedSuccessScreen } from '../screens/StartedSuccessScreen';
import { EmergencyPanelScreen } from '../screens/EmergencyPanelScreen';
import { IniciarOsScreen } from '../screens/IniciarOsScreen';
import { InitialAssessmentScreen } from '../screens/InitialAssessmentScreen';
import { AssessmentSuccessScreen } from '../screens/AssessmentSuccessScreen';
import { DeslocamentoScreen } from '../screens/DeslocamentoScreen';
import { AtividadesScreen } from '../screens/AtividadesScreen';
import { LancamentosScreen } from '../screens/LancamentosScreen';
import { LancamentoCategoriaScreen } from '../screens/LancamentoCategoriaScreen';
import { ResumoAssinaturaScreen } from '../screens/ResumoAssinaturaScreen';
import { RecursosScreen } from '../screens/RecursosScreen';
import { FinalizarEmergenciaScreen } from '../screens/FinalizarEmergenciaScreen';
import { VehicleChecklistScreen } from '../screens/VehicleChecklistScreen';
import { EmergencyFinishedSuccessScreen } from '../screens/EmergencyFinishedSuccessScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={MainTabs} />
      <Stack.Screen name="EmergencyResume" component={EmergencyResumeScreen} />
      <Stack.Screen name="SafetyDialog" component={SafetyDialogScreen} />
      <Stack.Screen name="PlateKmOperator" component={PlateKmOperatorScreen} />
      <Stack.Screen name="StartedSuccess" component={StartedSuccessScreen} />
      <Stack.Screen name="EmergencyPanel" component={EmergencyPanelScreen} />
      <Stack.Screen name="IniciarOs" component={IniciarOsScreen} />
      <Stack.Screen name="InitialAssessment" component={InitialAssessmentScreen} />
      <Stack.Screen name="AssessmentSuccess" component={AssessmentSuccessScreen} />
      <Stack.Screen name="Deslocamento" component={DeslocamentoScreen} />
      <Stack.Screen name="Atividades" component={AtividadesScreen} />
      <Stack.Screen name="Lancamentos" component={LancamentosScreen} />
      <Stack.Screen name="LancamentoCategoria" component={LancamentoCategoriaScreen} />
      <Stack.Screen name="ResumoAssinatura" component={ResumoAssinaturaScreen} />
      <Stack.Screen name="Recursos" component={RecursosScreen} />
      <Stack.Screen name="FinalizarEmergencia" component={FinalizarEmergenciaScreen} />
      <Stack.Screen name="VehicleChecklist" component={VehicleChecklistScreen} />
      <Stack.Screen name="EmergencyFinishedSuccess" component={EmergencyFinishedSuccessScreen} />
    </Stack.Navigator>
  );
}
