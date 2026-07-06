# PLAN - PickTheBest

## 1. Objetivo do Plano

Este documento define o planejamento de implementacao do PickTheBest a partir do `PRD.md`.

O plano esta dividido entre Frontend e Backend/Firebase, com uma ordem recomendada de execucao para entregar primeiro um MVP funcional e depois evoluir a experiencia visual, seguranca e qualidade.

## 2. Stack Recomendada

- Frontend: React + TypeScript + Vite.
- Estilizacao: Tailwind CSS.
- Componentes UI: shadcn/ui.
- Icones: lucide-react.
- Roteamento: React Router.
- Formularios: React Hook Form + Zod.
- Backend e tempo real: Firebase.
- Autenticacao: Firebase Authentication.
- Banco de dados: Cloud Firestore.
- Hospedagem: Firebase Hosting.
- QR Code: qrcode.react.
- Testes: Vitest + React Testing Library.

## 3. Arquitetura de Rotas

### 3.1 Rotas Administrativas

```txt
/admin/login
/admin/votacoes
/admin/votacoes/nova
/admin/votacoes/:votacaoId
/admin/votacoes/:votacaoId/equipes
/admin/votacoes/:votacaoId/criterios
/admin/votacoes/:votacaoId/controle
/admin/votacoes/:votacaoId/resultados
```

### 3.2 Rota Publica da Plateia

```txt
/votar/:votacaoId
```

## 4. Planejamento Backend / Firebase

### 4.1 Configuracao Inicial

- Criar projeto no Firebase.
- Ativar Firebase Authentication com provedor de e-mail e senha.
- Ativar Cloud Firestore.
- Configurar Firebase Hosting.
- Configurar variaveis de ambiente do frontend com as credenciais publicas do Firebase.
- Criar arquivo central de inicializacao do Firebase no frontend.

### 4.2 Modelo de Dados Firestore

Estrutura sugerida:

```txt
votacoes/{votacaoId}
  titulo
  descricao
  status
  createdBy
  createdAt
  updatedAt

votacoes/{votacaoId}/equipes/{equipeId}
  nome
  descricao
  ordem
  createdAt

votacoes/{votacaoId}/criterios/{criterioId}
  titulo
  descricao
  ordem
  createdAt

votacoes/{votacaoId}/votos/{votoId}
  respostas
  createdAt
  clientInfo
```

Status validos da votacao:

```txt
AGUARDANDO
ABERTA
ENCERRADA
```

Formato conceitual de `respostas`:

```json
{
  "criterioId1": "equipeId2",
  "criterioId2": "equipeId1"
}
```

### 4.3 Servicos de Dados

Criar uma camada de servicos para isolar o uso direto do Firebase:

```txt
src/services/authService.ts
src/services/votacoesService.ts
src/services/equipesService.ts
src/services/criteriosService.ts
src/services/votosService.ts
src/services/resultadosService.ts
```

Responsabilidades:

- `authService`: login, logout e observacao do usuario autenticado.
- `votacoesService`: CRUD de votacoes e alteracao de status.
- `equipesService`: CRUD e ordenacao de equipes.
- `criteriosService`: CRUD e ordenacao de criterios.
- `votosService`: registro de votos e validacao de status antes do envio.
- `resultadosService`: leitura e agregacao dos votos por criterio e resultado consolidado.

### 4.4 Regras de Seguranca Firestore

- Administradores autenticados podem criar votacoes.
- Administradores so podem editar ou excluir votacoes criadas por eles.
- Publico pode ler apenas dados necessarios para votar: votacao, equipes, criterios e status.
- Publico pode criar voto somente quando a votacao estiver com status `ABERTA`.
- Publico nao pode editar nem excluir votos.
- Dados administrativos e resultados devem ser protegidos contra leitura publica indevida.

### 4.5 Tempo Real

- Usar listeners `onSnapshot` para status da votacao na tela publica.
- Usar listener ou agregacao para contagem de votos no painel administrativo.
- Atualizar automaticamente telas publicas quando o status mudar para `AGUARDANDO`, `ABERTA` ou `ENCERRADA`.

## 5. Planejamento Frontend

### 5.1 Base do Projeto

