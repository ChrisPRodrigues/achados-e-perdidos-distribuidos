                                                        **Rubrica**  
                                             **Etapa 1: Definição e planejamento**

**Equipe:** Darkiane Naiara,Chris(Iara Cristina),José Adilson,Perla Bezerra.  
**Data:** 29.09.2026

| Verificação | Sim | Não |
| :---- | ----- | ----- |
| Organização parceira externa, com aceite por escrito (carta de anuência ou e-mail) | sim |  |
| Houve ao menos uma conversa com a organização sobre o problema | sim |  |
| Acordo de equipe com papéis e Definition of Done | sim |  |

**Critérios**

| Critério | O que foi realizado no projeto | Evidência |
| ----- | ----- | ----- |
| **1\. Problema e demanda** | Após uma conversa com Adriana, responsável pelo achados e perdidos, foi  identificado e validado o funcionamento real do processo de Achados e Perdidos. Atualmente, os objetos encontrados são entregues a Adriana, que, juntamente com Lucas, recebe e guarda os objetos. Adriana publica os objetos no grupo de WhatsApp, por onde as pessoas procuram os itens perdidos. Foi informado que não existe registro formal dos objetos e que já ocorreu situação em que uma pessoa procurou um objeto que estava sob responsabilidade do processo, mas não foi possível identificá-lo rapidamente. Também foi informado que objetos não retirados permanecem guardados.  | Conversa de WhatsApp com Adriana, membro da secretaria.  |
| **2\. Usuários e cenário** | Foram definidos três perfis relacionados ao processo: pessoa que perdeu um objeto; pessoa que encontrou um objeto; e responsáveis pelo Achados e Perdidos. O cenário principal foi organizado a partir do processo informado: a pessoa encontra um objeto; entrega o objeto para Adriana; Adriana e Lucas recebem e guardam; Adriana divulga o objeto; a pessoa que perdeu procura; o objeto pode ser identificado; e, posteriormente, é realizada a devolução.  | Personas e descrição do cenário principal elaboradas a partir das informações obtidas na conversa com a organização.  |
| **3\. Escopo e sucesso** | MVP com até 6 funcionalidades, lista do que fica de fora justificada, metas numéricas com forma de medir | MVP viável no prazo, com o que fica de fora e metas verificáveis |
| **4\. Backlog** | Foi definido um MVP com cinco funcionalidades: cadastrar objeto encontrado; listar objetos encontrados; consultar um objeto individualmente; atualizar informações de um objeto; e registrar a devolução. Também foram definidos itens fora do MVP, como aplicativo mobile e integração automática com WhatsApp,  | Backlog com histórias de usuário, critérios de aceite, prioridade MoSCoW e estimativas.  |
| **5\. Desenho técnico da API** | O backend foi desenvolvido em NestJS e organizado em módulos, controllers, services e repository. Foi definida a interface Objeto com id, nome, descrição, categoria, local encontrado, data encontrada e status. Foram definidas as rotas POST /objetos, GET /objetos, GET /objetos/:id, PATCH /objetos/:id e PATCH /objetos/:id/devolucao. O projeto utiliza repositório em memória nesta etapa. Também foram definidas duas decisões de arquitetura : utilização do NestJS e separação entre controller, service e repository, considerando alternativas.  | Estrutura de backend/src/objetos; objeto.interface.ts; objetos-repository.service.ts; controllers e services; rotas da API; ADRs do projeto.  |
| **6\. Plano de execução** | Foi organizado um cronograma para as semanas 11 a 18, contemplando validação do problema, definição do MVP e backlog, desenho técnico, desenvolvimento das funcionalidades, integração, testes, correções, documentação e apresentação. Também foram identificados cinco riscos com planos de ação: falta de tempo, problemas de integração, erros nas rotas da API, alteração de requisitos e dificuldade de testes.  | Cronograma das semanas 11–18 e quadro de riscos com respectivos planos de ação.  |


**Resumo das evidências técnicas já existentes:**

• Estrutura do backend em NestJS, com módulos, controllers e services.  
• Interface Objeto com os campos informados no projeto.  
• Repository em memória para armazenamento durante a execução.  
• Rotas de cadastro, listagem, consulta individual, gerenciamento e devolução.  
• Branches separadas para as funcionalidades da equipe.  
• Arquivos de testes e documentação: objetos.controller.spec.ts, TESTES.md e readme.md.  
• Banco de dados/migrations não implementados nesta etapa.  
• DTOs e validações não implementados nesta etapa.

Link : [https://drive.google.com/drive/folders/1bBGp1ZjwMclGeIzlcVsUUhBX8lkXWNUE?usp=sharing](https://drive.google.com/drive/folders/1bBGp1ZjwMclGeIzlcVsUUhBX8lkXWNUE?usp=sharing)
