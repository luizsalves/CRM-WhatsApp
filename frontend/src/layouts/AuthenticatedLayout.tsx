import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./AuthenticatedLayout.css";

const ITENS_MENU = [
  { to: "/dashboard", label: "Dashboard", icone: "📊" },
  { to: "/conversas", label: "Conversas", icone: "💬" },
  { to: "/contatos", label: "Contatos", icone: "👤" },
  { to: "/crm", label: "CRM", icone: "📈" },
  { to: "/agenda", label: "Agenda", icone: "📅" },
  { to: "/pos-venda", label: "Pós-venda", icone: "🔁" },
  { to: "/tarefas", label: "Tarefas", icone: "✅" },
  { to: "/equipe", label: "Equipe", icone: "🧑‍🤝‍🧑" },
  { to: "/configuracoes", label: "Configurações", icone: "⚙️" },
];

const ITENS_MOBILE = [
  { to: "/conversas", label: "Conversas", icone: "💬" },
  { to: "/contatos", label: "Contatos", icone: "👤" },
  { to: "/crm", label: "CRM", icone: "📈" },
  { to: "/agenda", label: "Agenda", icone: "📅" },
  { to: "/mais", label: "Mais", icone: "⋯" },
];

export function AuthenticatedLayout() {
  const { usuario, empresa, logout } = useAuth();

  return (
    <div className="layout">
      <aside className="layout__sidebar">
        <div className="layout__marca">WhatsCRM</div>
        <nav className="layout__nav">
          {ITENS_MENU.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `layout__nav-item${isActive ? " layout__nav-item--ativo" : ""}`}
            >
              <span aria-hidden="true">{item.icone}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="layout__usuario">
          <div>
            <strong>{usuario?.nome}</strong>
            <div className="layout__empresa">{empresa?.nome}</div>
          </div>
          <button type="button" onClick={logout} className="layout__sair">
            Sair
          </button>
        </div>
      </aside>

      <header className="layout__header-mobile">
        <span className="layout__marca">WhatsCRM</span>
        <button type="button" onClick={logout} className="layout__sair">
          Sair
        </button>
      </header>

      <main className="layout__conteudo">
        <Outlet />
      </main>

      <nav className="layout__nav-mobile">
        {ITENS_MOBILE.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `layout__nav-mobile-item${isActive ? " layout__nav-mobile-item--ativo" : ""}`}
          >
            <span aria-hidden="true">{item.icone}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
