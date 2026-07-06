# PRD - PickTheBest

## 1. Visao Geral

O PickTheBest e um Sistema de Votacao Interativa em formato de plataforma dinamica, projetado para coletar avaliacoes em tempo real durante apresentacoes de pitches, demonstracoes de prototipos e atividades avaliativas com participacao de plateia.

O produto deve permitir que um professor, organizador ou avaliador crie uma sessao de votacao, cadastre equipes participantes, defina criterios de avaliacao e compartilhe um link ou QR Code publico para que a plateia vote pelo celular, sem login e sem instalacao de aplicativo.

A solucao sera implementada como uma Single Page Application (SPA), suportada pela infraestrutura do Google Firebase, com sincronizacao em tempo real entre o painel do administrador e as telas dos eleitores.

## 2. Objetivos do Produto

- Reduzir a friccao para participacao da plateia em votacoes ao vivo.
- Permitir que o administrador tenha controle total sobre o ciclo da votacao.
- Sincronizar o status da votacao em tempo real para todos os usuarios.
- Evitar exposicao acidental dos resultados durante o compartilhamento de tela.
- Fornecer uma base tecnica escalavel para picos de acesso simultaneo.

## 3. Perfis de Usuario

### 3.1 Administrador / Organizador

Usuario responsavel por criar e gerenciar votacoes. Geralmente sera um professor, avaliador, coordenador de evento ou organizador de uma apresentacao.

O administrador deve conseguir:

- Fazer login em uma area restrita.
- Criar multiplas sessoes de votacao independentes.
- Cadastrar equipes ou grupos participantes.
- Definir criterios de avaliacao.
- Compartilhar link e QR Code da votacao.
- Controlar o status da votacao.
- Acompanhar a contagem de votos em tempo real.
- Visualizar os resultados somente quando decidir exibi-los.

### 3.2 Plateia / Eleitores

Usuarios que participam da votacao a partir de um celular, tablet ou navegador. O foco da experiencia deve ser velocidade, clareza e ausencia de friccao.

O eleitor deve conseguir:

- Acessar a votacao por QR Code ou link publico.
- Votar sem criar conta e sem fazer login.
- Percorrer um fluxo simples em formato de passo a passo.
- Escolher uma equipe por criterio de avaliacao.
- Revisar as escolhas antes de enviar.
- Receber bloqueio automatico caso a votacao ainda nao esteja aberta, ja tenha sido encerrada ou o voto ja tenha sido registrado no navegador.

## 4. Escopo Funcional

O MVP do PickTheBest deve contemplar:

- Painel administrativo autenticado.
- Criacao e gestao de sessoes de votacao.
- Cadastro de grupos/equipes.
- Cadastro de criterios de avaliacao.
- Geracao de URL publica de votacao.
- Geracao e exibicao de QR Code.
- Controle de status da votacao.
- Fluxo publico de votacao mobile-first.
- Persistencia dos votos.
- Bloqueio basico de voto duplicado via `localStorage`.
- Contagem de votos em tempo real.
- Tela de resultados protegida por acao explicita do administrador.

## 5. Premissas Tecnicas

- A aplicacao sera uma SPA.
- O frontend sera responsivo, com prioridade mobile para a experiencia da plateia.
- O Firebase sera utilizado como principal infraestrutura da solucao.
- O Firebase Hosting sera usado para hospedar a SPA.
- O Firebase Authentication sera usado para login do administrador via e-mail e senha.
- O Firestore sera usado para armazenar sessoes, equipes, criterios, votos e status da votacao.
- A sincronizacao em tempo real sera feita com listeners do Firestore, como `onSnapshot`.
- O eleitor nao tera autenticacao obrigatoria.

## 6. Modelo de Votacao

O modelo oficial de votacao do PickTheBest sera escolha unica por criterio.

Para cada criterio cadastrado pelo administrador, o eleitor deve visualizar todas as equipes disponiveis e selecionar exatamente uma equipe. Ao final do fluxo, o sistema deve apresentar uma tela de revisao com todas as escolhas antes do envio definitivo.

Exemplo:

- Criterio 1: Melhor problema identificado -> eleitor escolhe uma equipe.
- Criterio 2: Melhor solucao proposta -> eleitor escolhe uma equipe.
- Criterio 3: Melhor demonstracao de prototipo -> eleitor escolhe uma equipe.

Cada voto registrado deve conter as escolhas do eleitor para todos os criterios da votacao.

## 7. Diretrizes de UI/UX da Plateia

A experiencia da plateia deve ser moderna, amigavel e visualmente agradavel, com foco em celulares e uso rapido durante eventos presenciais. A interface publica deve transmitir clareza, confianca e fluidez, evitando telas carregadas ou excesso de texto.

