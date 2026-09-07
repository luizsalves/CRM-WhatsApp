import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import type { TipoNegocio } from "../../types/auth";
import { extrairMensagemErro } from "../../utils/apiError";
import "./Login.css";

const OPCOES_TIPO_NEGOCIO: { value: TipoNegocio; label: string }[] = [
  { value: "VENDAS", label: "Vendas / Comercial" },
  { value: "CLINICA", label: "Clínica" },
  { value: "SERVICOS", label: "Serviços" },
  { value: "ESTETICA", label: "Estética" },
  { value: "OUTRO", label: "Outro" },
];

export function RegistrarEmpresa() {
  const { registrarEmpresa } = useAuth();
  const navigate = useNavigate();

  const [nomeEmpresa, setNomeEmpresa] = useState("");
  const [tipoNegocio, setTipoNegocio] = useState<TipoNegocio>("VENDAS");
  const [nomeAdministrador, setNomeAdministrador] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErro(null);
    setEnviando(true);

    try {
      await registrarEmpresa({ nomeEmpresa, tipoNegocio, nomeAdministrador, email, senha });
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setErro(extrairMensagemErro(error, "Não foi possível criar a empresa. Verifique os dados informados."));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="auth-tela">
      <div className="auth-card">
        <div className="auth-marca">WhatsCRM</div>
        <p className="auth-subtitulo">Crie sua empresa</p>

        {erro && <div className="auth-erro">{erro}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="auth-campo">
            <label htmlFor="nomeEmpresa">Nome da empresa</label>
            <input
              id="nomeEmpresa"
              required
              value={nomeEmpresa}
              onChange={(event) => setNomeEmpresa(event.target.value)}
            />
          </div>

          <div className="auth-campo">
            <label htmlFor="tipoNegocio">Tipo de negócio</label>
            <select
              id="tipoNegocio"
              value={tipoNegocio}
              onChange={(event) => setTipoNegocio(event.target.value as TipoNegocio)}
            >
              {OPCOES_TIPO_NEGOCIO.map((opcao) => (
                <option key={opcao.value} value={opcao.value}>
                  {opcao.label}
                </option>
              ))}
            </select>
          </div>

          <div className="auth-campo">
            <label htmlFor="nomeAdministrador">Seu nome</label>
            <input
              id="nomeAdministrador"
              required
              value={nomeAdministrador}
              onChange={(event) => setNomeAdministrador(event.target.value)}
            />
          </div>

          <div className="auth-campo">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="auth-campo">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
            />
          </div>

          <button type="submit" className="auth-botao" disabled={enviando}>
            {enviando ? "Criando..." : "Criar empresa"}
          </button>
        </form>

        <Link to="/login" className="auth-link">
          Já tenho uma conta
        </Link>
      </div>
    </div>
  );
}
