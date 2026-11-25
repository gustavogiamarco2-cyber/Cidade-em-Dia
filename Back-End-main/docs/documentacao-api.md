# Documentação da API

Base: `http://localhost:8080/api/v1` — autenticação HTTP Basic em todas as rotas.

Sem credenciais ou com credenciais inválidas: **401**. Autenticado sem permissão: **403**.

## Usuários (somente ADMIN)

| Método | Rota | Descrição | Respostas |
|---|---|---|---|
| POST | `/usuarios` | Cria usuário | 201, 400, 409 |
| GET | `/usuarios` | Lista usuários | 200 |
| GET | `/usuarios/{id}` | Busca por id | 200, 404 |
| GET | `/usuarios/email/{email}` | Busca por email | 200, 404 |
| GET | `/usuarios/perfil/{perfil}` | Lista ativos por perfil | 200, 400 |
| PUT | `/usuarios/{id}` | Atualiza | 200, 400, 404, 409 |
| DELETE | `/usuarios/{id}` | Exclui | 204, 404 |

## Categorias

| Método | Rota | Perfil | Respostas |
|---|---|---|---|
| POST | `/categorias` | ADMIN, ATENDENTE | 201, 400, 409 |
| GET | `/categorias` | autenticado | 200 |
| GET | `/categorias/ativas` | autenticado | 200 |
| GET | `/categorias/{id}` | autenticado | 200, 404 |
| PUT | `/categorias/{id}` | ADMIN, ATENDENTE | 200, 400, 404, 409 |
| DELETE | `/categorias/{id}` | ADMIN | 204, 404, 409 (tem ocorrências) |

## Ocorrências

| Método | Rota | Perfil | Respostas |
|---|---|---|---|
| POST | `/ocorrencias` | autenticado | 201, 400, 404, 409 (categoria inativa) |
| GET | `/ocorrencias` | autenticado | 200 |
| GET | `/ocorrencias/{id}` | autenticado | 200, 404 |
| GET | `/ocorrencias/categoria/{categoriaId}` | autenticado | 200 |
| GET | `/ocorrencias/status/{status}` | autenticado | 200, 400 |
| GET | `/ocorrencias/autor/{autorId}` | autenticado | 200 |
| GET | `/ocorrencias/urgencia/{urgencia}` | autenticado | 200, 400 |
| GET | `/ocorrencias/{id}/historico` | autenticado | 200, 404 |
| PUT | `/ocorrencias/{id}` | ADMIN, ATENDENTE | 200, 400, 404 |
| POST | `/ocorrencias/{id}/status` | ADMIN, ATENDENTE | 200, 400, 404, 409 |
| DELETE | `/ocorrencias/{id}` | ADMIN | 204, 404 |

Valores: urgência e prioridade `BAIXA|MEDIA|ALTA`; status `NOVA|EM_ANALISE|EM_ANDAMENTO|RESOLVIDA`.

## Histórico de status

| Método | Rota | Perfil | Respostas |
|---|---|---|---|
| POST | `/historicos-status` | ADMIN, ATENDENTE | 201, 400, 404, 409 |
| GET | `/historicos-status` | autenticado | 200 |
| GET | `/historicos-status/{id}` | autenticado | 200, 404 |
| PUT | `/historicos-status/{id}` | ADMIN | 200, 400, 404, 409 |
| DELETE | `/historicos-status/{id}` | ADMIN | 204, 404 |
| GET | `/ocorrencias/{id}/historico` | autenticado | 200, 404 |

O POST registra uma transição real de status da ocorrência informada e gera o histórico
automaticamente. A atualização e exclusão de registros existentes são restritas ao ADMIN.

## Confirmações

| Método | Rota | Perfil | Respostas |
|---|---|---|---|
| POST | `/confirmacoes` | autenticado | 201, 400, 404, 409 (duplicada) |
| GET | `/confirmacoes` | autenticado | 200 |
| GET | `/confirmacoes/{id}` | autenticado | 200, 404 |
| GET | `/confirmacoes/ocorrencia/{id}` | autenticado | 200 |
| GET | `/confirmacoes/usuario/{id}` | autenticado | 200 |
| PUT | `/confirmacoes/{id}` | ADMIN, ATENDENTE | 200, 400, 404 |
| DELETE | `/confirmacoes/{id}` | ADMIN | 204, 404 |

## Regras de negócio (camada Service)

1. Categoria com ocorrências não pode ser excluída (409).
2. Não se registra ocorrência em categoria inativa (409).
3. Um usuário só confirma uma mesma ocorrência uma vez (409).
4. Ocorrência resolvida não muda de status e o status novo deve ser diferente do atual (409).

## Funcionalidade específica

`POST /ocorrencias/{id}/status` altera o andamento da ocorrência e grava no histórico o status
anterior, o novo, o motivo, o login e o perfil de quem alterou. O histórico é consultado em
`GET /ocorrencias/{id}/historico`.

## Formato de erro

```json
{ "timestamp": "...", "status": 409, "erro": "Conflict", "mensagem": "...", "campos": null }
```

Em erros de validação (400), `campos` traz o mapa campo → mensagem.

## Exemplos de corpo

Ocorrência:

```json
{
  "titulo": "Buraco na avenida",
  "descricao": "Buraco grande no meio da pista",
  "rua": "Av. Brasil", "numero": "100", "bairro": "Centro", "cidade": "Pontal do Paraná",
  "urgencia": "ALTA", "prioridade": "MEDIA",
  "categoriaId": 1, "autorId": 1
}
```

Alterar status: `{ "statusNovo": "EM_ANALISE", "motivo": "Equipe designada" }`