A identidade visual da experiencia de votacao deve ser inspirada na imagem de referencia `background.png`, utilizando uma base azul/ciano com profundidade escura e pontos de destaque em dourado/amarelo.

### 7.1 Paleta de Cores

| Uso | Cor | Hex |
| --- | --- | --- |
| Azul profundo | Base escura e profundidade visual | `#063B78` |
| Azul principal | Elementos principais e areas de destaque | `#006CB5` |
| Ciano vibrante | Acoes primarias, foco e estados ativos | `#00BFEA` |
| Azul petroleo | Variacao de fundo e apoio visual | `#1D6F86` |
| Dourado/amarelo | Destaques, confirmacoes visuais e pontos de atencao | `#F2C94C` |
| Fundo escuro | Base de contraste para telas publicas | `#061827` |
| Texto claro | Texto principal sobre fundos escuros | `#F8FAFC` |
| Texto secundario | Descricoes, estados auxiliares e metadados | `#B8C7D9` |
| Sucesso | Confirmacao de voto enviado | `#22C55E` |
| Erro/bloqueio | Erros, votacao indisponivel ou voto ja registrado | `#EF4444` |

### 7.2 Direcao Visual

- A tela publica deve usar fundo com gradiente inspirado na imagem de referencia, combinando azul profundo, ciano e brilho dourado sutil.
- Os cards de equipes devem ter aparencia moderna, com leve transparencia, bordas translucidas, sombra suave e efeito de profundidade.
- Quando tecnicamente adequado, os cards e paineis podem usar `backdrop-blur` para criar efeito de vidro discreto.
- Os botoes devem ser grandes, legiveis e otimizados para toque, com hierarquia clara entre acao primaria e secundaria.
- O estado selecionado de uma equipe deve ser imediatamente perceptivel, usando borda em ciano ou dourado, icone de confirmacao e leve destaque visual.
- A interface deve manter boa legibilidade em telas moveis, inclusive em ambientes de auditorio com luminosidade variavel.

### 7.3 Feedbacks e Microinteracoes

- O sistema deve exibir loading ou skeleton enquanto carrega os dados da votacao.
- A selecao de uma equipe deve gerar feedback visual imediato, como leve aumento de escala, alteracao de borda ou mudanca de sombra.
- A navegacao entre etapas do wizard deve usar transicoes suaves e rapidas.
- O usuario deve visualizar claramente seu progresso no fluxo, por exemplo: `Criterio 2 de 5`.
- Erros de carregamento, voto ja registrado, votacao aguardando e votacao encerrada devem ter mensagens claras, amigaveis e visualmente distintas.
- A confirmacao final do voto deve exibir feedback de envio, sucesso ou falha de forma objetiva.

## 8. Requisitos Funcionais