- Criar app com Vite, React e TypeScript.
- Configurar Tailwind CSS.
- Configurar shadcn/ui.
- Configurar lucide-react.
- Configurar React Router.
- Criar layout base para area administrativa.
- Criar layout publico mobile-first para a plateia.
- Criar tema com tokens de cores definidos no PRD.

### 5.2 Autenticacao Administrativa

- Criar tela `/admin/login`.
- Implementar formulario com e-mail e senha.
- Integrar login com Firebase Authentication.
- Criar protecao de rotas administrativas.
- Implementar logout.
- Exibir estados de carregamento e erro de autenticacao.

### 5.3 Gestao de Votacoes

- Criar listagem de votacoes em `/admin/votacoes`.
- Criar formulario de nova votacao.
- Criar formulario de edicao de votacao.
- Permitir excluir votacao.
- Exibir status atual de cada votacao.
- Direcionar para detalhes/controle da votacao apos criacao.

### 5.4 Gestao de Equipes

- Criar tela de equipes da votacao.
- Listar equipes cadastradas.
- Criar equipe.
- Editar equipe.
- Remover equipe.
- Manter campo `ordem` para exibicao consistente na votacao publica.

### 5.5 Gestao de Criterios

- Criar tela de criterios da votacao.
- Listar criterios cadastrados.
- Criar criterio.
- Editar criterio.
- Remover criterio.
- Manter campo `ordem` para definir a sequencia do wizard da plateia.

### 5.6 Controle da Votacao

- Criar tela `/admin/votacoes/:votacaoId/controle`.
- Exibir URL publica `/votar/{votacaoId}`.
- Gerar QR Code dinamicamente.
- Permitir copiar link publico.
- Permitir download do QR Code.
- Permitir exibicao do QR Code em tela cheia.
- Exibir controles de status: `AGUARDANDO`, `ABERTA`, `ENCERRADA`.
- Exibir contagem de votos recebidos em tempo real.

### 5.7 Resultados

- Criar tela ou painel de resultados para o administrador.
- Manter resultados ocultos por padrao ao encerrar a votacao.
- Exibir botao "Ver resultado".
- Permitir ocultar novamente os resultados.
- Exibir ranking por criterio.
- Exibir resultado consolidado geral.
- Garantir que resultados nao sejam exibidos na rota publica da plateia.

### 5.8 Experiencia Publica da Plateia

- Criar rota `/votar/:votacaoId`.
- Ler `votacaoId` da URL.
- Carregar dados publicos da votacao, equipes e criterios.
- Exibir loading ou skeleton enquanto os dados carregam.
- Tratar votacao inexistente.
- Verificar `localStorage` com chave `voto_registrado_{votacaoId}`.
- Bloquear voto se o usuario ja votou no mesmo navegador.
- Ouvir status da votacao em tempo real.
- Exibir tela especifica quando a votacao estiver `AGUARDANDO`.
- Exibir tela especifica quando a votacao estiver `ENCERRADA`.
- Iniciar wizard somente quando a votacao estiver `ABERTA`.

### 5.9 Wizard de Votacao

- Renderizar uma etapa por criterio.
- Exibir indicador de progresso, como `Criterio 2 de 5`.
- Exibir equipes em cards grandes e touch-friendly.
- Permitir apenas uma equipe selecionada por criterio.
- Desabilitar avanco sem selecao.
- Permitir voltar para alterar criterios anteriores.
- Manter respostas em estado local ate a revisao.

### 5.10 Revisao e Envio do Voto

- Exibir resumo de todos os criterios e equipes escolhidas.
- Permitir voltar para editar escolhas.
- Exibir botao de confirmacao final.
- Durante envio, mostrar estado de carregamento.
- Salvar voto no Firestore.
- Apos sucesso, gravar `true` em `localStorage`.
- Exibir tela de sucesso clara e amigavel.
- Em caso de erro, nao gravar `localStorage` e exibir mensagem de falha.

### 5.11 UI/UX da Plateia

- Aplicar paleta azul/ciano/dourado inspirada no `background.png`.
- Usar fundo com gradiente azul profundo, ciano e brilho dourado sutil.
- Usar cards com leve transparencia, bordas translucidas, sombras suaves e profundidade.
- Aplicar feedback visual imediato ao selecionar uma equipe.
- Aplicar transicoes suaves entre etapas.
- Criar estados visuais claros para carregamento, erro, aguardando, encerrada, voto ja registrado, envio e sucesso.
- Garantir legibilidade e contraste em telas moveis.

