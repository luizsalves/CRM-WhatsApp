# SPEC-001 — Autenticação e Multiempresa

## Título

Fundação de Autenticação, Empresas e Isolamento Multiempresa (multitenant)

## Objetivo

Estabelecer a fundação do WhatsCRM: cadastro de empresas (tenants), usuários vinculados a uma empresa, autenticação via login/senha com emissão de JWT, e o mecanismo de isolamento de dados entre empresas que será usado por todos os módulos futuros do sistema.

## Problema

O WhatsCRM é um SaaS multiempresa: uma única instalação atenderá diversas organizações (empresas comerciais, clínicas, etc). É necessário garantir, desde a primeira linha de código, que:

- cada usuário pertença a exatamente uma empresa;
- nenhuma empresa consiga ler ou alterar dados de outra;
- o contexto de empresa usado para autorização nunca dependa de dado enviado pelo cliente (frontend), apenas do token autenticado.

## Escopo

- Entidade `Empresa` (tenant), com `TipoNegocio` (vertical).
- Entidade `Usuario`, vinculada a uma `Empresa`, com senha com hash seguro.
- Roles iniciais: `ADMINISTRADOR`, `GESTOR`, `PROFISSIONAL`, `ATENDENTE`.
- Endpoint de login (`POST /api/auth/login`) retornando JWT.
- Endpoint `GET /api/auth/me` retornando os dados do usuário autenticado.
- Endpoint de "onboarding" (`POST /api/auth/registrar-empresa`) para criar a primeira empresa + primeiro usuário administrador (bootstrap de um novo tenant).
- Middleware/infra para extrair `EmpresaId` e `UsuarioId` do JWT em todas as requisições autenticadas.
- Proteção de rotas no frontend (rotas privadas exigem sessão válida).
- Tela de Login e layout autenticado básico no frontend.

## Fora do escopo

- WhatsApp, Conversas, CRM, Agenda, Pós-venda, Tarefas (specs próprias).
- Recuperação de senha / envio de e-mail.
- Múltiplos usuários convidando outros usuários (gestão completa de equipe — SPEC-002).
- Login social / SSO.
- 2FA.

## Atores

- **Visitante**: acessa a tela de login, ou realiza o onboarding de uma nova empresa.
- **Usuário autenticado**: qualquer usuário logado, com uma Role.
- **Administrador**: Role com maior privilégio dentro da própria empresa.

## Entidades

### `empresas`

| Campo | Tipo | Observações |
|---|---|---|
| id | uuid | PK |
| nome | varchar(200) | razão social / nome |
| nome_fantasia | varchar(200) | nullable |
| cnpj | varchar(20) | nullable, único quando informado |
| tipo_negocio | varchar(30) | enum: VENDAS, CLINICA, SERVICOS, ESTETICA, OUTRO |
| ativo | boolean | default true |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### `usuarios`

| Campo | Tipo | Observações |
|---|---|---|
| id | uuid | PK |
| empresa_id | uuid | FK → empresas.id, obrigatório |
| nome | varchar(200) | |
| email | varchar(200) | único globalmente no sistema |
| senha_hash | varchar(200) | hash (BCrypt), nunca senha em texto puro |
| role | varchar(30) | enum: ADMINISTRADOR, GESTOR, PROFISSIONAL, ATENDENTE |
| ativo | boolean | default true |
| ultimo_login_em | timestamptz | nullable |
| created_at | timestamptz | |
| updated_at | timestamptz | |

## Relacionamentos

- `Empresa 1 — N Usuario`
- Todas as demais entidades do sistema (futuras) possuirão `EmpresaId` como FK obrigatória para `empresas.id`.

## Regras

1. `usuarios.email` deve ser único em todo o sistema (constraint única em `email`), pois o login é feito apenas com email/senha, sem seleção prévia de empresa — o email precisa identificar um único usuário (e, por consequência, uma única empresa).
2. Senha nunca é armazenada em texto puro — usar hash com salt (BCrypt).
3. O primeiro usuário criado ao registrar uma nova empresa recebe automaticamente a role `ADMINISTRADOR`.
4. O JWT emitido no login deve conter, no mínimo, claims: `sub` (usuario_id), `empresa_id`, `role`, `email`.
5. **Regra crítica:** o `EmpresaId` usado para autorização e para filtrar dados em qualquer consulta **nunca** deve vir de parâmetro de rota, query string, header customizado ou corpo da requisição — sempre deve ser extraído do JWT validado pelo servidor.
6. Toda entidade operacional (a partir das próximas specs) deve possuir `EmpresaId` e todas as queries devem filtrar por ele.
7. Usuário inativo (`ativo = false`) não deve conseguir autenticar.
8. Empresa inativa (`ativo = false`) não deve permitir login de nenhum de seus usuários.

## Permissões

Para este MVP de fundação, todas as rotas autenticadas exigem apenas um JWT válido (qualquer Role). A diferenciação fina de permissões por Role será tratada na SPEC-002 (Usuários e Permissões). Ainda assim, a infraestrutura de Roles/Claims já deve estar pronta para uso (`[Authorize(Roles = "ADMINISTRADOR")]` funcional).

## Endpoints

