# SPEC-005 — Conversas e Mensagens

## Título

Conversas, Mensagens e Atendimento em Tempo Real

## Objetivo

Transformar os eventos de webhook do WhatsApp (SPEC-004) em conversas e mensagens visíveis e respondíveis pela equipe, com atualização em tempo real via SignalR, e permitir o envio de mensagens de texto para o contato.

## Problema

Receber o webhook não é suficiente: é preciso agrupar mensagens por contato em uma conversa, manter um indicador de não lidas, permitir que um atendente assuma a conversa e responda, e refletir tudo isso na tela sem exigir recarregar a página.

## Escopo

- Entidades `Conversa` e `Mensagem`.
- Serviço que processa o payload do webhook (já validado e persistido pela SPEC-004) e cria/atualiza contato, conversa e mensagem.
- Envio de mensagem de texto (atendente → contato) via WhatsApp Cloud API.
- Listagem de conversas e mensagens, com paginação.
- Hub SignalR (`ConversationsHub`) para notificar novas mensagens em tempo real.
- Tela de Conversas: lista + thread de mensagens.

## Fora do escopo

- Mensagens de mídia (imagem, áudio, documento, localização) — apenas o campo `tipo` é armazenado; a renderização de mídia fica para uma iteração futura.
- Templates de mensagem (HSM) para reabrir a janela de 24h.
- Distribuição automática de conversas entre atendentes (fila).
- Busca full-text no conteúdo das mensagens.

## Atores

- Atendente/Vendedor/Profissional: visualiza e responde conversas.
- Sistema: processa webhooks e envia mensagens.

## Entidades

### `conversas`

| Campo | Tipo | Observações |
|---|---|---|
| id | uuid | PK |
| empresa_id | uuid | FK → empresas.id |
| contato_id | uuid | FK → contatos.id |
| whatsapp_conta_id | uuid | FK → whatsapp_contas.id |
| responsavel_usuario_id | uuid | FK → usuarios.id, nullable |
| status | varchar(20) | `ABERTA`, `PENDENTE`, `RESOLVIDA` |
| ultima_mensagem_em | timestamptz | |
| ultima_mensagem_texto | varchar(200) | prévia para a lista |
| quantidade_nao_lidas | int | default 0 |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### `mensagens`

| Campo | Tipo | Observações |
|---|---|---|
| id | uuid | PK |
| empresa_id | uuid | FK → empresas.id |
| conversa_id | uuid | FK → conversas.id |
| provider_message_id | varchar(100) | id da mensagem na Meta, nullable para mensagens ainda não confirmadas |
| direcao | varchar(10) | `ENTRADA`, `SAIDA` |
| tipo | varchar(20) | `TEXTO`, `IMAGEM`, `DOCUMENTO`, `AUDIO`, `VIDEO`, `LOCALIZACAO`, `TEMPLATE` |
| texto | text | nullable (vazio para tipos de mídia não suportados ainda) |
| status | varchar(20) | `ENVIANDO`, `ENVIADA`, `ENTREGUE`, `LIDA`, `FALHOU`, `RECEBIDA` |
| enviada_em | timestamptz | nullable |
| recebida_em | timestamptz | nullable |
| lida_em | timestamptz | nullable |
| created_at | timestamptz | |

## Relacionamentos

- `Contato 1 — N Conversa`.
- `Conversa 1 — N Mensagem`.
- `WhatsappConta 1 — N Conversa`.

## Regras

1. Uma conversa é única por par (`contato_id`, `whatsapp_conta_id`) — mensagens novas do mesmo contato entram na conversa existente, não criam uma nova.
2. Ao processar uma mensagem de **entrada**: se o contato (pelo telefone) não existir na empresa, ele é criado automaticamente com o nome do perfil do WhatsApp (quando disponível) ou o próprio telefone.
3. Ao processar uma mensagem de entrada, `quantidade_nao_lidas` é incrementada; ao abrir a conversa na tela, o backend zera esse contador.
4. Enviar mensagem exige que a conversa esteja dentro da janela de 24h de atendimento gratuito da Meta (checagem simples pela `ultima_mensagem_em` de uma mensagem de entrada) — fora da janela, a spec de templates (futura) será necessária; por ora, o backend apenas tenta enviar e propaga o erro da Meta de forma amigável.
5. `EmpresaId` de toda operação vem do JWT — nunca do `conversaId` isoladamente (o backend sempre valida que a conversa pertence à empresa do usuário autenticado antes de qualquer leitura/escrita).

