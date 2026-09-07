import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function PrivateRoute() {
  const { autenticado, carregando } = useAuth();

  if (carregando) {
    return <div className="tela-carregando">Carregando...</div>;
  }

  if (!autenticado) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
