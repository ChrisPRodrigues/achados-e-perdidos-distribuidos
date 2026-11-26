# Sistema de Achados e Perdidos — IFPE

## Sobre o projeto

Sistema web desenvolvido para o IFPE Campus Palmares, com o objetivo de facilitar o registro, a consulta e o gerenciamento de objetos perdidos e encontrados na instituição.

O projeto utiliza NestJS no backend, PostgreSQL para persistência de dados e TypeORM para mapeamento das entidades e gerenciamento das migrations.

## Tecnologias utilizadas

- NestJS
- TypeScript
- PostgreSQL
- TypeORM
- Docker e Docker Compose
- Nginx
- Vitest
- Git e GitHub

## Principais funcionalidades

- Cadastro, consulta e atualização de objetos.
- Gerenciamento de categorias e locais.
- Cadastro e gerenciamento de usuários.
- Autenticação com JWT.
- Armazenamento seguro de senhas com hash.
- Controle de acesso por perfil de usuário.
- Aprovação e rejeição do cadastro de docentes.
- Registro e gerenciamento de solicitações de devolução.
- Gerenciamento de devoluções.
- Validação de dados utilizando DTOs e `class-validator`.
- Validação de relacionamentos entre registros.
- Persistência de dados utilizando TypeORM.
- Tratamento de erros HTTP para operações inválidas.

## Banco de dados

O sistema utiliza PostgreSQL para armazenar os dados e TypeORM para mapear as entidades, estabelecer relacionamentos e gerenciar as migrations.

As principais entidades são:

- Usuário
- Objeto
- Categoria
- Local
- Solicitação
- Devolução

Os relacionamentos utilizam identificadores UUID e restrições de integridade referencial.

## Autenticação e controle de acesso

O sistema utiliza autenticação baseada em JWT e controle de permissões conforme o perfil do usuário.

Os principais perfis são:

- **Aluno:** pode consultar objetos e solicitar devoluções.
- **Docente:** após aprovação, pode cadastrar objetos e gerenciar solicitações de devolução.
- **Administrador:** pode gerenciar usuários e aprovar ou rejeitar cadastros de docentes.

As rotas protegidas verificam a autenticação e as permissões antes de permitir as operações.

## Gerenciamento de devoluções

O módulo de devoluções possui regras para garantir a integridade e a consistência dos dados.

Entre as funcionalidades implementadas estão:

- Verificação da existência do objeto e do usuário.
- Restrição do registro de devoluções a usuários do tipo docente.
- Prevenção de devoluções duplicadas.
- Utilização de transações do TypeORM.
- Bloqueio pessimista para proteger alterações concorrentes.
- Atualização do status do objeto para `devolvido`.
- Inclusão do campo `observacao` nas devoluções.

## Como executar com Docker

O projeto possui configuração Docker para executar o frontend, o backend e o banco de dados PostgreSQL em containers.

### Pré-requisitos

- Docker Desktop instalado e em execução.
- Docker Compose.

### Iniciar o projeto

Na pasta principal do projeto, execute:

```bash
docker compose up -d --build
```

O comando constrói as imagens e inicia os containers do PostgreSQL, backend e frontend.

### Executar as migrations

Na primeira execução, após os containers iniciarem, execute:

```bash
docker compose exec backend npm run migration:run
```

Esse comando cria a estrutura do banco de dados e executa as migrations pendentes.

### Acessar o sistema

Após a inicialização, o sistema estará disponível em:

- **Frontend:** http://localhost:8080
- **Backend:** http://localhost:3000

### Verificar as migrations

Para consultar as migrations executadas:

```bash
docker compose exec backend npm run migration:show
```

As migrations executadas são identificadas com `[X]`.

### Encerrar os containers

Para parar e remover os containers, execute:

```bash
docker compose down
```

**Observação:** os dados do PostgreSQL são armazenados em um volume Docker, preservado mesmo após executar `docker compose down`. Para remover também os dados locais, seria necessário utilizar `docker compose down -v`.

O banco utilizado pelo Docker é local e independente do banco PostgreSQL remoto utilizado pelo sistema publicado.

## Execução sem Docker

Também é possível executar o backend diretamente no ambiente local.

### Pré-requisitos

- Node.js e npm.
- PostgreSQL acessível.

### Instalação

1. Acesse a pasta do backend:

   ```bash
   cd backend
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente de conexão com PostgreSQL no arquivo `.env`, conforme a configuração do projeto.

4. Execute as migrations pendentes:

   ```bash
   npm run migration:run
   ```

5. Inicie a aplicação:

   ```bash
   npm run start:dev
   ```

A API ficará disponível em:

http://localhost:3000

## Testes automatizados

O projeto utiliza Vitest para executar testes automatizados.

Para executar os testes:

```bash
npm test
```

Para verificar a compilação do backend:

```bash
npm run build
```

## Instituição

Projeto acadêmico desenvolvido no curso de Análise e Desenvolvimento de Sistemas do Instituto Federal de Pernambuco (IFPE) — Campus Palmares.