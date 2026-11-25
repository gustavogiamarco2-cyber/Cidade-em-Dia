# Cidade em Dia

Cidade em Dia é uma aplicação frontend para registrar, acompanhar e gerenciar ocorrências urbanas. O projeto demonstra o fluxo de comunicação entre cidadãos e equipes de atendimento, com dados locais no navegador. Não há integração com backend ou banco de dados centralizado nesta etapa.

## Tecnologias

Versões conforme declaradas em `Cidade-em-Dia/package.json`:

- Angular: `^22.2.0`; Angular CLI e Angular Build: `^22.2.4`.
- Angular Material e CDK: `~22.2.4`.
- TypeScript: `~6.0.2`.
- RxJS: `~7.8.0`.
- Vitest: `^5.0.0`.
- npm: `11.19.0` (`packageManager`).

É necessário ter Node.js compatível com Angular 22 e npm instalado.

## Arquitetura

- Aplicação Angular organizada por **NgModules**; componentes, diretivas e pipes gerados pelo projeto usam `standalone: false`.
- Roteamento Angular configurado em módulos, com carregamento lazy das áreas da aplicação.
- Angular Material utilizado nas telas, formulários, tabelas, diálogos, cartões e notificações.
- A aplicação inicializa no navegador. SSR e SSG não estão configurados nem habilitados.

## Instalação e execução

Na raiz do repositório, entre na pasta do frontend e instale as dependências:

```bash
cd Cidade-em-Dia
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm start
```

Abra `http://localhost:4200`.

Para executar os testes unitários uma vez:

```bash
npm test -- --watch=false
```

Para gerar o build de produção:

```bash
npm run build
```

O build é gerado em `Cidade-em-Dia/dist/Cidade-em-Dia/browser`. Os comandos correspondem aos scripts declarados no `package.json` do frontend. Não há script de testes end-to-end configurado.

## Perfis e funcionalidades

A autenticação é demonstrativa: qualquer senha é aceita e o perfil é inferido pelo e-mail informado. E-mails que contêm `admin` acessam o perfil Administrador; se não contiverem `admin`, mas contiverem `atendente`, acessam Atendente; os demais acessam Cidadão. Isso não representa autenticação ou autorização seguras.

### Cidadão

- Criar uma conta de cidadão e entrar na aplicação.
- Registrar ocorrências com categoria, urgência, endereço, descrição e foto opcional.
- Consultar ocorrências, filtrar por status, abrir detalhes e confirmar uma ocorrência.
- Consultar os marcadores na tela de mapa ilustrativo.

### Atendente

- Consultar a fila de ocorrências não resolvidas e filtrar por status.
- Abrir detalhes e atualizar o status de uma ocorrência.
- Cada mudança real de status gera um registro de Atendimento com usuário responsável, ocorrência, status anterior e novo, e data. O histórico anterior é mantido.

### Administrador

- Consultar o dashboard e filtrar ocorrências por categoria, status, prioridade e região.
- Gerenciar usuários, categorias e ocorrências por meio das telas administrativas.
- Consultar estatísticas de resolução, status, urgência e região.

O dashboard apresenta quatro indicadores calculados a partir dos dados: **total de ocorrências**, **em análise**, **em andamento** e **resolvidas**.

## Entidades e relacionamentos

O frontend representa quatro entidades de negócio:

- **Usuário**: nome, e-mail, perfil e situação.
- **Categoria**: nome e situação.
- **Ocorrência**: título, descrição, endereço, urgência, prioridade, status, confirmações e foto opcional.
- **Atendimento**: registro de uma mudança de status, com data, status anterior e novo.

Os relacionamentos são feitos por identificadores:

- Um Usuário pode registrar várias Ocorrências; cada Ocorrência referencia o usuário autor por `usuarioId`.
- Uma Categoria pode classificar várias Ocorrências; cada Ocorrência referencia a categoria por `categoriaId`.
- Uma Ocorrência pode ter vários Atendimentos; cada Atendimento referencia a ocorrência por `ocorrenciaId`.
- Um Usuário pode ser responsável por vários Atendimentos; cada Atendimento referencia o responsável por `usuarioId`.

O diagrama de classes, incluindo entidades, atributos, enumerações e cardinalidades, está em [diagrama-classes.mmd](diagrama-classes.mmd).

## Persistência e limitações conhecidas

Usuários, categorias, ocorrências e atendimentos são persistidos no `localStorage` do navegador. Os dados de exemplo são carregados quando ainda não há uma lista salva; alterações posteriores são mantidas localmente. A sessão de autenticação é armazenada separadamente em `sessionStorage`.

Essa persistência é restrita ao navegador e dispositivo utilizados: não há sincronização entre usuários ou dispositivos, nem API ou banco de dados centralizado. Limpar os dados do navegador remove as informações locais; o armazenamento também está sujeito à capacidade disponível no navegador.

Limitações funcionais conhecidas:

- O mapa é ilustrativo: os marcadores não correspondem a geocodificação ou posições geográficas reais.
- A tela **Minhas Ocorrências** ainda não filtra pelo cidadão da sessão e apresenta a lista global.
- A autenticação é simulada e não deve ser usada como mecanismo real de segurança.

## Estrutura do repositório

- `Cidade-em-Dia/`: aplicação Angular e documentação específica do frontend.
- `diagrama-classes.mmd`: diagrama das entidades e seus relacionamentos.

Consulte [Cidade-em-Dia/README.md](Cidade-em-Dia/README.md) para detalhes sobre a organização do frontend.

## Integrantes

- Kauan Ribeiro — 273006.
- Otávio Siqueira Freire dos Santos — 273524.
- Luiz Gustavo Legori Ramos — 273066.
- Marcos Vinicius Gonçalves Miotto — 272975.
- Pedro Henrique Cavalheiro Martins — 272747.
- Gustavo Rodrigues Giamarco — 272805.
