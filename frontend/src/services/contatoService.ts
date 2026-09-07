import { api } from "./api";
import type { Contato, CreateContatoPayload, PagedResult, Tag } from "../types/contato";

export async function listarContatos(busca: string, pagina = 1): Promise<PagedResult<Contato>> {
  const { data } = await api.get<PagedResult<Contato>>("/contatos", { params: { busca, pagina, tamanhoPagina: 20 } });
  return data;
}

export async function criarContato(payload: CreateContatoPayload): Promise<Contato> {
  const { data } = await api.post<Contato>("/contatos", payload);
  return data;
}

export async function atualizarContato(id: string, payload: CreateContatoPayload): Promise<Contato> {
  const { data } = await api.put<Contato>(`/contatos/${id}`, payload);
  return data;
}

export async function excluirContato(id: string): Promise<void> {
  await api.delete(`/contatos/${id}`);
}

export async function adicionarTag(contatoId: string, tagId: string): Promise<Contato> {
  const { data } = await api.post<Contato>(`/contatos/${contatoId}/tags/${tagId}`);
  return data;
}

export async function removerTag(contatoId: string, tagId: string): Promise<Contato> {
  const { data } = await api.delete<Contato>(`/contatos/${contatoId}/tags/${tagId}`);
  return data;
}

export async function listarTags(): Promise<Tag[]> {
  const { data } = await api.get<Tag[]>("/tags");
  return data;
}

export async function criarTag(nome: string, cor: string): Promise<Tag> {
  const { data } = await api.post<Tag>("/tags", { nome, cor });
  return data;
}
