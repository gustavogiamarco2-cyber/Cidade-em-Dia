# Cidade em Dia

Backend REST do Projeto Integrador, desenvolvido em Spring Boot para a disciplina
Padrões de Desenvolvimento Web (Engenharia de Software, 4º termo).

## Integrantes

| Nome completo | ID acadêmico |
|---|---|
| Kauan Ribeiro | 273006 |
| Otávio Siqueira Freire dos Santos | 273524 |
| Luiz Gustavo Legori Ramos | 273066 |
| Marcos Vinicius Gonçalves Miotto | 272975 |
| Pedro Henrique Cavalheiro Martins | 272747 |
| Gustavo Rodrigues Giamarco | 272805 |

## Descrição

O Cidade em Dia é uma plataforma em que cidadãos registram ocorrências urbanas
(buraco na rua, lâmpada queimada, vazamento etc.), outros cidadãos confirmam que o
problema existe e atendentes da prefeitura acompanham o andamento até a resolução.

## Objetivo do backend

Oferecer a API que gerencia usuários, categorias, ocorrências, confirmações e o
histórico de mudanças de status, com regras de negócio, validação, tratamento de
erros e controle de acesso por perfil.

## Tecnologias

- Java 17
- Spring Boot 3.3 (Web, Data JPA, Validation, Security)
- MySQL 8
- Lombok
- Maven
- Postman (testes manuais)

## Arquitetura

Camadas: `controller` → `service` → `repository` → `entity`, mais `dto`, `exception` e `config`.
Os controllers nunca acessam repositories; as regras de negócio ficam nos services.

## Modelo de dados

Diagrama em [`docs/modelo-dados.png`](docs/modelo-dados.png) (fonte Mermaid em
[`docs/modelo-dados.md`](docs/modelo-dados.md)).

## Como executar

Pré-requisitos: JDK 17, Maven e MySQL 8 em execução.

1. Clone o repositório.
2. Configure o acesso ao MySQL em `src/main/resources/application.properties`
   ou use as variáveis de ambiente `DB_USER` e `DB_PASSWORD`
   (padrão: `root` / `root`). O banco `cidadeemdia` é criado automaticamente.
3. Execute:

```bash
mvn spring-boot:run
```

A API sobe em `http://localhost:8080`.

## Usuários de teste (HTTP Basic, em memória)

| Usuário | Senha | Perfis |
|---|---|---|
| `cidadao` | `senha123` | CIDADAO |
| `atendente` | `senha456` | ATENDENTE, CIDADAO |
| `admin` | `admin123` | ADMIN, ATENDENTE, CIDADAO |

São credenciais de teste criadas só para esta atividade.

## Documentação da API

Veja [`docs/documentacao-api.md`](docs/documentacao-api.md).

## Testes com Postman

A coleção está em `postman/projeto-integrador.postman_collection.json`.
Importe no Postman e execute as pastas **na ordem**, com o banco vazio, pois as
requisições usam os ids 1, 2 e 3 gerados na criação dos registros. Cada requisição
traz o código esperado no nome (ex.: `[409] ...`).
