import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

/** Impede que um usuário já autenticado veja telas públicas como o login. */
export function PublicRoute() {
  const { autenticado, carregando } = useAuth();

  if (carregando) {
    return <div className="tela-carregando">Carregando...</div>;
  }

  if (autenticado) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
