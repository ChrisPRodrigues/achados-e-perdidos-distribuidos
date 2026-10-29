# Registro de Testes

## 1. Validação do projeto

Os testes foram realizados em diferentes etapas do desenvolvimento do sistema de Achados e Perdidos.

Os testes iniciais ocorreram na branch `main`. Posteriormente, foram realizados novos testes automatizados após as correções de consistência das devoluções.

## 2. Testes realizados anteriormente

- `npm run build` — OK
- `npm test` — 2 testes passaram
- `GET /objetos` — OK
- `POST /objetos` — OK
- `GET /objetos` após cadastro — OK
- `GET /objetos/1` — OK
- `GET /objetos/999` — retornou `404 - Objeto não encontrado` — OK
- `PATCH /objetos/1` — atualização realizada — OK
- `GET /objetos/1` após atualização — OK
- `PATCH /objetos/1/devolucao` — status alterado para `devolvido` — OK
- `GET /objetos/1` após devolução — status `devolvido` confirmado — OK

Esses resultados correspondem aos testes registrados antes das últimas correções.

## 3. Testes automatizados após as correções

**Branch:** `fix/consistencia-devolucoes`

**Data:** 25/10/2026

### Compilação

Comando executado:

`npm run build`

**Resultado:** compilação realizada sem erros.

### Testes unitários

Comando executado:

`npm test`

**Resultado:** 15 testes aprovados, distribuídos em 5 arquivos.

| Arquivo | Testes aprovados |
|---|---:|
| devolucao.service.spec.ts | 5 |
| gerenciamento.service.spec.ts | 5 |
| gerenciamento.controller.spec.ts | 3 |
| objetos.controller.spec.ts | 1 |
| app.controller.spec.ts | 1 |
| **Total** | **15** |

### Funcionalidades verificadas pelos testes

- Rejeição de devolução quando o objeto não existe.
- Rejeição de devolução quando o usuário não existe.
- Impedimento de devoluções duplicadas.
- Impedimento de devoluções registradas por alunos.
- Registro de devolução com atualização do status do objeto.
- Encaminhamento correto das operações pelo GerenciamentoService.
- Tratamento de erros propagados pelo serviço de devoluções.

Todos os 15 testes automatizados foram aprovados.

## 4. Correções implementadas

Foram realizadas as seguintes modificações:

- Centralização das regras de devolução no DevolucaoService.
- Utilização de transações do TypeORM nas operações de devolução.
- Implementação de bloqueio pessimista para proteger alterações concorrentes.
- Inclusão do campo observacao na entidade de devoluções.
- Criação de migration para armazenar a observação.
- Restrição das atualizações de devolução ao campo observacao.
- Ajuste da exclusão para restaurar o status do objeto.

## 5. Resultado

A compilação do projeto foi concluída com sucesso e os 15 testes automatizados passaram.

Os testes unitários utilizaram simulações das operações do banco de dados. Portanto, ainda será necessária uma verificação de integração com PostgreSQL para comprovar o funcionamento completo das novas correções.
