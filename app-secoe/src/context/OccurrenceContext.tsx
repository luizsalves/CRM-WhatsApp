import React, { createContext, useContext, useMemo, useReducer } from 'react';
import { createInitialOccurrence } from '../data/initialOccurrence';
import {
  Atividade,
  ChecklistItem,
  DeslocamentoTipo,
  InitialAssessment,
  Lancamento,
  OccurrenceState,
  YesNo,
} from '../types/models';

type Action =
  | { type: 'SET_SOU_MOTORISTA'; value: boolean }
  | { type: 'ANSWER_DIALOG_ITEM'; id: number; answer: YesNo }
  | { type: 'SET_DUVIDAS'; answer: YesNo }
  | { type: 'SET_PLACA'; placa: string }
  | { type: 'SET_KM_INICIAL'; km: string }
  | { type: 'START_EMERGENCY' }
  | { type: 'UPDATE_ASSESSMENT'; patch: Partial<InitialAssessment> }
  | { type: 'SUBMIT_ASSESSMENT' }
  | {
      type: 'REGISTER_DESLOCAMENTO';
      tipo: DeslocamentoTipo;
      km: string;
      placa: string;
    }
  | { type: 'ADD_ATIVIDADE'; atividade: Atividade }
  | { type: 'ADD_ATIVIDADE_FOTO'; id: string; uri: string }
  | { type: 'ADD_LANCAMENTO'; lancamento: Lancamento }
  | { type: 'SET_ASSINATURA'; assinatura: string | null }
  | { type: 'FINALIZAR_OS_DIA' }
  | { type: 'SET_MOTORISTA_FINALIZACAO'; answer: YesNo }
  | { type: 'SET_PLACA_FINALIZACAO'; placa: string }
  | {
      type: 'UPDATE_CHECKLIST_ITEM';
      sectionId: string;
      itemId: string;
      patch: Partial<ChecklistItem>;
    }
  | { type: 'FINALIZAR_EMERGENCIA' }
  | { type: 'RESET' };

function reducer(state: OccurrenceState, action: Action): OccurrenceState {
  switch (action.type) {
    case 'SET_SOU_MOTORISTA':
      return { ...state, souMotorista: action.value };
    case 'ANSWER_DIALOG_ITEM':
      return {
        ...state,
        dialogoSeguranca: state.dialogoSeguranca.map((item) =>
          item.id === action.id ? { ...item, answer: action.answer } : item
        ),
      };
    case 'SET_DUVIDAS':
      return { ...state, duvidas: action.answer };
    case 'SET_PLACA':
      return { ...state, placa: action.placa };
    case 'SET_KM_INICIAL':
      return { ...state, kmInicial: action.km };
    case 'START_EMERGENCY':
      return {
        ...state,
        emergenciaIniciada: true,
        status: 'em_campo',
        deslocamentos: state.deslocamentos.map((marco) =>
          marco.tipo === 'abertura_km_inicial'
            ? {
                ...marco,
                km: state.kmInicial,
                placa: state.placa,
                dataHora: new Date().toISOString(),
                registrado: true,
              }
            : marco
        ),
      };
    case 'UPDATE_ASSESSMENT':
      return {
        ...state,
        avaliacaoInicial: { ...state.avaliacaoInicial, ...action.patch },
      };
    case 'SUBMIT_ASSESSMENT':
      return {
        ...state,
        avaliacaoInicial: { ...state.avaliacaoInicial, enviado: true },
      };
    case 'REGISTER_DESLOCAMENTO':
      return {
        ...state,
        deslocamentos: state.deslocamentos.map((marco) =>
          marco.tipo === action.tipo
            ? {
                ...marco,
                km: action.km,
                placa: action.placa,
                dataHora: new Date().toISOString(),
                registrado: true,
              }
            : marco
        ),
      };
    case 'ADD_ATIVIDADE':
      return { ...state, atividades: [...state.atividades, action.atividade] };
    case 'ADD_ATIVIDADE_FOTO':
      return {
        ...state,
        atividades: state.atividades.map((atividade) =>
          atividade.id === action.id
            ? {
                ...atividade,
                fotos: [
                  ...atividade.fotos,
                  { id: `${action.id}-${Date.now()}`, uri: action.uri, criadaEm: new Date().toISOString() },
                ],
              }
            : atividade
        ),
      };
    case 'ADD_LANCAMENTO':
      return { ...state, lancamentos: [...state.lancamentos, action.lancamento] };
    case 'SET_ASSINATURA':
      return { ...state, assinatura: action.assinatura };
    case 'FINALIZAR_OS_DIA':
      return { ...state, osFinalizadaDia: true };
    case 'SET_MOTORISTA_FINALIZACAO':
      return { ...state, motoristaFinalizacao: action.answer };
    case 'SET_PLACA_FINALIZACAO':
      return { ...state, placaFinalizacao: action.placa };
    case 'UPDATE_CHECKLIST_ITEM':
      return {
        ...state,
        checklist: state.checklist.map((section) =>
          section.id === action.sectionId
            ? {
                ...section,
                itens: section.itens.map((item) =>
                  item.id === action.itemId ? { ...item, ...action.patch } : item
                ),
              }
            : section
        ),
      };
    case 'FINALIZAR_EMERGENCIA':
      return { ...state, emergenciaFinalizada: true, status: 'finalizado' };
    case 'RESET':
      return createInitialOccurrence();
    default:
      return state;
  }
}

interface OccurrenceContextValue {
  state: OccurrenceState;
  dispatch: React.Dispatch<Action>;
}

const OccurrenceContext = createContext<OccurrenceContextValue | undefined>(undefined);

export function OccurrenceProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialOccurrence);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <OccurrenceContext.Provider value={value}>{children}</OccurrenceContext.Provider>;
}

export function useOccurrence() {
  const ctx = useContext(OccurrenceContext);
  if (!ctx) {
    throw new Error('useOccurrence must be used within an OccurrenceProvider');
  }
  return ctx;
}
