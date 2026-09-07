import { api } from "./api";
import type { Conversa, Mensagem } from "../types/conversa";
import type { PagedResult } from "../types/contato";

export async function listarConversas(): Promise<PagedResult<Conversa>> {
  const { data } = await api.get<PagedResult<Conversa>>("/conversas", { params: { tamanhoPagina: 50 } });
  return data;
}

export async function listarMensagens(conversaId: string): Promise<PagedResult<Mensagem>> {
  const { data } = await api.get<PagedResult<Mensagem>>(`/conversas/${conversaId}/mensagens`, {
    params: { tamanhoPagina: 100 }
  });
  return data;
}

export async function enviarMensagem(conversaId: string, texto: string): Promise<Mensagem> {
  const { data } = await api.post<Mensagem>(`/conversas/${conversaId}/mensagens`, { texto });
  return data;
}
