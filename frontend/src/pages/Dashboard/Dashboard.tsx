import { useAuth } from "../../contexts/AuthContext";

export function Dashboard() {
  const { usuario, empresa } = useAuth();

  return (
    <div>
      <h1>Olá, {usuario?.nome}!</h1>
      <p>
        Você está em <strong>{empresa?.nome}</strong> ({empresa?.tipoNegocio}).
      </p>
      <p>O dashboard com métricas será implementado na SPEC-010.</p>
    </div>
  );
}
