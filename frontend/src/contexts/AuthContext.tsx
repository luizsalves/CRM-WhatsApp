import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { clearStoredToken, getStoredToken, setStoredToken, setUnauthorizedHandler } from "../services/api";
import { login as loginRequest, obterUsuarioAtual, registrarEmpresa as registrarEmpresaRequest } from "../services/authService";
import type { Empresa, LoginPayload, RegistrarEmpresaPayload, Usuario } from "../types/auth";

interface AuthContextValue {
  usuario: Usuario | null;
  empresa: Empresa | null;
  carregando: boolean;
  autenticado: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  registrarEmpresa: (payload: RegistrarEmpresaPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [carregando, setCarregando] = useState(true);

  const logout = useCallback(() => {
    clearStoredToken();
    setUsuario(null);
    setEmpresa(null);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(logout);
  }, [logout]);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setCarregando(false);
      return;
    }

    obterUsuarioAtual()
      .then((dados) => {
        setUsuario(dados.usuario);
        setEmpresa(dados.empresa);
      })
      .catch(() => {
        clearStoredToken();
      })
      .finally(() => setCarregando(false));
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    const resultado = await loginRequest(payload);
    setStoredToken(resultado.token);
    setUsuario(resultado.usuario);
    setEmpresa(resultado.empresa);
  }, []);

  const registrarEmpresa = useCallback(async (payload: RegistrarEmpresaPayload) => {
    const resultado = await registrarEmpresaRequest(payload);
    setStoredToken(resultado.token);
    setUsuario(resultado.usuario);
    setEmpresa(resultado.empresa);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      usuario,
      empresa,
      carregando,
      autenticado: usuario !== null,
      login,
      registrarEmpresa,
      logout,
    }),
    [usuario, empresa, carregando, login, registrarEmpresa, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider.");
  }
  return context;
}
