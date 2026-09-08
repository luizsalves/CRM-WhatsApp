import { ChecklistSection, OccurrenceState, SafetyDialogItem } from '../types/models';

export const SAFETY_DIALOG_ITEMS: SafetyDialogItem[] = [
  { id: 1, text: 'Obedecer as normas de trânsito;', answer: null },
  {
    id: 2,
    text: 'Veículo em boas condições? Freio, Farol, Pneus, Água e Óleo?',
    answer: null,
  },
  {
    id: 3,
    text: 'Para distâncias acima de 200 quilômetros, fazer uma parada de 15 minutos para descansar e verificar condições do veículo.',
    answer: null,
  },
  { id: 4, text: 'Isole a área com cones e fitas;', answer: null },
  {
    id: 5,
    text: 'Analise a ficha de emergência do produto e verifique os riscos;',
    answer: null,
  },
  {
    id: 6,
    text: 'Na avaliação de cenário deve-se utilizar monitor multigases;',
    answer: null,
  },
  {
    id: 7,
    text: 'Em caso de dúvidas na avaliação, contate o CECOE para avaliação com o coordenador de plantão;',
    answer: null,
  },
  { id: 8, text: 'Verifique se possui os EPIs adequados;', answer: null },
  {
    id: 9,
    text: 'Preencher a RG.SO.14 — APT — Análise Preliminar de Tarefa, colhendo a assinatura de todos;',
    answer: null,
  },
  {
    id: 10,
    text: 'Se houver transbordo, fazer o aterramento dos equipamentos e tanques, com medição abaixo de 25 ohms;',
    answer: null,
  },
  {
    id: 11,
    text: 'Em contaminação de curso hídrico, instalar barreiras de contenção e/ou absorção;',
    answer: null,
  },
  {
    id: 12,
    text: 'Confirme que os equipamentos estão adequados e em ordem para a emergência;',
    answer: null,
  },
  {
    id: 13,
    text: 'Ao contratar ajudantes, divulgar a RG.SO.20 — Termo de Compromisso EPI para Contratados;',
    answer: null,
  },
  {
    id: 14,
    text: 'Não realizar manobras fora dos procedimentos ou para as quais não foi capacitado;',
    answer: null,
  },
  {
    id: 15,
    text: 'Acione o CECOE em caso de acidente para abertura de PEC;',
    answer: null,
  },
  { id: 16, text: 'Destine os resíduos adequadamente;', answer: null },
  {
    id: 17,
    text: 'Não leve resíduos para casa ou para o local de trabalho/base;',
    answer: null,
  },
  { id: 18, text: 'Você tem dúvidas quanto aos procedimentos acima?', answer: null },
];

function checklistItem(id: string, label: string) {
  return { id, label, answer: null, observacao: '', observacaoAtiva: false };
}

export const VEHICLE_CHECKLIST: ChecklistSection[] = [
  {
    id: 'estado_geral',
    titulo: 'Estado Geral',
    itens: [
      checklistItem('eg_1', 'Conservação do veículo (corrosão, amassado etc.)'),
      checklistItem('eg_2', 'Faixas refletivas'),
      checklistItem('eg_3', 'Placas'),
      checklistItem('eg_4', 'Trincas e vazamentos'),
      checklistItem('eg_5', 'Caixa de EPI'),
      checklistItem('eg_6', 'Equipamentos descontaminados'),
    ],
  },
  {
    id: 'equipamentos_seguranca',
    titulo: 'Equipamentos Obrigatórios de Segurança',
    itens: [
      checklistItem('es_1', 'Documentação'),
      checklistItem('es_2', 'Buzina'),
      checklistItem('es_3', 'Limpador de para-brisa'),
      checklistItem('es_4', 'Alarme sonoro'),
      checklistItem('es_5', 'Cinto de segurança'),
      checklistItem('es_6', 'Disco de tacógrafo'),
      checklistItem('es_7', 'Extintores'),
      checklistItem('es_8', 'Macaco'),
      checklistItem('es_9', 'Triângulo'),
      checklistItem('es_10', 'Chave de roda'),
    ],
  },
  {
    id: 'fluidos',
    titulo: 'Fluidos',
    itens: [
      checklistItem('fl_1', 'Combustível'),
      checklistItem('fl_2', 'Nível de água'),
      checklistItem('fl_3', 'Nível de óleo'),
      checklistItem('fl_4', 'Fluido de freio'),
      checklistItem('fl_5', 'Fluido de embreagem'),
      checklistItem('fl_6', 'Água do reservatório'),
    ],
  },
  {
    id: 'instalacao_eletrica',
    titulo: 'Instalação Elétrica',
    itens: [
      checklistItem('ie_1', 'Bateria'),
      checklistItem('ie_2', 'Chave geral'),
      checklistItem('ie_3', 'Fiação'),
      checklistItem('ie_4', 'Iluminação'),
      checklistItem('ie_5', 'Faróis alto/baixo'),
      checklistItem('ie_6', 'Lanternas'),
      checklistItem('ie_7', 'Luzes de freio e ré'),
      checklistItem('ie_8', 'Setas e pisca-alerta'),
    ],
  },
  {
    id: 'rodante',
    titulo: 'Rodante',
    itens: [
      checklistItem('rd_1', 'Suspensão'),
      checklistItem('rd_2', 'Freios'),
      checklistItem('rd_3', 'Pneus'),
      checklistItem('rd_4', 'Estepe'),
      checklistItem('rd_5', 'Para-barro'),
      checklistItem('rd_6', 'Calços'),
      checklistItem('rd_7', 'Gases de escape/fumaça preta'),
    ],
  },
];