| ID | Modulo | Descricao do Requisito |
| --- | --- | --- |
| RF01 | Admin | O sistema deve permitir que o Administrador faca login via e-mail e senha usando Firebase Authentication. |
| RF02 | Admin | O Administrador deve ser capaz de criar, listar, editar e excluir sessoes de votacao. |
| RF03 | Admin | O Administrador deve ser capaz de cadastrar, editar e remover grupos/equipes dentro de uma votacao. |
| RF04 | Admin | O Administrador deve ser capaz de cadastrar, editar e remover criterios de avaliacao dentro de uma votacao, definindo sua ordem de exibicao. |
| RF05 | Admin | O sistema deve gerar uma URL publica exclusiva para cada votacao criada no formato `/votar/{votacaoId}`. |
| RF06 | Admin | O painel do Administrador deve exibir um QR Code gerado dinamicamente a partir da URL exclusiva da votacao, permitindo download e exibicao em tela cheia. |
| RF07 | Admin | O Administrador deve possuir controles em tempo real para alterar o status da votacao ativa entre `AGUARDANDO`, `ABERTA` e `ENCERRADA`. |
| RF08 | Admin | O painel do Administrador deve exibir a contagem de votos recebidos em tempo real, usando agregacao ou listeners do Firestore. |
| RF09 | Admin | Ao encerrar uma votacao, o resultado deve permanecer oculto ate que o Administrador clique explicitamente em "Ver resultado". |
| RF10 | Admin | O sistema deve permitir que o Administrador oculte novamente a visualizacao dos resultados, caso esteja compartilhando a tela. |
| RF11 | Plateia | A SPA deve extrair o `{votacaoId}` diretamente da URL publica para carregar os dados correspondentes do banco. |
| RF12 | Plateia | O sistema deve verificar o `localStorage` do dispositivo usando uma chave indexada pelo ID da votacao, no formato `voto_registrado_{votacaoId}`. |
| RF13 | Plateia | Se o valor `voto_registrado_{votacaoId}` for `true`, o usuario deve ser redirecionado para uma tela de bloqueio por voto ja efetuado. |
| RF14 | Plateia | O sistema deve ouvir mudancas de status da votacao via listener em tempo real. |
| RF15 | Plateia | Se o status da votacao for `AGUARDANDO` ou `ENCERRADA`, as telas de votacao devem ser bloqueadas dinamicamente. |
| RF16 | Plateia | O fluxo de votacao deve ser renderizado em formato de passo a passo, exibindo uma tela dedicada para cada criterio cadastrado. |
| RF17 | Plateia | Cada tela de criterio deve exibir os grupos/equipes em cards selecionaveis, otimizados para toque em dispositivos moveis. |
| RF18 | Plateia | O eleitor deve poder selecionar apenas uma equipe por criterio. |
| RF19 | Plateia | O sistema deve apresentar uma tela de revisao contendo o resumo de todas as escolhas antes do envio definitivo. |
| RF20 | Plateia | Ao confirmar o voto, o sistema deve salvar o registro na colecao de votos da votacao no Firestore. |
| RF21 | Plateia | Apos a confirmacao de sucesso do banco de dados, o sistema deve gravar `true` no `localStorage` do usuario para a chave `voto_registrado_{votacaoId}`. |
| RF22 | Plateia | A interface da plateia deve ser moderna, amigavel, mobile-first, com textos legiveis, botoes grandes, feedbacks visuais claros e fluxo otimizado para uso rapido em auditorio. |
| RF23 | Plateia | O wizard de votacao deve exibir indicador de progresso, informando ao eleitor em qual criterio ou etapa ele esta. |
| RF24 | Plateia | A interface deve exibir estados visuais especificos para carregamento, erro, votacao aguardando, votacao encerrada, voto ja registrado, selecao de equipe, envio em andamento e voto enviado com sucesso. |
| RF25 | Plateia | A tela de sucesso deve confirmar de forma clara que o voto foi registrado e orientar o usuario de que nenhuma acao adicional e necessaria. |
| RF26 | Sistema | O sistema deve impedir gravacao de votos quando a votacao nao estiver com status `ABERTA`. |
| RF27 | Sistema | As regras do Firestore devem proteger dados administrativos contra leitura e escrita nao autorizadas por usuarios publicos. |
| RF28 | Sistema | Os dados publicos necessarios para votacao devem estar disponiveis somente na medida necessaria para exibir equipes, criterios e status da votacao. |

## 9. Requisitos Nao Funcionais

| ID | Categoria | Descricao |
| --- | --- | --- |
| RNF01 | Usabilidade | A experiencia da plateia deve exigir o minimo de passos possivel e nao deve exigir login. |
| RNF02 | Responsividade | A interface publica de votacao deve priorizar dispositivos moveis. |
| RNF03 | Tempo Real | Mudancas de status e contagem de votos devem ser refletidas em tempo real. |
| RNF04 | Escalabilidade | A arquitetura deve suportar picos de acessos simultaneos durante eventos presenciais. |
| RNF05 | Seguranca | Operacoes administrativas devem exigir autenticacao. |
| RNF06 | Privacidade Operacional | Resultados nao devem ser exibidos automaticamente apos o encerramento da votacao. |
| RNF07 | Confiabilidade | O voto so deve ser marcado como registrado no navegador apos confirmacao de persistencia no Firestore. |
| RNF08 | Experiencia Visual | A interface publica deve seguir a paleta azul/ciano/dourado inspirada na imagem de referencia e manter contraste adequado para leitura em dispositivos moveis. |
| RNF09 | Feedback | A interface deve responder visualmente as acoes do eleitor, reduzindo incerteza durante selecao, revisao e envio do voto. |

## 10. Fluxos Principais

### 10.1 Fluxo do Administrador

1. Administrador acessa o painel restrito.
2. Sistema solicita login via e-mail e senha.
3. Administrador cria uma nova sessao de votacao.
4. Administrador cadastra equipes/grupos.
5. Administrador cadastra criterios de avaliacao e define sua ordem.
6. Sistema gera URL publica e QR Code.
7. Administrador projeta o QR Code para a plateia.
8. Administrador altera o status para `ABERTA`.
9. Plateia vota em tempo real.
10. Administrador acompanha a contagem de votos.
11. Administrador altera o status para `ENCERRADA`.
12. Sistema mantem o resultado oculto.
13. Administrador clica em "Ver resultado" quando quiser exibir o resultado.

### 10.2 Fluxo da Plateia

