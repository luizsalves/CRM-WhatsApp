import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  adicionarTag,
  atualizarContato,
  criarContato,
  criarTag,
  excluirContato,
  listarContatos,
  listarTags,
  removerTag
} from "../../services/contatoService";
import type { Contato, CreateContatoPayload, Tag } from "../../types/contato";
import { extrairMensagemErro } from "../../utils/apiError";
import "./Contacts.css";

const CORES_TAG = ["#128C7E", "#D92D20", "#2563EB", "#B45309", "#7C3AED"];

function ContatoFormModal({
  contatoEditando,
  onFechar,
  onSalvo
}: {
  contatoEditando: Contato | null;
  onFechar: () => void;
  onSalvo: () => void;
}) {
  const [form, setForm] = useState<CreateContatoPayload>({
    nome: contatoEditando?.nome ?? "",
    telefone: contatoEditando?.telefone ?? "",
    email: contatoEditando?.email ?? "",
    dataNascimento: contatoEditando?.dataNascimento ?? "",
    empresaNome: contatoEditando?.empresaNome ?? "",
    observacoes: contatoEditando?.observacoes ?? ""
  });
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErro(null);
    setSalvando(true);

    // Campos opcionais vazios precisam virar `undefined` (não string vazia) — o
    // backend falha ao desserializar "" num DateOnly?/campo nullable.
    const payload: CreateContatoPayload = {
      nome: form.nome,
      telefone: form.telefone,
      email: form.email || undefined,
      dataNascimento: form.dataNascimento || undefined,
      empresaNome: form.empresaNome || undefined,
      observacoes: form.observacoes || undefined
    };

    try {
      if (contatoEditando) {
        await atualizarContato(contatoEditando.id, payload);
      } else {
        await criarContato(payload);
      }
      onSalvo();
    } catch (error) {
      setErro(extrairMensagemErro(error, "Não foi possível salvar o contato."));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="modal-fundo" onClick={onFechar}>
      <div className="modal-caixa" onClick={(event) => event.stopPropagation()}>
        <h2>{contatoEditando ? "Editar contato" : "Novo contato"}</h2>
        {erro && <div className="auth-erro">{erro}</div>}
        <form onSubmit={handleSubmit} noValidate>
          <div className="campo">
            <label htmlFor="nome">Nome</label>
            <input id="nome" required value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
          </div>
          <div className="campo">
            <label htmlFor="telefone">Telefone (formato +5511999999999)</label>
            <input
              id="telefone"
              required
              placeholder="+5511999999999"
              value={form.telefone}
              onChange={(e) => setForm({ ...form, telefone: e.target.value })}
            />
          </div>
          <div className="campo">
            <label htmlFor="email">E-mail</label>
            <input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="campo">
            <label htmlFor="empresaNome">Empresa</label>
            <input id="empresaNome" value={form.empresaNome} onChange={(e) => setForm({ ...form, empresaNome: e.target.value })} />
          </div>
          <div className="campo">
            <label htmlFor="observacoes">Observações</label>
            <textarea
              id="observacoes"
              rows={3}
              value={form.observacoes}
              onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
            />
          </div>
          <div className="modal-acoes">
            <button type="button" className="botao-secundario" onClick={onFechar}>
              Cancelar
            </button>
            <button type="submit" className="botao-primario" disabled={salvando}>
              {salvando ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SeletorTag({ contato, tagsDisponiveis, onAtualizado }: { contato: Contato; tagsDisponiveis: Tag[]; onAtualizado: () => void }) {
  const [mostrarSeletor, setMostrarSeletor] = useState(false);

  async function handleSelecionar(tagId: string) {
    setMostrarSeletor(false);
    if (!tagId) return;
    await adicionarTag(contato.id, tagId);
    onAtualizado();
  }

  const disponiveis = tagsDisponiveis.filter((t) => !contato.tags.some((ct) => ct.id === t.id));

  return (
    <div className="tag-adicionar">
      {contato.tags.map((tag) => (
        <span key={tag.id} className="tag-badge" style={{ backgroundColor: tag.cor }}>
          {tag.nome}
          <button
            type="button"
            aria-label={`Remover tag ${tag.nome}`}
            onClick={async () => {
              await removerTag(contato.id, tag.id);
              onAtualizado();
            }}
          >
            ×
          </button>
        </span>
      ))}
      {mostrarSeletor ? (
        <select autoFocus onChange={(e) => handleSelecionar(e.target.value)} onBlur={() => setMostrarSeletor(false)}>
          <option value="">Adicionar tag...</option>
          {disponiveis.map((tag) => (
            <option key={tag.id} value={tag.id}>
              {tag.nome}
            </option>
          ))}
        </select>
      ) : (
        <button type="button" className="botao-secundario" style={{ padding: "2px 8px", fontSize: "0.75rem" }} onClick={() => setMostrarSeletor(true)}>
          + tag
        </button>
      )}
    </div>
  );
}

export function Contacts() {
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [contatoEditando, setContatoEditando] = useState<Contato | null>(null);

  async function carregar() {
    setCarregando(true);
    setErro(null);
    try {
      const [respostaContatos, respostaTags] = await Promise.all([listarContatos(busca), listarTags()]);
      setContatos(respostaContatos.itens);
      setTags(respostaTags);
    } catch (error) {
      setErro(extrairMensagemErro(error, "Não foi possível carregar os contatos."));
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    const timeout = setTimeout(carregar, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busca]);

  async function handleExcluir(contato: Contato) {
    if (!window.confirm(`Excluir o contato "${contato.nome}"?`)) return;
    await excluirContato(contato.id);
    carregar();
  }

  async function handleCriarTagRapida() {
    const nome = window.prompt("Nome da nova tag:");
    if (!nome) return;
    const cor = CORES_TAG[tags.length % CORES_TAG.length];
    await criarTag(nome, cor);
    carregar();
  }

  return (
    <div>
      <h1>Contatos</h1>

      <div className="contatos-topo">
        <input
          className="contatos-busca"
          placeholder="Buscar por nome ou telefone..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <button type="button" className="botao-secundario" onClick={handleCriarTagRapida}>
          Nova tag
        </button>
        <button
          type="button"
          className="botao-primario"
          onClick={() => {
            setContatoEditando(null);
            setModalAberto(true);
          }}
        >
          Novo contato
        </button>
      </div>

      {erro && <div className="auth-erro">{erro}</div>}

      {carregando ? (
        <p>Carregando...</p>
      ) : contatos.length === 0 ? (
        <p className="vazio">Nenhum contato encontrado.</p>
      ) : (
        <div className="contatos-lista">
          {contatos.map((contato) => (
            <div key={contato.id} className="contato-card">
              <div className="contato-card__cabecalho">
                <div>
                  <div className="contato-card__nome">{contato.nome}</div>
                  <div className="contato-card__telefone">{contato.telefone}</div>
                </div>
                <div className="contato-card__acoes">
                  <button
                    type="button"
                    onClick={() => {
                      setContatoEditando(contato);
                      setModalAberto(true);
                    }}
                  >
                    Editar
                  </button>
                  <button type="button" onClick={() => handleExcluir(contato)}>
                    Excluir
                  </button>
                </div>
              </div>
              <SeletorTag contato={contato} tagsDisponiveis={tags} onAtualizado={carregar} />
            </div>
          ))}
        </div>
      )}

      {modalAberto && (
        <ContatoFormModal
          contatoEditando={contatoEditando}
          onFechar={() => setModalAberto(false)}
          onSalvo={() => {
            setModalAberto(false);
            carregar();
          }}
        />
      )}
    </div>
  );
}