export const DESLOCAMENTO_LABELS: Record<string, string> = {
  abertura_km_inicial: 'Abertura de KM inicial',
  chegada_emergencia: 'Chegada na emergência',
  saida_emergencia: 'Saída da emergência',
  chegada_base: 'Chegada na base',
};

export function createInitialOccurrence(): OccurrenceState {
  return {
    idSiga: '0462',
    sapId: '159501',
    data: '06/12/2024',
    tipoOcorrencia: 'Incêndio',
    cliente: 'AMBIPAR RESPONSE SA',
    estado: 'Bahia',
    produto: 'DESTILADOS DE PETRÓLEO N.E. ou DERIVADOS DE PETRÓLEO N.E.',
    liderCampo: 'DARIO SOUZA DE OLIVEIRA',
    operador: 'DARIO SOUZA DE OLIVEIRA',
    vitimaFatalResumo: 'nao',
    proximoRiosLagosResumo: 'nao',
    cenario: '4',
    viatura: 'GJL6A11',
    status: 'nao_inicializado',

    souMotorista: false,
    emergenciaIniciada: false,
    placa: '',
    kmInicial: '',

    dialogoSeguranca: SAFETY_DIALOG_ITEMS.map((item) => ({ ...item })),
    duvidas: null,

    avaliacaoInicial: {
      descricao: '',
      apresentaVazamento: null,
      proximoRiosLagos: null,
      vitimasFatais: null,
      embarcador: { possui: null, nome: '' },
      transportador: { possui: null, nome: '' },
      destinatario: { possui: null, nome: '' },
      usoOcupacaoSolo: null,
      fluidos: {
        oleoHidraulico: null,
        oleoDieselCombustivel: null,
        oleoLubrificanteMotor: null,
      },
      areaAfetada: [],
      representantes: [],
      fotos: [],
      enviado: false,
    },

    deslocamentos: [
      {
        tipo: 'abertura_km_inicial',
        label: DESLOCAMENTO_LABELS.abertura_km_inicial,
        km: null,
        placa: null,
        dataHora: null,
        registrado: false,
      },
      {
        tipo: 'chegada_emergencia',
        label: DESLOCAMENTO_LABELS.chegada_emergencia,
        km: null,
        placa: null,
        dataHora: null,
        registrado: false,
      },
      {
        tipo: 'saida_emergencia',
        label: DESLOCAMENTO_LABELS.saida_emergencia,
        km: null,
        placa: null,
        dataHora: null,
        registrado: false,
      },
      {
        tipo: 'chegada_base',
        label: DESLOCAMENTO_LABELS.chegada_base,
        km: null,
        placa: null,
        dataHora: null,
        registrado: false,
      },
    ],

    atividades: [],
    lancamentos: [],

    assinatura: null,
    osFinalizadaDia: false,

    motoristaFinalizacao: null,
    placaFinalizacao: '',
    checklist: VEHICLE_CHECKLIST.map((section) => ({
      ...section,
      itens: section.itens.map((item) => ({ ...item })),
    })),

    emergenciaFinalizada: false,
  };
}

export const LANCAMENTO_ITEMS: Record<string, string[]> = {
  'Equipamentos de monitoramento': [
    'Analisador de Gases Específicos',
    'Explosímetro',
    'Detector de PH',
    'Termômetro Infravermelho',
  ],
  'Equipamentos de transbordo': [
    'Conjunto para Transferência Classe 3',
    'Bomba Pneumática',
    'Mangote de Transferência',
    'Tanque Flexível',
  ],
  'Serviços adicionais': [
    'Descontaminação dos Equipamentos',
    'Destinação de Resíduos',
    'Locação de Equipamentos',
    'Apoio de Terceiros',
  ],
};

export const UNIDADES = ['Un.', 'Cx.', 'Kg', 'L', 'M²'];
