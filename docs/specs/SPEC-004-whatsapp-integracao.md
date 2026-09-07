# SPEC-004 — Integração com WhatsApp (Cloud API)

## Título

Conexão da empresa com o WhatsApp Business Platform (Cloud API) e recebimento de webhooks

## Objetivo

Permitir que cada empresa conecte seu próprio número do WhatsApp Business (via Meta Cloud API) ao WhatsCRM, e que o backend receba e valide webhooks de mensagens de forma segura, idempotente e rastreável — sem qualquer segredo exposto ao frontend.

## Problema

A plataforma é multiempresa: cada empresa tem sua própria conta WhatsApp Business (phone number ID, WABA ID, token de acesso). O sistema precisa armazenar essas credenciais com segurança, identificar a qual empresa pertence cada webhook recebido, e nunca processar o mesmo evento duas vezes.

## Escopo

- Entidade `WhatsappConta`: credenciais e metadados da conta WhatsApp de uma empresa.
- Endpoint de configuração da conta WhatsApp (tela em Configurações).
- Endpoint de verificação do webhook (handshake `GET`, exigido pela Meta).
- Endpoint de recebimento do webhook (`POST`), com validação de assinatura HMAC e persistência idempotente em `webhook_eventos`.
- Cliente HTTP para a WhatsApp Cloud API (envio de mensagens de texto), usado pela SPEC-005.

## Fora do escopo

- Templates de mensagem (HSM) e mensagens fora da janela de 24h.
- Envio de mídia (imagem/áudio/documento) — texto apenas neste MVP.
- Onboarding automatizado via Embedded Signup da Meta (o cadastro das credenciais é manual nesta fase).
- Múltiplas contas WhatsApp por empresa simultaneamente (o modelo de dados permite, mas o MVP assume uma conta ativa por empresa).

## Atores

- Administrador da empresa (configura a conta WhatsApp).
- Meta/WhatsApp Cloud API (origem dos webhooks).

## Entidades

### `whatsapp_contas`

| Campo | Tipo | Observações |
|---|---|---|
| id | uuid | PK |
| empresa_id | uuid | FK → empresas.id |
| phone_number_id | varchar(50) | ID do número na Cloud API, único globalmente |
| waba_id | varchar(50) | WhatsApp Business Account ID |
| numero_exibicao | varchar(30) | número formatado (ex.: +55 11 99999-9999) |
| access_token_criptografado | text | token de acesso, protegido com Data Protection API |
| ativo | boolean | default true |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### `webhook_eventos`

| Campo | Tipo | Observações |
|---|---|---|
| id | uuid | PK |
| empresa_id | uuid | nullable até resolver a conta (ver regra 3) |
| whatsapp_conta_id | uuid | FK → whatsapp_contas.id, nullable até resolver |
| provider_event_id | varchar(100) | id da mensagem/evento na Meta — chave de idempotência |
| tipo | varchar(30) | `MENSAGEM`, `STATUS`, `OUTRO` |
| payload | jsonb | corpo bruto do webhook, para auditoria/reprocessamento |
| processado | boolean | default false |
| created_at | timestamptz | |
| processed_at | timestamptz | nullable |

## Relacionamentos

- `Empresa 1 — N WhatsappConta` (modelo permite mais de uma, MVP usa uma ativa).
- `WhatsappConta 1 — N WebhookEvento`.

## Regras

1. `phone_number_id` é único globalmente (é um identificador da Meta, não da nossa empresa).
2. O token de acesso nunca é retornado pela API depois de salvo (apenas write-only) e nunca aparece em nenhum DTO de resposta.
3. Ao receber um webhook, a empresa é resolvida pelo `phone_number_id` presente no payload (`entry[].changes[].value.metadata.phone_number_id`), buscando a `WhatsappConta` correspondente — **nunca** por dado enviado como header/query pelo cliente.
4. Todo evento é gravado em `webhook_eventos` antes de processar. Se `provider_event_id` já existir, o evento é ignorado (idempotência) e a resposta é `200 OK` do mesmo jeito — a Meta reenvia eventos em caso de erro ou timeout, então "já processado" nunca deve virar erro.
5. A validação de assinatura (`X-Hub-Signature-256`, HMAC-SHA256 com o *App Secret*) é obrigatória antes de aceitar qualquer payload — payloads inválidos retornam 401.
6. O endpoint de verificação (`GET`) deve responder ao `hub.challenge` somente se `hub.verify_token` bater com o valor configurado (variável de ambiente/appsettings, nunca hardcoded).