1. Eleitor escaneia o QR Code ou acessa o link publico.
2. Sistema identifica o `{votacaoId}` pela URL.
3. Sistema consulta os dados publicos da votacao.
4. Sistema verifica o status da votacao.
5. Sistema verifica se ja existe voto registrado no `localStorage`.
6. Se a votacao estiver aberta e nao houver voto registrado, o eleitor inicia o wizard.
7. Eleitor escolhe uma equipe por criterio.
8. Sistema apresenta tela de revisao.
9. Eleitor confirma o envio.
10. Sistema salva o voto no Firestore.
11. Sistema grava a marcacao de voto no `localStorage`.
12. Sistema exibe tela de sucesso.

## 11. Modelo Conceitual de Dados

### 11.1 Votacao

Campos sugeridos:

- `id`
- `titulo`
- `descricao`
- `status`: `AGUARDANDO`, `ABERTA` ou `ENCERRADA`
- `createdBy`
- `createdAt`
- `updatedAt`

### 11.2 Equipe / Grupo

Campos sugeridos:

- `id`
- `votacaoId`
- `nome`
- `descricao`
- `ordem`
- `createdAt`

### 11.3 Criterio

Campos sugeridos:

- `id`
- `votacaoId`
- `titulo`
- `descricao`
- `ordem`
- `createdAt`

### 11.4 Voto

Campos sugeridos:

- `id`
- `votacaoId`
- `respostas`
- `createdAt`
- `clientInfo`

O campo `respostas` deve armazenar a relacao entre criterio e equipe escolhida.

Exemplo conceitual:

```json
{
  "criterioId1": "equipeId2",
  "criterioId2": "equipeId1",
  "criterioId3": "equipeId4"
}
```

## 12. Regras de Negocio

- Uma votacao so pode receber votos quando estiver com status `ABERTA`.
- Cada eleitor deve selecionar uma equipe para cada criterio antes de revisar e enviar.
- O voto deve ser persistido antes de marcar o navegador como ja utilizado para aquela votacao.
- O bloqueio por `localStorage` nao deve ser tratado como mecanismo antifraude absoluto, mas como barreira simples contra votos duplicados na mesma sessao/navegador.
- Resultados encerrados devem ficar visiveis apenas para o administrador.
- Resultados nao devem aparecer automaticamente no painel ao encerrar a votacao.
- A tela publica deve reagir automaticamente quando o administrador alterar o status da votacao.

## 13. Criterios de Aceite

- O administrador consegue autenticar-se com e-mail e senha.
- O administrador consegue criar, editar, listar e excluir sessoes de votacao.
- O administrador consegue cadastrar equipes e criterios em uma votacao.
- O sistema gera link publico no formato `/votar/{votacaoId}`.
- O sistema gera QR Code a partir do link publico.
- O administrador consegue abrir e encerrar uma votacao.
- A plateia consegue votar sem login quando a votacao esta aberta.
- A plateia nao consegue votar quando a votacao esta aguardando ou encerrada.
- O eleitor consegue selecionar uma equipe por criterio.
- O eleitor visualiza uma tela de revisao antes de confirmar.
- O voto e salvo no Firestore.
- O `localStorage` e atualizado somente apos sucesso no salvamento do voto.
- O mesmo navegador e bloqueado ao tentar votar novamente na mesma votacao.
- O painel administrativo exibe contagem de votos em tempo real.
- O resultado da votacao encerrada permanece oculto ate o clique em "Ver resultado".
- A interface da plateia segue a paleta azul/ciano/dourado inspirada na imagem de referencia.
- A interface da plateia apresenta contraste e legibilidade adequados em dispositivos moveis.
- O eleitor identifica claramente em qual etapa do wizard esta.
- Os cards de equipe sao faceis de tocar e deixam a selecao evidente.
- O sistema apresenta feedbacks claros para carregamento, selecao, revisao, envio, sucesso e bloqueio.

## 14. Fora de Escopo Inicial

- Login ou cadastro de eleitores.
- Validacao antifraude forte por CPF, e-mail, IP ou dispositivo.
- Votacao offline.
- Aplicativo nativo para iOS ou Android.
- Suporte a multiplos modelos de votacao no MVP.
- Comentarios abertos por criterio.
- Exportacao avancada de relatorios.

## 15. Riscos e Consideracoes

- O bloqueio por `localStorage` pode ser contornado limpando dados do navegador ou usando outro dispositivo.
- Eventos com muitos acessos simultaneos exigem atencao ao desenho das leituras e escritas no Firestore para evitar custos ou gargalos desnecessarios.
- A exibicao de resultados deve ser cuidadosamente separada do encerramento da votacao para evitar exposicao acidental em tela compartilhada.
- Regras de seguranca do Firestore devem ser tratadas como parte essencial da implementacao, nao como etapa opcional.
