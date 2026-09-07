export interface Tag {
  id: string;
  nome: string;
  cor: string;
}

export interface Contato {
  id: string;
  nome: string;
  telefone: string;
  email: string | null;
  dataNascimento: string | null;
  empresaNome: string | null;
  observacoes: string | null;
  responsavelUsuarioId: string | null;
  tags: Tag[];
  createdAt: string;
}

export interface CreateContatoPayload {
  nome: string;
  telefone: string;
  email?: string;
  dataNascimento?: string;
  empresaNome?: string;
  observacoes?: string;
  responsavelUsuarioId?: string;
}

export interface PagedResult<T> {
  itens: T[];
  pagina: number;
  tamanhoPagina: number;
  total: number;
}
