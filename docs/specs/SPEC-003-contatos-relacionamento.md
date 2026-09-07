# SPEC-003 — Contatos e Tags

## Título

Contatos, Relacionamento e Tags

## Objetivo

Cadastrar e gerenciar os contatos (clientes/leads/pacientes, conforme a vertical) de cada empresa, com suporte a tags para segmentação. É pré-requisito para o módulo de WhatsApp/Conversas (SPEC-004/005), já que toda conversa se vincula a um contato.

## Problema

Sem um cadastro central de contatos vinculado à empresa (tenant), não é possível associar mensagens do WhatsApp, negócios ou compromissos a uma pessoa. Também é necessário segmentar contatos por tags (ex.: "VIP", "Lead quente") sem depender de campos de texto livre.

## Escopo

- Entidade `Contato` com os campos definidos no núcleo (ARCHITECTURE.md §10).
- Entidades `Tag` e `ContatoTag` (associação N:N).
- CRUD completo de contatos e tags.
- Associar/remover tags de um contato.
- Listagem paginada e busca por nome/telefone.

## Fora do escopo

- Funil/negócios (SPEC-006).
- Histórico de conversas (SPEC-005).
- Importação em massa de contatos (CSV).
- Campos clínicos (proibido por princípio — ARCHITECTURE.md §36/37).

## Atores

- Qualquer usuário autenticado da empresa (leitura/criação/edição).
- Futuras permissões finas ficam para a SPEC-002.

## Entidades

### `contatos`

| Campo | Tipo | Observações |
|---|---|---|
| id | uuid | PK |
| empresa_id | uuid | FK → empresas.id, obrigatório |
| nome | varchar(200) | obrigatório |
| telefone | varchar(20) | obrigatório, formato E.164 (ex.: +5511999999999) |
| email | varchar(200) | nullable |
| data_nascimento | date | nullable — uso comercial/relacionamento, nunca clínico |
| empresa_nome | varchar(200) | nullable — empresa onde o contato trabalha (B2B) |
| observacoes | text | nullable |
| responsavel_usuario_id | uuid | FK → usuarios.id, nullable |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### `tags`

| Campo | Tipo | Observações |
|---|---|---|
| id | uuid | PK |
| empresa_id | uuid | FK → empresas.id |
| nome | varchar(60) | obrigatório |
| cor | varchar(7) | hex, ex.: `#128C7E` |
| created_at | timestamptz | |

### `contato_tags`

| Campo | Tipo | Observações |
|---|---|---|
| contato_id | uuid | FK → contatos.id |
| tag_id | uuid | FK → tags.id |

PK composta (`contato_id`, `tag_id`).

## Relacionamentos

- `Empresa 1 — N Contato`, `Empresa 1 — N Tag`.
- `Contato N — N Tag` via `ContatoTag`.
- `Usuario 1 — N Contato` (responsável), opcional.

## Regras

1. `telefone` é único por empresa (índice composto `empresa_id + telefone`).
2. `tags.nome` é único por empresa (índice composto `empresa_id + nome`).
3. Toda consulta filtra implicitamente por `EmpresaId` do usuário autenticado (nunca do cliente).
4. Excluir uma tag remove as associações em `contato_tags`, mas não os contatos.
5. Excluir um contato remove suas associações de tags (não há exclusão em cascata para conversas/negócios — essas specs decidirão o comportamento quando implementadas).

## Permissões

Qualquer usuário autenticado da empresa pode listar, criar, editar e excluir contatos e tags neste MVP. Permissões finas por Role ficam para a SPEC-002.

## Endpoints

```text
GET    /api/contatos?busca=&pagina=&tamanhoPagina=
GET    /api/contatos/{id}
POST   /api/contatos
PUT    /api/contatos/{id}
DELETE /api/contatos/{id}
POST   /api/contatos/{id}/tags/{tagId}
DELETE /api/contatos/{id}/tags/{tagId}

GET    /api/tags
POST   /api/tags
PUT    /api/tags/{id}
DELETE /api/tags/{id}
```

## Fluxo backend

```text
Requisição autenticada
      ↓
ICurrentUserService.EmpresaId (do JWT)
      ↓
ContatoService filtra/persiste sempre com EmpresaId do contexto
      ↓
Validação de duplicidade de telefone (por empresa)
      ↓
Resposta DTO (nunca a Entity diretamente)
```

## Fluxo frontend

```text
Tela Contatos
      ↓
Lista paginada + busca por nome/telefone
      ↓
Criar/editar em formulário (modal ou página)
      ↓
Adicionar/remover tags no próprio card do contato
      ↓
Loading enquanto busca; mensagens de erro amigáveis
```

## UX desktop

Tabela com colunas: nome, telefone, tags (badges coloridos), responsável, ações (editar/excluir). Botão "Novo contato" no topo.

## UX mobile

Lista em cards empilhados (nome, telefone, tags) — sem tabela horizontal. Botão flutuante ou fixo para novo contato.

## Segurança

- `EmpresaId` sempre do JWT.
- Telefone validado em formato E.164 no backend (não confiar só na validação do frontend).

## Performance

- Índices: `contatos(empresa_id, telefone)`, `tags(empresa_id, nome)`.
- Paginação obrigatória na listagem de contatos.
- `AsNoTracking` nas consultas de leitura.

## Erros

| Cenário | Status |
|---|---|
| Telefone duplicado na empresa | 409 |
| Contato não encontrado (ou de outra empresa) | 404 |
| Dados inválidos (DTO) | 400 |
| Tag duplicada na empresa | 409 |

## Critérios de aceite

- [ ] CRUD de contatos funcional e isolado por empresa.
- [ ] CRUD de tags funcional e isolado por empresa.
- [ ] Associação/remoção de tags em um contato funciona.
- [ ] Telefone duplicado na mesma empresa é rejeitado com 409.
- [ ] Busca por nome/telefone funciona com paginação.
- [ ] Tela funciona em desktop e mobile.

## Testes

- Unitários do `ContatoService`: criar, editar, excluir, duplicidade de telefone, isolamento entre empresas.
- Unitários do `TagService`: criar, duplicidade de nome, exclusão remove associações.
