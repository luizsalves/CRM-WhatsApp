import { api } from "./api";
import type { CreateWhatsappContaPayload, WhatsappConta } from "../types/whatsapp";

export async function obterContaAtual(): Promise<WhatsappConta | null> {
  const { data } = await api.get<WhatsappConta | null>("/whatsapp-contas");
  return data;
}

export async function salvarConta(payload: CreateWhatsappContaPayload): Promise<WhatsappConta> {
  const { data } = await api.post<WhatsappConta>("/whatsapp-contas", payload);
  return data;
}
