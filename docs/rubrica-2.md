# Rubrica — Etapa 2: Sistema preliminar

> **Peso:** 10% da nota final · **Entrega:** semana 12  
> Escala por critério: 4 Excelente · 3 Adequado · 2 Em desenvolvimento · 0–1 Insuficiente

**Equipe:** `Darkiane Naiara, Chris (Iara Cristina), José Adilson, Pérla Bezerra` · **Avaliador:** `<Preencher nome>` · **Data:** `24/10/2026`

## Pré-requisitos (sim/não)

| Verificação | Sim | Não |
| --- | :---: | :---: |
| Repositório acessível, com o código do backend | ☑ | ☐ |
| Modelo de dados versionado (migrações aplicadas, sem erro) | ☑ | ☐ |
| Ao menos um endpoint de API funcionando fim a fim (banco → resposta) | ☑ | ☐ |

## Critérios

| Critério | Peso | 4 — Excelente | 3 — Adequado | 2 — Em desenvolvimento | 0–1 — Insuficiente | Nível |
| --- | ---: | --- | --- | --- | --- | :---: |
| **1. Modelo de dados** | 3,0 | 5+ entidades corretas, com relações, `onDelete` justificado e restrições de integridade testadas | 5+ entidades corretas, com relações e restrições básicas | 3–4 entidades ou relações confusas | Menos de 3 entidades ou modelagem que não sustenta as regras | 3 |
| **2. API e CRUD** | 4,0 | CRUD completo em 3+ recursos, com DTOs de entrada e saída separados | CRUD completo em 2 recursos | CRUD parcial | Não funciona | 3 |
| **3. Validação e consultas** | 2,0 | Validação de servidor cobrindo as regras, mais filtros ou paginação | Validação de servidor cobrindo as regras principais | Validação incompleta | Sem validação de servidor | 3 |
| **4. Organização do código** | 1,0 | Código legível, lint limpo, regra de negócio no service, fora do controller | Lint limpo, código compreensível | Alguns problemas de organização | Código ilegível ou duplicado | 3 |
| **Total** | **10,0** | | | | | |

**Nota da etapa** = Σ (nível × peso) ÷ 4

---

## Devolutiva

**Pontos fortes:**

- Modelo de dados com cinco entidades principais do MVP: Objeto, Categoria, Local, Usuário e Devolução.
- Banco de dados PostgreSQL integrado ao backend, com migrações aplicadas, relacionamentos e restrições de integridade.
- Operações CRUD implementadas para Categorias, Locais, Usuários e Devoluções.
- Validações de entrada e regras de negócio implementadas nos services.
- Testes realizados para campos inválidos, referências inexistentes e tentativas de registrar devoluções duplicadas.
- Build concluído com sucesso, lint sem erros ou avisos e testes automatizados aprovados.

**O que ajustar antes da Etapa 3 (sistema final):**

- Dar continuidade às próximas etapas previstas no planejamento do projeto, conforme o cronograma estabelecido pela equipe.
- Manter a documentação técnica do modelo de dados e das regras de integridade como parte da documentação do projeto.

**Aprovado para seguir?** ☐ Sim ☑ Sim, com ajustes ☐ Não — corrigir e reenviar (recuperação)