## Permissões

Qualquer usuário autenticado da empresa pode ver e responder conversas neste MVP. Filtro por "minhas conversas" (responsável) fica disponível mas não obrigatório.

## Endpoints

```text
GET   /api/conversas?status=&pagina=&tamanhoPagina=
GET   /api/conversas/{id}
GET   /api/conversas/{id}/mensagens?pagina=&tamanhoPagina=
POST  /api/conversas/{id}/mensagens        (envia texto)
PATCH /api/conversas/{id}/responsavel
PATCH /api/conversas/{id}/status
```

## Fluxo backend

```text
WebhookProcessingService (chamado pela SPEC-004 após persistir o evento)
      ↓
Extrair telefone + texto + provider_message_id do payload
      ↓
Buscar ou criar Contato (empresa_id + telefone)
      ↓
Buscar ou criar Conversa (contato_id + whatsapp_conta_id)
      ↓
Criar Mensagem (direcao=ENTRADA)
      ↓
Atualizar conversa (ultima_mensagem_em/texto, quantidade_nao_lidas++)
      ↓
Publicar no SignalR (grupo da empresa) → evento "novaMensagem"

Envio (atendente):
POST /api/conversas/{id}/mensagens
      ↓
Validar que a conversa pertence à empresa do usuário
      ↓
Criar Mensagem (direcao=SAIDA, status=ENVIANDO)
      ↓
Chamar WhatsAppCloudApiClient.EnviarTextoAsync
      ↓
Sucesso → status=ENVIADA + provider_message_id
Falha → status=FALHOU, retorna erro tratado (nunca stack trace)
      ↓
Publicar no SignalR
```

## Fluxo frontend

```text
Tela Conversas
      ↓
Lista de conversas (ordenada por ultima_mensagem_em desc)
      ↓
Selecionar conversa → carrega mensagens
      ↓
Assina grupo SignalR da empresa
      ↓
Nova mensagem chega via SignalR → atualiza lista e thread sem reload
      ↓
Atendente digita e envia → POST mensagens → mensagem aparece otimisticamente,
depois confirma com o retorno da API
```

## UX desktop

Layout de duas colunas: lista de conversas à esquerda (~320px), thread de mensagens à direita, com balões de mensagem (entrada à esquerda, saída à direita) e campo de texto fixo no rodapé.

## UX mobile

Uma tela por vez: lista de conversas ocupa a tela toda; ao tocar em uma conversa, navega para a thread (com botão de voltar).

## Segurança

- Toda leitura/escrita de conversa/mensagem valida `EmpresaId` do JWT contra a conversa buscada no banco.
- Conexão SignalR autenticada via JWT; grupos por `EmpresaId` (nunca por dado enviado pelo cliente na conexão).

## Performance

- Índices: `conversas(empresa_id, ultima_mensagem_em)`, `mensagens(conversa_id, created_at)`.
- Paginação nas listagens de conversas e mensagens.
- `AsNoTracking` nas leituras.

## Erros

| Cenário | Status |
|---|---|
| Conversa não encontrada (ou de outra empresa) | 404 |
| Envio falha na WhatsApp Cloud API | 502 (com mensagem amigável) |
| Corpo de mensagem vazio | 400 |

## Critérios de aceite

- [ ] Uma mensagem recebida via webhook cria contato (se necessário), conversa e mensagem corretamente.
- [ ] Mensagens do mesmo contato caem na mesma conversa (não duplicam).
- [ ] O atendente consegue enviar uma mensagem de texto e vê o status atualizado.
- [ ] Novas mensagens aparecem em tempo real na tela sem reload (SignalR).
- [ ] `quantidade_nao_lidas` incrementa em mensagens de entrada e zera ao abrir a conversa.
- [ ] Isolamento multiempresa validado (conversa de uma empresa nunca aparece/é acessível por outra).
- [ ] Tela funciona em desktop (duas colunas) e mobile (uma tela por vez).

## Testes

- Unitários do `WebhookProcessingService`: cria contato novo, reaproveita contato existente, cria conversa nova, reaproveita conversa existente, incrementa não lidas.
- Unitários do `ConversaService`: envio de mensagem grava corretamente, isolamento multiempresa (não acessa conversa de outra empresa).
