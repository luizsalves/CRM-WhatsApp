import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { extrairMensagemErro } from "../../utils/apiError";
import "./Login.css";

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErro(null);
    setEnviando(true);

    try {
      await login({ email, senha });
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setErro(extrairMensagemErro(error, "Não foi possível entrar. Verifique suas credenciais."));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="auth-tela">
      <div className="auth-card">
        <div className="auth-marca">WhatsCRM</div>
        <p className="auth-subtitulo">Entre com sua conta</p>

        {erro && <div className="auth-erro">{erro}</div>}

        <form onSubmit={handleSubmit} noValidate>
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
              autoComplete="current-password"
              required
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
            />
          </div>

          <button type="submit" className="auth-botao" disabled={enviando}>
            {enviando ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <Link to="/registrar-empresa" className="auth-link">
          Criar nova empresa
        </Link>
      </div>
    </div>
  );
}
