import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import type { HubConnection } from "@microsoft/signalr";
import { enviarMensagem, listarConversas, listarMensagens } from "../../services/conversaService";
import { criarConexaoConversas } from "../../services/signalrService";
import type { Conversa, Mensagem } from "../../types/conversa";
import { extrairMensagemErro } from "../../utils/apiError";
import "./Conversations.css";

function formatarHora(iso: string): string {
  return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

export function Conversations() {
  const [conversas, setConversas] = useState<Conversa[]>([]);
  const [conversaSelecionada, setConversaSelecionada] = useState<Conversa | null>(null);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [texto, setTexto] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const conexaoRef = useRef<HubConnection | null>(null);
  const mensagensFimRef = useRef<HTMLDivElement | null>(null);
  const conversaSelecionadaIdRef = useRef<string | null>(null);

  async function carregarConversas() {
    try {
      const resultado = await listarConversas();
      setConversas(resultado.itens);
    } catch (error) {
      setErro(extrairMensagemErro(error, "Não foi possível carregar as conversas."));
    }
  }

  useEffect(() => {
    carregarConversas();

    let cancelado = false;
    const conexao = criarConexaoConversas();
    conexaoRef.current = conexao;

    conexao.on("novaMensagem", (payload: { conversaId: string; mensagem: Mensagem }) => {
      carregarConversas();
      if (payload.conversaId === conversaSelecionadaIdRef.current) {
        setMensagens((atual) => (atual.some((m) => m.id === payload.mensagem.id) ? atual : [...atual, payload.mensagem]));
      }
    });

    conexao.onreconnected(() => {
      if (!cancelado) setErro(null);
    });

    conexao
      .start()
      .then(() => {
        if (!cancelado) setErro(null);
      })
      .catch(() => {
        if (!cancelado) setErro("Conexão em tempo real indisponível — atualize a página para ver novas mensagens.");
      });

    return () => {
      cancelado = true;
      conexao.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    mensagensFimRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]);

  async function abrirConversa(conversa: Conversa) {
    setConversaSelecionada(conversa);
    conversaSelecionadaIdRef.current = conversa.id;
    setMensagens([]);
    try {
      const resultado = await listarMensagens(conversa.id);
      setMensagens(resultado.itens);
      carregarConversas();
    } catch (error) {
      setErro(extrairMensagemErro(error, "Não foi possível carregar as mensagens."));
    }
  }

  async function handleEnviar(event: FormEvent) {
    event.preventDefault();
    if (!conversaSelecionada || !texto.trim()) return;

    setEnviando(true);
    setErro(null);
    const textoParaEnviar = texto;
    setTexto("");

    try {
      await enviarMensagem(conversaSelecionada.id, textoParaEnviar);
    } catch (error) {
      setErro(extrairMensagemErro(error, "Não foi possível enviar a mensagem."));
      setTexto(textoParaEnviar);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div>
      <h1>Conversas</h1>
      {erro && <div className="auth-erro">{erro}</div>}

      <div className="conversas-layout">
        <div className={`conversas-lista-painel${conversaSelecionada ? " escondido-mobile" : ""}`}>
          {conversas.length === 0 ? (
            <p className="vazio">Nenhuma conversa ainda. Configure o WhatsApp em Configurações.</p>
          ) : (
            conversas.map((conversa) => (
              <button
                key={conversa.id}
                type="button"
                className={`conversa-item${conversaSelecionada?.id === conversa.id ? " conversa-item--ativa" : ""}`}
                onClick={() => abrirConversa(conversa)}
              >
                <div className="conversa-item__topo">
                  <span className="conversa-item__nome">{conversa.contato.nome}</span>
                  <span className="conversa-item__hora">{formatarHora(conversa.ultimaMensagemEm)}</span>
                </div>
                <div className="conversa-item__preview">
                  <span className="conversa-item__texto">{conversa.ultimaMensagemTexto}</span>
                  {conversa.quantidadeNaoLidas > 0 && <span className="conversa-item__badge">{conversa.quantidadeNaoLidas}</span>}
                </div>
              </button>
            ))
          )}
        </div>

        <div className={`conversa-thread${conversaSelecionada ? " mostrar-mobile" : ""}`}>
          {conversaSelecionada ? (
            <>
              <div className="conversa-thread__cabecalho">
                <button
                  type="button"
                  className="conversa-thread__voltar"
                  onClick={() => {
                    setConversaSelecionada(null);
                    conversaSelecionadaIdRef.current = null;
                  }}
                  aria-label="Voltar"
                >
                  ←
                </button>
                <div>
                  <strong>{conversaSelecionada.contato.nome}</strong>
                  <div style={{ fontSize: "0.8rem", color: "var(--cor-texto-secundario)" }}>{conversaSelecionada.contato.telefone}</div>
                </div>
              </div>

              <div className="conversa-thread__mensagens">
                {mensagens.map((mensagem) => (
                  <div key={mensagem.id} className={`balao balao--${mensagem.direcao === "SAIDA" ? "saida" : "entrada"}`}>
                    {mensagem.texto}
                    <span className="balao__status">
                      {formatarHora(mensagem.createdAt)}
                      {mensagem.direcao === "SAIDA" && ` · ${mensagem.status.toLowerCase()}`}
                    </span>
                  </div>
                ))}
                <div ref={mensagensFimRef} />
              </div>

              <form className="conversa-thread__form" onSubmit={handleEnviar}>
                <input
                  placeholder="Digite uma mensagem..."
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  disabled={enviando}
                />
                <button type="submit" className="botao-primario" disabled={enviando || !texto.trim()}>
                  Enviar
                </button>
              </form>
            </>
          ) : (
            <div className="conversa-vazia">Selecione uma conversa para começar.</div>
          )}
        </div>
      </div>
    </div>
  );
}