```text
POST /api/auth/registrar-empresa
Body: { nomeEmpresa, tipoNegocio, nomeAdministrador, email, senha }
201 Created → { token, usuario, empresa }

POST /api/auth/login
Body: { email, senha }
200 OK → { token, usuario }
401 Unauthorized → credenciais inválidas

GET /api/auth/me
Header: Authorization: Bearer <token>
200 OK → { usuario, empresa }
401 Unauthorized → token ausente/inválido
```

## Fluxo backend

```text
POST /api/auth/registrar-empresa
      ↓
Validar dados (DTO + FluentValidation/DataAnnotations)
      ↓
Email já existe nesta empresa? (n/a — empresa nova)
      ↓
Criar Empresa
      ↓
Criar Usuario (role=ADMINISTRADOR, senha_hash)
      ↓
Gerar JWT
      ↓
Retornar 201 + token

POST /api/auth/login
      ↓
Buscar usuario por email (join empresa)
      ↓
Usuario existe e está ativo? Empresa ativa?
      ↓
Validar hash de senha
      ↓
Gerar JWT (empresa_id, usuario_id, role, email)
      ↓
Atualizar ultimo_login_em
      ↓
Retornar 200 + token

Requisição autenticada
      ↓
Middleware JWT valida assinatura/expiração
      ↓
Claims (empresa_id, usuario_id, role) disponíveis via ICurrentUserService
      ↓
Controllers/Services usam ICurrentUserService.EmpresaId para filtrar dados
```

## Fluxo frontend

```text
Usuário acessa "/"
      ↓
Existe token válido no storage?
      ↓
NÃO → redireciona para /login
      ↓
Usuário preenche email/senha → POST /api/auth/login
      ↓
Sucesso → salva token + dados do usuário no AuthContext/localStorage
      ↓
Redireciona para /dashboard (placeholder)
      ↓
Rotas privadas verificam AuthContext antes de renderizar
      ↓
401 em qualquer requisição → limpa sessão e redireciona para /login
```

## UX desktop

- Tela de login centralizada, com campos e-mail/senha, botão "Entrar", link para "Criar nova empresa" (onboarding).
- Após login: layout com menu lateral fixo (placeholder dos módulos futuros: Dashboard, Conversas, Contatos, CRM, Agenda, Pós-venda, Tarefas, Equipe, Configurações) e área de conteúdo.

## UX mobile

- Layout de login em coluna única, ocupando a largura da tela (mobile-first), sem depender de hover.
- Após login, layout com menu inferior (bottom navigation) com placeholders dos itens prioritários: Conversas, Contatos, CRM, Agenda, Mais.

## Segurança

- Senhas com hash BCrypt (custo mínimo 11).
- JWT assinado com chave secreta forte, armazenada apenas em variável de ambiente/configuração — nunca versionada no Git.
- Connection string de produção nunca versionada (usar variável de ambiente / `appsettings.Development.json` fora do controle de versão para segredos locais).
- HTTPS assumido em produção (Nginx faz terminação TLS).
- Erros nunca expõem stack trace ao cliente (middleware global de tratamento de exceções retorna mensagem genérica + log interno).
- Rate limiting básico recomendado no endpoint de login (mitigar força bruta) — pode ser endereçado com melhoria incremental.

## Performance

- Índice único em `usuarios (email)` e índice em `usuarios (empresa_id)`.
- Índice em `empresas (cnpj)` quando informado.
- Consultas de autenticação usam `AsNoTracking`.

## Erros

| Cenário | Status |
|---|---|
| Email/senha inválidos | 401 |
| Usuário ou empresa inativos | 401 |
| Token ausente/expirado/inválido em rota protegida | 401 |
| Tentativa de acessar dado de outra empresa | 403 (ou 404, conforme não vazar existência do recurso) |
| Dados de cadastro inválidos (DTO) | 400 |
| CNPJ ou email duplicado onde há constraint única | 409 |

## Critérios de aceite

- [ ] É possível registrar uma nova empresa com seu primeiro usuário administrador.
- [ ] É possível fazer login com email/senha válidos e receber um JWT.
- [ ] `GET /api/auth/me` retorna os dados do usuário autenticado a partir do token.
- [ ] Login com credenciais inválidas retorna 401.
- [ ] Um usuário de uma empresa não consegue, por nenhum meio, acessar/alterar dados de outra empresa mesmo manipulando parâmetros da requisição.
- [ ] O `EmpresaId` usado em todas as consultas vem exclusivamente do JWT (nunca de input do cliente).
- [ ] Frontend redireciona para `/login` quando não há sessão válida.
- [ ] Frontend redireciona para `/dashboard` após login bem-sucedido.
- [ ] Layout funciona em desktop (1366px+) e mobile (375px) sem depender de hover.
- [ ] `dotnet build` e `dotnet test` passam sem erros.
- [ ] `npm run build` passa sem erros.

## Testes

- Testes unitários de `AuthService`: login válido, login com senha errada, login com usuário inexistente, login com usuário/empresa inativos.
- Teste de geração/validação de JWT (claims corretas).
- Teste de isolamento multiempresa: criar duas empresas, dois usuários, garantir que consultas de uma empresa nunca retornam dados da outra (mesmo se o EmpresaId for manipulado no payload de uma requisição de teste).
- Teste de integração do fluxo completo: registrar empresa → login → chamar `/api/auth/me`.
