# WhatsCRM

Plataforma SaaS multiempresa, multiusuário, Web e Mobile/PWA para centralizar atendimento via WhatsApp, relacionamento com contatos, CRM, agenda e pós-venda — com um único núcleo compartilhado entre verticais de negócio (Vendas, Clínicas, Serviços, Estética...).

Veja a documentação completa da arquitetura em [`ARCHITECTURE.md`](./ARCHITECTURE.md) e as diretrizes de desenvolvimento em [`AGENTS.md`](./AGENTS.md).

## Status

🚧 Em desenvolvimento — fundação do projeto (`SPEC-001-auth-multitenant`).

## Stack

- **Backend:** C# / .NET 10 / ASP.NET Core Web API / Entity Framework Core / PostgreSQL / JWT / SignalR / Swagger
- **Frontend:** React / TypeScript / Vite / React Router / Axios / PWA
- **Infraestrutura:** Docker / Docker Compose / Nginx

## Estrutura do repositório

```text
.
├── ARCHITECTURE.md        # fonte de verdade arquitetural
├── AGENTS.md               # guia para agentes/desenvolvedores
├── docs/
│   └── specs/               # especificações funcionais (SPEC-001, SPEC-002, ...)
├── backend/
│   └── WhatsCrm.Api/        # ASP.NET Core Web API
├── frontend/                 # React + TypeScript + Vite
└── docker-compose.yml
```

## Rodando localmente

### Pré-requisitos

- .NET 10 SDK
- Node.js 20+
- PostgreSQL 16+ (ou via Docker Compose)
- Docker e Docker Compose (opcional, recomendado)

### Com Docker Compose (recomendado)

```bash
cp .env.example .env   # ajuste as senhas/segredos antes de subir
docker compose up -d --build
```

Tudo fica disponível atrás do Nginx em http://localhost:8090:

- Frontend: http://localhost:8090
- API: http://localhost:8090/api

O Swagger só é exposto quando `ASPNETCORE_ENVIRONMENT=Development` (ajuste no `.env`) — em http://localhost:8090/swagger.

O projeto Docker Compose usa o nome `whatsapp-claude` (definido em `docker-compose.yml`) e a porta `8090`, para não colidir com outro WhatsCRM que já esteja rodando na sua máquina. Se ainda assim precisar de outro nome/porta:

```bash
docker compose -p outro-nome up -d --build   # muda o nome do projeto
# ou defina HTTP_PORT=outra-porta no seu .env
```

### Backend manualmente

```bash
cd backend/WhatsCrm.Api
dotnet restore
dotnet ef database update
dotnet run
```

### Frontend manualmente

```bash
cd frontend
npm install
npm run dev
```

## Especificações

O desenvolvimento é orientado por especificações (`docs/specs/`), seguindo o fluxo:

```text
REQUISITO → SPEC → ANÁLISE → IMPLEMENTAÇÃO → TESTES → BUILD → CORREÇÕES → REVISÃO → COMMIT
```

Consulte `AGENTS.md` para o guia completo de contribuição e as regras críticas do produto (isolamento multiempresa, separação entre status comercial e etapa do Kanban, minimização de dados de saúde, etc).
