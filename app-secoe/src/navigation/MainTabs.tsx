import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { TabParamList } from './types';
import { NovasEmergenciasScreen } from '../screens/tabs/NovasEmergenciasScreen';
import { EmCampoScreen } from '../screens/tabs/EmCampoScreen';
import { AtendimentosProgramadosScreen } from '../screens/tabs/AtendimentosProgramadosScreen';
import { FinalizadosScreen } from '../screens/tabs/FinalizadosScreen';

const Tab = createBottomTabNavigator<TabParamList>();

export function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}>
      <Tab.Screen name="NovasEmergencias" component={NovasEmergenciasScreen} />
      <Tab.Screen name="EmCampo" component={EmCampoScreen} />
      <Tab.Screen name="AtendimentosProgramados" component={AtendimentosProgramadosScreen} />
      <Tab.Screen name="Finalizados" component={FinalizadosScreen} />
    </Tab.Navigator>
  );
}