## 6. Ordem Recomendada de Implementacao

### Fase 1 - Fundacao

- Inicializar projeto React + Vite + TypeScript.
- Configurar Tailwind, shadcn/ui, React Router e Firebase.
- Criar estrutura de pastas, rotas e layouts base.
- Criar tipos TypeScript principais: `Votacao`, `Equipe`, `Criterio`, `Voto` e `StatusVotacao`.
- Criar camada inicial de servicos Firebase.

### Fase 2 - Backend e Auth

- Configurar Authentication.
- Criar login administrativo.
- Criar protecao das rotas admin.
- Implementar CRUD de votacoes.
- Implementar regras iniciais do Firestore.

### Fase 3 - Gestao Admin

- Implementar CRUD de equipes.
- Implementar CRUD de criterios.
- Implementar tela de controle da votacao.
- Implementar geracao de link publico e QR Code.
- Implementar mudanca de status.

### Fase 4 - Votacao Publica

- Implementar rota `/votar/:votacaoId`.
- Implementar carregamento de dados publicos.
- Implementar bloqueios por status e `localStorage`.
- Implementar wizard por criterios.
- Implementar revisao.
- Implementar envio do voto.
- Implementar tela de sucesso.

### Fase 5 - Tempo Real e Resultados

- Implementar listener de status na plateia.
- Implementar contagem de votos em tempo real no admin.
- Implementar tela de resultados.
- Manter resultados ocultos ate clique em "Ver resultado".
- Implementar ranking por criterio e consolidado geral.

### Fase 6 - Polimento Visual e Qualidade

- Aplicar refinamento visual da plateia conforme paleta do PRD.
- Revisar responsividade mobile.
- Adicionar feedbacks, skeletons, estados vazios e estados de erro.
- Revisar contraste e legibilidade.
- Criar testes automatizados dos fluxos principais.
- Revisar regras de seguranca do Firestore.

## 7. Testes Recomendados

### 7.1 Testes Frontend

- Login admin com sucesso.
- Login admin com erro.
- Rota admin bloqueada sem autenticacao.
- Criacao de votacao.
- Cadastro de equipes.
- Cadastro de criterios.
- Mudanca de status da votacao.
- Wizard da plateia impedindo avanco sem selecao.
- Revisao exibindo escolhas corretas.
- Tela de sucesso apos envio.
- Bloqueio por `localStorage`.
- Estados de votacao aguardando e encerrada.

### 7.2 Testes Backend/Firebase

- Usuario autenticado cria votacao.
- Usuario nao autenticado nao cria votacao.
- Publico consegue ler dados necessarios para votar.
- Publico nao consegue alterar dados administrativos.
- Publico consegue criar voto apenas quando status e `ABERTA`.
- Publico nao consegue editar ou excluir votos.
- Contagem de votos reflete novos registros.

### 7.3 Testes Manuais de Aceite

- Admin cria uma votacao completa com equipes e criterios.
- Admin exibe QR Code e abre votacao.
- Eleitor acessa pelo celular e vota sem login.
- Eleitor nao consegue votar duas vezes no mesmo navegador.
- Admin encerra votacao.
- Tela publica bloqueia automaticamente apos encerramento.
- Resultado so aparece apos clique em "Ver resultado".
- Interface da plateia permanece legivel e agradavel em dispositivo movel.

## 8. MVP Entregavel

O MVP deve ser considerado pronto quando:

- O administrador conseguir logar.
- O administrador conseguir criar votacao.
- O administrador conseguir cadastrar equipes e criterios.
- O administrador conseguir abrir e encerrar votacao.
- O sistema gerar link publico e QR Code.
- A plateia conseguir votar pelo link sem login.
- O sistema bloquear voto duplicado no mesmo navegador.
- O voto for salvo no Firestore.
- O painel admin exibir contagem de votos.
- O resultado ficar oculto ate o clique em "Ver resultado".

## 9. Itens Fora do MVP

- Login ou cadastro de eleitores.
- Validacao antifraude forte.
- Aplicativo nativo.
- Votacao offline.
- Multiplos modelos de votacao.
- Comentarios abertos por criterio.
- Exportacao avancada de relatorios.

