# Cidade-em-Dia

Cidade-em-Dia é uma aplicação Angular para o registro, acompanhamento e gerenciamento de ocorrências urbanas.

Nesta etapa, o projeto utiliza dados simulados em memória e autenticação demonstrativa no frontend. A integração com API e banco de dados será realizada em uma etapa posterior do projeto.

## Funcionalidades

- Cadastro de cidadãos.
- Registro e acompanhamento de ocorrências.
- Visualização das ocorrências em mapa.
- Gestão de usuários, categorias e ocorrências.
- Painel administrativo com indicadores.
- Registro de atendimentos e alteração de situação das ocorrências.
- Exercício de aula disponível separadamente pela rota `/telas/inicial`.

## Perfis de acesso

A autenticação desta etapa é simulada. Qualquer senha pode ser informada na tela de login; o perfil é definido pelo texto do endereço de e-mail digitado:

- Administrador: use um e-mail que contenha `admin`, por exemplo `admin@exemplo.com`.
- Atendente: use um e-mail que contenha `atendente`, por exemplo `atendente@exemplo.com`.
- Cidadão: use um e-mail sem `admin` ou `atendente`, por exemplo `cidadao@exemplo.com`.

Ao entrar, o sistema redireciona automaticamente para:

- Cidadão: `/cidadao/minhas`.
- Atendente: `/atendimento/painel`.
- Administrador: `/gerenciamento/dashboard`.

Os dados e a sessão permanecem apenas durante o uso da aplicação no navegador. Atualizações feitas nos serviços podem ser perdidas ao atualizar ou reiniciar a aplicação.

## Tecnologias

- Angular 22.
- Angular Material.
- TypeScript.
- RxJS.
- Vitest.
- npm.

## Pré-requisitos

- Node.js compatível com o Angular 22.
- npm.

## Como executar

Na pasta `Cidade-em-Dia` do projeto, instale as dependências:

```bash
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm start
```

A aplicação será disponibilizada em `http://localhost:4200`.

## Como testar

Execute os testes unitários uma única vez:

```bash
npm test -- --watch=false
```

Execute a compilação de produção:

```bash
npm run build
```

O resultado da compilação será gerado em `dist/Cidade-em-Dia/browser`.

## Principais áreas

- `/auth/login`: login.
- `/auth/cadastro`: cadastro de cidadão.
- `/cidadao/nova`: nova ocorrência.
- `/cidadao/minhas`: ocorrências do cidadão.
- `/cidadao/mapa`: mapa das ocorrências.
- `/atendimento/painel`: painel do atendente.
- `/gerenciamento/dashboard`: painel administrativo.
- `/gerenciamento/usuario`: gerenciamento de usuários.
- `/gerenciamento/categoria`: gerenciamento de categorias.
- `/gerenciamento/ocorrencias`: gerenciamento de ocorrências.
- `/gerenciamento/estatisticas`: estatísticas.

## Diagrama de classes

O diagrama das quatro entidades principais está disponível em [diagrama-classes.mmd](diagrama-classes.mmd).

As entidades relacionadas são:

- Usuário.
- Categoria.
- Ocorrência.
- Atendimento.

## Persistência e próxima etapa

Os usuários, categorias, ocorrências e atendimentos são controlados por serviços Angular com dados locais ou em memória. Não existe API ou banco de dados nesta versão.

No desenvolvimento futuro do backend, serão implementados:

- API para os dados do sistema.
- Banco de dados.
- Cadastro e autenticação reais.
- Autorização de cada perfil.
- Persistência permanente das ocorrências e atendimentos.

## Integrantes do grupo

- Kauan Ribeiro — 273006.
- Otávio Siqueira Freire dos Santos — 273524.
- Luiz Gustavo Legori Ramos — 273066.
- Marcos Vinicius Gonçalves Miotto — 272975.
- Pedro Henrique Cavalheiro Martins — 272747.
- Gustavo Rodrigues Giamarco — 272805.