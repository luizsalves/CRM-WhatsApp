import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { obterContaAtual, salvarConta } from "../../services/whatsappContaService";
import type { CreateWhatsappContaPayload, WhatsappConta } from "../../types/whatsapp";
import { extrairMensagemErro } from "../../utils/apiError";
import "./Settings.css";

const FORM_VAZIO: CreateWhatsappContaPayload = {
  phoneNumberId: "",
  wabaId: "",
  numeroExibicao: "",
  accessToken: ""
};

export function Settings() {
  const [contaAtual, setContaAtual] = useState<WhatsappConta | null>(null);
  const [form, setForm] = useState<CreateWhatsappContaPayload>(FORM_VAZIO);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);

  useEffect(() => {
    obterContaAtual()
      .then((conta) => {
        setContaAtual(conta);
        if (conta) {
          setForm({ phoneNumberId: conta.phoneNumberId, wabaId: conta.wabaId, numeroExibicao: conta.numeroExibicao, accessToken: "" });
        }
      })
      .catch(() => setErro("Não foi possível carregar a configuração atual."))
      .finally(() => setCarregando(false));
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErro(null);
    setSucesso(false);
    setSalvando(true);

    try {
      const conta = await salvarConta(form);
      setContaAtual(conta);
      setSucesso(true);
    } catch (error) {
      setErro(extrairMensagemErro(error, "Não foi possível salvar a conexão com o WhatsApp."));
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return <p>Carregando...</p>;
  }

  return (
    <div>
      <h1>Configurações</h1>
      <h2>Conexão com o WhatsApp</h2>

      {contaAtual && (
        <p className="whatsapp-status">
          ✅ Conectado — <strong>{contaAtual.numeroExibicao}</strong>
        </p>
      )}

      <p className="whatsapp-ajuda">
        Encontre esses valores em{" "}
        <a href="https://developers.facebook.com/apps" target="_blank" rel="noreferrer">
          developers.facebook.com/apps
        </a>{" "}
        → seu App → WhatsApp → Configuração da API.
      </p>

      {erro && <div className="auth-erro">{erro}</div>}
      {sucesso && <div className="whatsapp-sucesso">Conexão salva com sucesso.</div>}

      <form onSubmit={handleSubmit} noValidate className="whatsapp-form">
        <div className="campo">
          <label htmlFor="phoneNumberId">Phone Number ID</label>
          <input
            id="phoneNumberId"
            required
            value={form.phoneNumberId}
            onChange={(e) => setForm({ ...form, phoneNumberId: e.target.value })}
          />
        </div>
        <div className="campo">
          <label htmlFor="wabaId">WhatsApp Business Account ID (WABA ID)</label>
          <input id="wabaId" required value={form.wabaId} onChange={(e) => setForm({ ...form, wabaId: e.target.value })} />
        </div>
        <div className="campo">
          <label htmlFor="numeroExibicao">Número de exibição</label>
          <input
            id="numeroExibicao"
            required
            placeholder="+55 11 99999-9999"
            value={form.numeroExibicao}
            onChange={(e) => setForm({ ...form, numeroExibicao: e.target.value })}
          />
        </div>
        <div className="campo">
          <label htmlFor="accessToken">Token de acesso</label>
          <input
            id="accessToken"
            type="password"
            required
            placeholder={contaAtual ? "•••••••• (deixe preenchido para atualizar)" : ""}
            value={form.accessToken}
            onChange={(e) => setForm({ ...form, accessToken: e.target.value })}
          />
        </div>
        <button type="submit" className="botao-primario" disabled={salvando}>
          {salvando ? "Salvando..." : "Salvar conexão"}
        </button>
      </form>
    </div>
  );
}
