export type TipoNegocio = "VENDAS" | "CLINICA" | "SERVICOS" | "ESTETICA" | "OUTRO";

export type RoleUsuario = "ADMINISTRADOR" | "GESTOR" | "PROFISSIONAL" | "ATENDENTE";

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  role: RoleUsuario;
}

export interface Empresa {
  id: string;
  nome: string;
  nomeFantasia: string | null;
  tipoNegocio: TipoNegocio;
}

export interface AuthResponse {
  token: string;
  usuario: Usuario;
  empresa: Empresa;
}

export interface LoginPayload {
  email: string;
  senha: string;
}

export interface RegistrarEmpresaPayload {
  nomeEmpresa: string;
  tipoNegocio: TipoNegocio;
  nomeAdministrador: string;
  email: string;
  senha: string;
}