## Permissões

Apenas `ADMINISTRADOR` e `GESTOR` podem criar/editar a `WhatsappConta` da empresa. Os endpoints de webhook são públicos (chamados pela Meta), protegidos pela validação de assinatura — não usam JWT.

## Endpoints

```text
GET  /api/whatsapp-contas              (dados da conta da empresa, sem o token)
POST /api/whatsapp-contas              (cria/atualiza a conta da empresa)
DELETE /api/whatsapp-contas/{id}       (desativa a conta)

GET  /api/webhooks/whatsapp            (verificação Meta — hub.mode/hub.verify_token/hub.challenge)
POST /api/webhooks/whatsapp            (recebimento de eventos)
```

## Fluxo backend

```text
Meta envia POST /api/webhooks/whatsapp
      ↓
Validar assinatura X-Hub-Signature-256
      ↓
Inválida? → 401
      ↓
Válida → extrair phone_number_id do payload
      ↓
Buscar WhatsappConta (e EmpresaId) pelo phone_number_id
      ↓
provider_event_id já existe em webhook_eventos?
      ↓
SIM → retornar 200 (idempotente, não reprocessa)
      ↓
NÃO → persistir em webhook_eventos (processado=false)
      ↓
Delegar para o processamento (SPEC-005: contato → conversa → mensagem)
      ↓
Marcar processado=true, processed_at=now
      ↓
Responder 200 rapidamente (processamento pesado não deve bloquear a resposta)
```

## Fluxo frontend

```text
Configurações → WhatsApp
      ↓
Formulário: phone_number_id, waba_id, número de exibição, access token
      ↓
Salvar → POST /api/whatsapp-contas
      ↓
Tela mostra status "Conectado" com o número, sem nunca exibir o token salvo
```

## UX desktop / mobile

Formulário simples de uma coluna, com instruções curtas de onde encontrar cada valor no Meta for Developers. Funciona igual em mobile (campos empilhados).

## Segurança

- Token de acesso da Meta: criptografado em repouso (ASP.NET Core Data Protection), nunca logado, nunca devolvido em respostas HTTP.
- Assinatura HMAC obrigatória em todo webhook.
- `hub.verify_token` da configuração de webhook fica em variável de ambiente (`WhatsApp:VerifyToken`), nunca no código.
- Endpoints de webhook não exigem JWT (a Meta não tem um), mas são os únicos endpoints públicos da API — qualquer novo endpoint público exige revisão explícita.

## Performance

- Índice único em `whatsapp_contas(phone_number_id)`.
- Índice em `webhook_eventos(provider_event_id)` para checagem rápida de idempotência.
- Resposta do webhook deve ser rápida (processamento síncrono simples é aceitável no MVP; filas ficam para quando o volume justificar — não antecipar).

## Erros

| Cenário | Status |
|---|---|
| Assinatura inválida/ausente | 401 |
| `phone_number_id` não corresponde a nenhuma `WhatsappConta` | 200 (loga e ignora — não expõe detalhes à Meta) |
| `hub.verify_token` incorreto na verificação | 403 |
| Configuração de conta com dados inválidos | 400 |

## Critérios de aceite

- [ ] É possível cadastrar a conta WhatsApp de uma empresa pela tela de Configurações.
- [ ] O token de acesso nunca aparece em nenhuma resposta da API após salvo.
- [ ] O endpoint de verificação responde corretamente ao handshake da Meta.
- [ ] Webhooks com assinatura inválida são rejeitados com 401.
- [ ] Eventos com `provider_event_id` repetido não geram efeitos duplicados.
- [ ] O `EmpresaId` de um evento é sempre resolvido pelo `phone_number_id`, nunca por dado do cliente.

## Testes

- Unitários: validação de assinatura HMAC (válida/inválida), resolução de empresa por `phone_number_id`, idempotência (mesmo `provider_event_id` duas vezes só processa uma).
- Unitários: verificação do handshake (`hub.verify_token` correto/incorreto).
