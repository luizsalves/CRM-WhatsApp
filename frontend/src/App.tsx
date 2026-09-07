import { Navigate, Route, Routes } from "react-router-dom";
import { PlaceholderPage } from "./components/PlaceholderPage";
import { AuthProvider } from "./contexts/AuthContext";
import { AuthenticatedLayout } from "./layouts/AuthenticatedLayout";
import { Contacts } from "./pages/Contacts/Contacts";
import { Conversations } from "./pages/Conversations/Conversations";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import { Login } from "./pages/Login/Login";
import { RegistrarEmpresa } from "./pages/Login/RegistrarEmpresa";
import { Settings } from "./pages/Settings/Settings";
import { PrivateRoute } from "./routes/PrivateRoute";
import { PublicRoute } from "./routes/PublicRoute";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/registrar-empresa" element={<RegistrarEmpresa />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route element={<AuthenticatedLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/conversas" element={<Conversations />} />
            <Route path="/contatos" element={<Contacts />} />
            <Route
              path="/crm"
              element={<PlaceholderPage titulo="CRM" descricao="Funil, negócios e Kanban serão implementados na SPEC-006." />}
            />
            <Route
              path="/agenda"
              element={<PlaceholderPage titulo="Agenda" descricao="Compromissos e agendamentos serão implementados na SPEC-007." />}
            />
            <Route
              path="/pos-venda"
              element={<PlaceholderPage titulo="Pós-venda" descricao="Ações de pós-venda serão implementadas na SPEC-008." />}
            />
            <Route
              path="/tarefas"
              element={<PlaceholderPage titulo="Tarefas" descricao="Tarefas e follow-up serão implementados na SPEC-009." />}
            />
            <Route
              path="/equipe"
              element={<PlaceholderPage titulo="Equipe" descricao="A gestão de usuários e permissões será implementada na SPEC-002." />}
            />
            <Route
              path="/mais"
              element={<PlaceholderPage titulo="Mais" descricao="Acesso aos demais módulos no mobile." />}
            />
            <Route path="/configuracoes" element={<Settings />} />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
