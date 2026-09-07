# AGENTS.md — WhatsCRM

Guia para agentes de IA (e humanos) que forem desenvolver este repositório.

## Papel

Ao trabalhar neste projeto, atue como arquiteto de software sênior, desenvolvedor C#/.NET sênior, desenvolvedor React/TypeScript sênior, especialista em PostgreSQL, APIs REST, SaaS multiempresa e segurança. Este é um produto SaaS real — não produza código descartável.

## Metodologia obrigatória

```text
REQUISITO → SPEC → ANÁLISE → IMPLEMENTAÇÃO → TESTES → BUILD → CORREÇÕES → REVISÃO → COMMIT
```

Antes de implementar qualquer funcionalidade, leia nesta ordem de prioridade:

```text
Requisito atual → Spec correspondente → ARCHITECTURE.md → AGENTS.md → Código existente
```

Não contradiga silenciosamente a arquitetura descrita em `ARCHITECTURE.md`.

## Visão do produto

SaaS multiempresa, multiusuário, Web e Mobile/PWA, com um núcleo compartilhado e diferentes verticais (Vendas, Clínicas, Serviços, Estética...). Não criar sistemas independentes por vertical — um único núcleo, módulos e nomenclaturas adaptadas.

## Stack

- **Backend:** C#, .NET 10, ASP.NET Core Web API, Entity Framework Core, Npgsql, PostgreSQL, JWT, SignalR, Swagger/OpenAPI.
- **Frontend:** React, TypeScript, Vite, React Router, Axios, Responsive Design, PWA.
- **Infra:** Docker, Docker Compose, Nginx, Linux, Git, GitHub.

## Regra crítica de multiempresa

Toda entidade operacional relevante pertence a uma empresa (`EmpresaId`). **Nunca** utilizar `EmpresaId` fornecido pelo frontend como prova de autorização — o contexto de empresa vem sempre do JWT autenticado. Sempre validar isolamento entre tenants.

## Estrutura de pastas

```text
backend/
└── WhatsCrm.Api/
    ├── Controllers/
    ├── Services/
    ├── Interfaces/
    ├── Entities/
    ├── DTOs/
    ├── Data/
    ├── Configurations/
    ├── Integrations/
    │   └── WhatsApp/
    ├── Hubs/
    ├── Middlewares/
    ├── Extensions/
    ├── Migrations/
    └── Program.cs

frontend/
└── src/
    ├── components/
    ├── pages/
    ├── services/
    ├── hooks/
    ├── contexts/
    ├── layouts/
    ├── routes/
    ├── types/
    └── utils/
```

Não colocar regras de negócio complexas em Controllers — usar Services.

## Specs

Toda funcionalidade nova deve ter uma spec em `docs/specs/` antes da implementação, cobrindo: título, objetivo, problema, escopo, fora do escopo, atores, entidades, campos, relacionamentos, regras, permissões, endpoints, fluxo backend, fluxo frontend, UX desktop, UX mobile, segurança, performance, erros, critérios de aceite e testes.

Roadmap de specs:

```text
SPEC-001-auth-multitenant.md
SPEC-002-usuarios-permissoes.md
SPEC-003-contatos-relacionamento.md
SPEC-004-whatsapp-integracao.md
SPEC-005-conversas-mensagens.md
SPEC-006-crm-negocios-vendas.md
SPEC-007-agenda-compromissos.md
SPEC-008-pos-venda.md
SPEC-009-tarefas-followup.md
SPEC-010-dashboard.md
SPEC-011-mobile-pwa.md
SPEC-012-verticais.md
```

## Regra crítica do Kanban/CRM

`negocio.funil_etapa_id` (etapa visual) e `negocio.status` (ABERTO/GANHO/PERDIDO) são independentes. Mover um negócio ganho para a etapa "Pós-venda/Retorno" **não** altera seu `status`, que permanece `GANHO`.

## Harness — antes de declarar uma tarefa concluída

```bash
# git
git status

# backend
dotnet restore
dotnet build
dotnet test

# frontend
npm install
npm run build
npm run lint   # quando existente
npm test       # quando existente

# banco
# criar migration, revisar FKs/constraints/índices, checar risco de perda de dados

# docker (quando aplicável)
docker compose config
```

Não declarar conclusão com erro. Não editar migrations antigas já aplicadas/compartilhadas.

## Segurança — nunca

```text
Senha no código
Token Meta/WhatsApp no frontend
JWT secret no Git
Connection string de produção versionada
SQL concatenado
EmpresaId confiado do frontend
Stack trace exposto ao usuário
```

## Proibições de escopo

Não adicionar sem necessidade real: microservices, Kubernetes, Event Sourcing, CQRS completo, Kafka, RabbitMQ, Redis, ou arquiteturas excessivamente abstratas. Simplicidade é requisito.

## Dados de saúde (verticais clínicas)

Não criar, sem spec própria: diagnóstico, prescrição, exames, prontuário, histórico médico, doenças, tratamentos clínicos detalhados. O sistema aplica minimização de dados — tags como "Paciente aparelho" são aceitáveis, prontuário eletrônico não é (ainda).

## Definition of Done

```text
[ ] Spec atendida
[ ] Banco revisado (migration, FKs, constraints, índices)
[ ] Backend implementado
[ ] Frontend implementado
[ ] Mobile verificado
[ ] Multiempresa validada (isolamento entre tenants)
[ ] Permissões verificadas
[ ] Validações implementadas
[ ] Loading e erros tratados
[ ] Swagger atualizado
[ ] dotnet build / dotnet test passaram
[ ] npm run build passou (lint/test quando existentes)
[ ] Nenhum secret adicionado
[ ] Nenhuma alteração fora de escopo
```
