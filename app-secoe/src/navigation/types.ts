import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList> | undefined;
  EmergencyResume: undefined;
  SafetyDialog: undefined;
  PlateKmOperator: undefined;
  StartedSuccess: undefined;
  EmergencyPanel: undefined;
  IniciarOs: undefined;
  InitialAssessment: undefined;
  AssessmentSuccess: undefined;
  Deslocamento: undefined;
  Atividades: undefined;
  Lancamentos: undefined;
  LancamentoCategoria: { categoria: string };
  ResumoAssinatura: undefined;
  Recursos: undefined;
  FinalizarEmergencia: undefined;
  VehicleChecklist: undefined;
  EmergencyFinishedSuccess: undefined;
};

export type TabParamList = {
  NovasEmergencias: undefined;
  EmCampo: undefined;
  AtendimentosProgramados: undefined;
  Finalizados: undefined;
};
