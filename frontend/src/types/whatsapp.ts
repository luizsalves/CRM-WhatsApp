export interface WhatsappConta {
  id: string;
  phoneNumberId: string;
  wabaId: string;
  numeroExibicao: string;
  ativo: boolean;
  createdAt: string;
}

export interface CreateWhatsappContaPayload {
  phoneNumberId: string;
  wabaId: string;
  numeroExibicao: string;
  accessToken: string;
}
