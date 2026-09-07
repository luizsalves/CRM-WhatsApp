export type StatusConversa = "ABERTA" | "PENDENTE" | "RESOLVIDA";
export type DirecaoMensagem = "ENTRADA" | "SAIDA";
export type StatusMensagem = "ENVIANDO" | "ENVIADA" | "ENTREGUE" | "LIDA" | "FALHOU" | "RECEBIDA";

export interface ContatoResumo {
  id: string;
  nome: string;
  telefone: string;
}

export interface Conversa {
  id: string;
  contato: ContatoResumo;
  responsavelUsuarioId: string | null;
  status: StatusConversa;
  ultimaMensagemEm: string;
  ultimaMensagemTexto: string | null;
  quantidadeNaoLidas: number;
}

export interface Mensagem {
  id: string;
  conversaId: string;
  direcao: DirecaoMensagem;
  tipo: string;
  texto: string | null;
  status: StatusMensagem;
  enviadaEm: string | null;
  recebidaEm: string | null;
  createdAt: string;
}
