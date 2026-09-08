# App Secoe

Aplicativo mobile (front-end) para atendimento de emergências em campo, construído em
**React Native + TypeScript + Expo**, inspirado nas telas do app SIGA transcritas em
`PREENCHIMENTO_APP_SIGA_CAPTURAS_E_TRANSCRICAO.zip` (ocorrência ID SIGA 0462 / SAP ID 159501,
cliente Ambipar Response SA).

Este é um protótipo **somente de front-end**: todo o estado da ocorrência vive em memória
(React Context + `useReducer`), não há chamadas a nenhuma API/backend.

## Stack

- [Expo](https://docs.expo.dev/) SDK 57 (managed workflow)
- React Native 0.86 + React 19
- TypeScript (strict)
- React Navigation (native-stack + bottom-tabs)
- `expo-image-picker` para captura de fotos (câmera/galeria)
- `react-native-svg` para o campo de assinatura desenhada à mão

## Como rodar

```bash
npm install
npm run start     # abre o Metro / Expo Dev Tools — escaneie o QR code com o app Expo Go
npm run android   # emulador/dispositivo Android
npm run ios       # simulador iOS (necessita macOS)
npm run web       # versão web (requer `npx expo install react-dom react-native-web`)
```

## Fluxo implementado

A navegação segue a sequência registrada na gravação original:

1. **Abas iniciais** — Novas Emergências / Em Campo / Atendimentos Programados / Finalizados,
   cada uma listando a ocorrência SIGA 0462 conforme seu status atual.
2. **Resumo da emergência** → confirmação "Sou o motorista da viatura" → **Diálogo de
   segurança** (18 itens Sim/Não, incluindo a pergunta final sobre dúvidas).
3. **Abertura de KM** — placa, KM inicial e seleção de operador (com o aviso simulado de
   erro de integração Omnilink) → tela de confirmação "Emergência iniciada com sucesso!".
4. **Painel da emergência** — Iniciar OS, Diárias, Recursos, Deslocamento, APT e Finalizar
   emergência.
5. **Iniciar OS** — etapas progressivas: Avaliação inicial do cenário → Descrição das
   atividades → Lançamentos → Assinatura.
   - **Avaliação inicial do cenário**: descrição, vazamento, proximidade de rios/lagos,
     vítimas fatais, embarcador/transportador/destinatário, uso e ocupação do solo,
     fluidos do equipamento, pontos de área afetada (lista dinâmica), representantes
     envolvidos (lista dinâmica) e anexo de foto via câmera/galeria.
   - **Descrição das atividades**: lista de atividades com descrição e fotos anexadas.
   - **Lançamentos**: categorias (equipamentos de monitoramento, equipamentos de
     transbordo, serviços adicionais) com busca, unidade, quantidade, descarte e placa.
   - **Resumo e assinatura**: contadores de deslocamentos/lançamentos, campo de assinatura
     manuscrita e confirmação de finalização da OS do dia.
6. **Deslocamento** — os quatro marcos (abertura de KM inicial, chegada na emergência,
   saída da emergência, chegada na base), cada um registrado sequencialmente com KM e
   placa.
7. **Recursos** — estado vazio, como na gravação original.
8. **Finalizar emergência** — confirmação do motorista e placa, seguido do **Checklist do
   veículo** em 5 seções (Estado Geral, Equipamentos Obrigatórios de Segurança, Fluidos,
   Instalação Elétrica, Rodante), cada item com Sim/Não/Não aplicável e observação
   opcional.
9. **Encerramento** — mensagem final de sucesso e retorno à aba "Finalizados".

## Estrutura de pastas

```
src/
  components/   Componentes de UI reutilizáveis (botões, campos, cabeçalho, etc.)
  context/      OccurrenceContext — estado global da ocorrência (useReducer)
  data/         Dados mock iniciais (diálogo de segurança, checklist do veículo, etc.)
  navigation/   Configuração de navegação (stack + tabs) e tipos de rota
  screens/      Telas do fluxo, uma por arquivo
  theme/        Paleta de cores, espaçamentos e tipografia
  types/        Modelos de dados TypeScript
  utils/        Helpers (seleção de foto via expo-image-picker)
```

## Observações

- Os dados da ocorrência (ID SIGA, cliente, produto, diálogo de segurança etc.) refletem
  o conteúdo transcrito do vídeo de referência.
- Os itens de menu "Diárias" e "APT" aparecem no painel da emergência (como no vídeo),
  mas não tiveram uma tela capturada na gravação — por isso exibem um aviso informativo
  ao serem tocados.
- Não há persistência entre sessões: reiniciar o app volta ao estado inicial
  ("Não inicializado").
