import { api } from "./api";
import type {
  AuthResponse,
  Empresa,
  LoginPayload,
  RegistrarEmpresaPayload,
  Usuario,
} from "../types/auth";

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/login", payload);
  return data;
}

export async function registrarEmpresa(payload: RegistrarEmpresaPayload): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/registrar-empresa", payload);
  return data;
}

export async function obterUsuarioAtual(): Promise<{ usuario: Usuario; empresa: Empresa }> {
  const { data } = await api.get<{ usuario: Usuario; empresa: Empresa }>("/auth/me");
  return data;
}
