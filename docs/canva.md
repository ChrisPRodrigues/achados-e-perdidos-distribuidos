**Projeto:** Sistema de Achados e Perdidos · **Equipe:** Iara Cristina, Darkiane Naiara, José Adilson e Perla Bezerra · **Data:** 2026-09-14  
**Organização parceira:** IFPE Campus Palmares

---

## 1. Problema

No IFPE Campus Palmares, estudantes e servidores utilizam atualmente um grupo de WhatsApp para divulgar objetos perdidos e encontrados. Embora esse meio permita uma comunicação rápida, as informações ficam distribuídas entre diversas mensagens, dificultando a localização de publicações antigas, a pesquisa por objetos específicos e o acompanhamento dos itens que já foram devolvidos.

**Evidências de que o problema existe** (dados, falas, observação):

- O processo atual de divulgação de objetos perdidos e encontrados é realizado por meio de um grupo de WhatsApp.
- As informações ficam organizadas em mensagens, sem um cadastro estruturado dos objetos e de sua situação.

## 2. Quem é afetado

| Quem                                  |      Quantas pessoas | Como é afetado hoje                                                              |
| ------------------------------------- | -------------------: | -------------------------------------------------------------------------------- |
| Estudantes                            | Cerca de 500 pessoas | Podem ter dificuldade para saber se um objeto perdido foi encontrado.            |
| Servidores                            |  Cerca de 80 pessoas | Podem ter dificuldade para registrar, organizar e localizar objetos encontrados. |
| Responsáveis pelos achados e perdidos |            2 pessoas | Precisam controlar as informações dos objetos sem uma ferramenta centralizada.   |

## 3. Solução proposta

Criar um sistema web para centralizar o registro e a consulta de objetos encontrados no IFPE Campus Palmares. O sistema deverá facilitar a organização das informações, a localização dos objetos e sua devolução aos respectivos proprietários.

## 4. Funcionalidades do MVP (3 a 5)

| #   | Funcionalidade                | Para quem               | Por que é essencial                                       |
| --- | ----------------------------- | ----------------------- | --------------------------------------------------------- |
| 1   | Cadastrar objetos encontrados | Responsável             | Permitir que o objeto seja registrado no sistema.         |
| 2   | Pesquisar objetos cadastrados | Estudantes e servidores | Permitir procurar um objeto perdido.                      |
| 3   | Visualizar detalhes do objeto | Estudantes e servidores | Permitir comparar as características do objeto procurado. |
| 4   | Registrar devolução           | Responsável             | Manter o controle dos objetos que já foram devolvidos.    |
| 5   | Gerenciar registros           | Responsável             | Permitir atualizar ou corrigir informações dos objetos.   |

## 5. Fora do escopo

O que **não** faremos nesta versão, e por quê:

| Não faremos                                           | Por quê                                                                                                              |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Cadastro de objetos perdidos fora da instituição      | Inicialmente, o sistema será voltado apenas para objetos relacionados ao IFPE Campus Palmares.                       |
| Garantia de recuperação do objeto                     | O sistema ajuda a localizar possíveis correspondências, mas não pode garantir que um objeto perdido será encontrado. |
| Integração com WhatsApp                               | Exigiria integração com serviços externos e APIs específicas.                                                        |
| Reconhecimento de objetos por Inteligência Artificial | Exigiria treinamento ou modelos de IA e aumentaria a complexidade da primeira versão.                                |

## 6. Usuários e papéis

| Papel                    | O que pode fazer                                                                              |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| Estudante                | Pesquisar objetos encontrados e consultar suas informações.                                   |
| Servidor                 | Pesquisar e, conforme a necessidade definida pela organização, registrar objetos encontrados. |
| Responsável pelo sistema | Cadastrar, editar e atualizar objetos e registrar devoluções.                                 |

## 7. Restrições

| Tipo            | Restrição                                                                                                    |
| --------------- | ------------------------------------------------------------------------------------------------------------ |
| Prazo           | Semana 18                                                                                                    |
| Equipe          | 4 pessoas, 8 h/semana no total                                                                               |
| Técnica         | TypeScript (NestJS + React), PostgreSQL, PaaS gratuita                                                       |
| Contexto de uso | Sistema utilizado no IFPE Campus Palmares por meio de computador ou dispositivo móvel com acesso à internet. |
| Orçamento       | Zero                                                                                                         |

## 8. Riscos principais

| Risco                                                      | O que faremos                                                                              |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| As informações sobre o processo atual serem insuficientes  | Realizar entrevista com os responsáveis e validar as informações antes do desenvolvimento. |
| Poucos dados reais para testar o sistema                   | Utilizar dados de teste e, quando possível, realizar testes com a organização.             |
| Usuários terem dificuldade para utilizar o sistema         | Manter a interface simples e realizar testes de uso.                                       |
| Falta de tempo para desenvolver todas as funcionalidades   | Priorizar as funcionalidades definidas para o MVP.                                         |
| Mudanças nas necessidades da organização durante o projeto | Validar as decisões com a organização antes de ampliar o escopo.                           |

## 9. Critérios de sucesso

| Objetivo                                        | Como mediremos                                                                         | Meta                                                              |
| ----------------------------------------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Facilitar a localização de objetos              | Cronometrar usuários realizando uma busca durante os testes                            | Encontrar um possível objeto correspondente em até 2 minutos      |
| Digitalizar o registro dos objetos encontrados  | Comparar os objetos disponibilizados para teste com os registros realizados no sistema | Pelo menos 90% dos objetos de teste registrados                   |
| Verificar se o sistema é utilizado corretamente | Observar usuários realizando as principais tarefas                                     | Pelo menos 80% dos usuários concluírem as tarefas sem ajuda       |
| Avaliar a utilização do sistema                 | Contabilizar registros e consultas durante o período de teste                          | Pelo menos 15 utilizações durante o período definido para o teste |

## 10. O que fica depois

- **Quem opera o sistema:** Responsável indicado pelo IFPE Campus Palmares.
- **Quem mantém tecnicamente:** A ser definido com a organização parceira.
- **Custo mensal estimado:** R$ 0,00 durante o desenvolvimento e os testes, utilizando serviços gratuitos.
- **Licença do código:** A definir pela equipe.
