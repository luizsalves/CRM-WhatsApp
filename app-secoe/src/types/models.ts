export type YesNo = 'sim' | 'nao' | null;
export type YesNoNA = 'sim' | 'nao' | 'nao_aplicavel' | null;

export interface SafetyDialogItem {
  id: number;
  text: string;
  answer: YesNo;
}

export interface DoubtsAnswer {
  answer: YesNo;
}

export interface AreaAfetadaPonto {
  id: string;
  local: string;
  extensaoEstimada: string;
  tipo: string;
}

export interface Representante {
  id: string;
  empresa: string;
  nome: string;
  cargo: string;
}

export interface EvidenciaFoto {
  id: string;
  uri: string;
  criadaEm: string;
}

export interface InitialAssessment {
  descricao: string;
  apresentaVazamento: YesNo;
  proximoRiosLagos: YesNo;
  vitimasFatais: YesNo;
  embarcador: { possui: YesNo; nome: string };
  transportador: { possui: YesNo; nome: string };
  destinatario: { possui: YesNo; nome: string };
  usoOcupacaoSolo: 'Teste' | 'Industrial' | 'Misto' | 'Rural' | 'Urbano' | null;
  fluidos: {
    oleoHidraulico: YesNo;
    oleoDieselCombustivel: YesNo;
    oleoLubrificanteMotor: YesNo;
  };
  areaAfetada: AreaAfetadaPonto[];
  representantes: Representante[];
  fotos: EvidenciaFoto[];
  enviado: boolean;
}

export type DeslocamentoTipo =
  | 'abertura_km_inicial'
  | 'chegada_emergencia'
  | 'saida_emergencia'
  | 'chegada_base';

export interface DeslocamentoMarco {
  tipo: DeslocamentoTipo;
  label: string;
  km: string | null;
  placa: string | null;
  dataHora: string | null;
  registrado: boolean;
}

export interface Atividade {
  id: string;
  descricao: string;
  fotos: EvidenciaFoto[];
  enviada: boolean;
  criadaEm: string;
}

export type LancamentoCategoria =
  | 'Equipamentos de monitoramento'
  | 'Equipamentos de transbordo'
  | 'Serviços adicionais';

export interface Lancamento {
  id: string;
  categoria: LancamentoCategoria;
  item: string;
  unidade: string;
  quantidade: string;
  descartado: YesNo;
  placa: string;
  criadaEm: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  answer: YesNoNA;
  observacao: string;
  observacaoAtiva: boolean;
}

export interface ChecklistSection {
  id: string;
  titulo: string;
  itens: ChecklistItem[];
}

export interface OccurrenceState {
  idSiga: string;
  sapId: string;
  data: string;
  tipoOcorrencia: string;
  cliente: string;
  estado: string;
  produto: string;
  liderCampo: string;
  operador: string;
  vitimaFatalResumo: YesNo;
  proximoRiosLagosResumo: YesNo;
  cenario: string;
  viatura: string;
  status: 'nao_inicializado' | 'em_campo' | 'finalizado';

  souMotorista: boolean;
  emergenciaIniciada: boolean;
  placa: string;
  kmInicial: string;

  dialogoSeguranca: SafetyDialogItem[];
  duvidas: YesNo;

  avaliacaoInicial: InitialAssessment;

  deslocamentos: DeslocamentoMarco[];

  atividades: Atividade[];

  lancamentos: Lancamento[];

  assinatura: string | null;
  osFinalizadaDia: boolean;

  motoristaFinalizacao: YesNo;
  placaFinalizacao: string;
  checklist: ChecklistSection[];

  emergenciaFinalizada: boolean;
}
