import { isAxiosError } from "axios";

/** Extrai uma mensagem amigável de um erro retornado pela API (mensagem única ou erros de validação). */
export function extrairMensagemErro(erro: unknown, mensagemPadrao: string): string {
  if (isAxiosError(erro)) {
    const dados = erro.response?.data;

    if (typeof dados?.mensagem === "string") {
      return dados.mensagem;
    }

    if (dados?.errors && typeof dados.errors === "object") {
      const primeiraChave = Object.keys(dados.errors)[0];
      const mensagens = dados.errors[primeiraChave];
      if (Array.isArray(mensagens) && mensagens.length > 0) {
        return mensagens[0];
      }
    }
  }

  return mensagemPadrao;
}
