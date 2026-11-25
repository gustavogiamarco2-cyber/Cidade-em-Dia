# Frontend Cidade em Dia

Este diretório contém a aplicação Angular do Cidade em Dia. O frontend oferece as telas de autenticação, registro e acompanhamento de ocorrências, atendimento e gerenciamento administrativo. A persistência é local ao navegador; este projeto não realiza chamadas HTTP nem se integra a um backend.

Para descrição completa dos perfis, entidades, relacionamentos, funcionalidades e limitações do projeto, consulte o [README principal](../README.md).

## Organização do frontend

- `src/app/autenticacao/`: telas e rotas de login e cadastro.
- `src/app/cidadao/`: registro, consulta e mapa ilustrativo de ocorrências.
- `src/app/atendimento/`: painel de atendimento.
- `src/app/gerenciamento/`: dashboard, estatísticas e telas administrativas.
- `src/app/compartilhado/`: models, serviços locais, persistência e componentes compartilhados.
- `src/app/telas/`: tela de exercício acessível pela rota `/telas/inicial`.
- `src/main.ts` e `src/app/`: bootstrap e módulos da aplicação.
- `src/styles.scss`: estilos globais; os estilos de cada componente ficam junto às suas telas.
- `public/`: arquivos estáticos.

A aplicação utiliza NgModules e roteamento Angular, com Angular Material nas interfaces. SSR e SSG não estão habilitados.

## Instalação

Execute os comandos a partir deste diretório:

```bash
npm install
```

Requisitos de versão e tecnologias estão documentados no [README principal](../README.md) e declarados em `package.json`.

## Executar

```bash
npm start
```

O servidor de desenvolvimento disponibiliza a aplicação em `http://localhost:4200`.

## Testes

Para executar os testes unitários uma vez:

```bash
npm test -- --watch=false
```

## Build de produção

```bash
npm run build
```

Os arquivos de produção são gerados em `dist/Cidade-em-Dia/browser`.
