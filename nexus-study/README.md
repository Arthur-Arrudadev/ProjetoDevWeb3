# 📚 Sistema de Estudos — Documentação Completa

> Plataforma de quiz para estudo com autenticação segura, rastreamento de desempenho e exportação de relatórios.  
> Infraestrutura: **AWS EC2** + **Docker Compose** + **Nginx** + **PostgreSQL**

---

## 🗂️ Índice

1. [Visão Geral da Arquitetura](#arquitetura)
2. [Estrutura do Projeto](#estrutura)
3. [Banco de Dados](#banco-de-dados)
4. [Backend — API REST](#backend)
5. [Frontend — React](#frontend)
6. [Segurança — Hash de Senhas](#segurança)
7. [Funcionalidades Novas](#funcionalidades)
8. [Deploy na AWS](#deploy)
9. [Variáveis de Ambiente](#variaveis)
10. [Referência Rápida de Endpoints](#endpoints)

---

## 🏗️ Arquitetura {#arquitetura}

```
Internet (HTTPS)
      │
      ▼
   AWS EC2
      │
      ▼
  Nginx :80          ← Reverse Proxy / Load Balancer
  ┌────┴────┐
  │         │
  ▼         ▼
Frontend  Backend     ← Containers Docker na rede interna
:3000     :4000
  │         │
  └────┬────┘
       ▼
  PostgreSQL :5432    ← Volume persistente no EC2
```

### Fluxo de dados
1. O usuário acessa o IP/domínio do EC2 pela porta 80.
2. O Nginx recebe a requisição e decide o destino:
   - Rotas `/api/*` → **Backend** (Node.js/Express na porta 4000)
   - Todas as outras → **Frontend** (React/Vite na porta 3000)
3. O Backend consulta o **PostgreSQL** usando a biblioteca `pg` (pool de conexões).
4. O Frontend consome a API via `fetch` usando a variável `VITE_API_URL`.

---

## 📁 Estrutura do Projeto {#estrutura}

```
study-app/
├── backend/                   # API Node.js + Express
│   ├── src/
│   │   ├── server.js          # Ponto de entrada, configura Express
│   │   ├── config/
│   │   │   ├── db.js          # Configuração do pool PostgreSQL
│   │   │   └── env.js         # Leitura de variáveis de ambiente
│   │   ├── database/
│   │   │   ├── pg.js          # Instância do pool compartilhado
│   │   │   └── wait-for-db.js # Espera o Postgres estar pronto
│   │   ├── repositories/
│   │   │   ├── PostgresUserRepository.js      # Queries de usuário
│   │   │   └── PostgresQuestionRepository.js  # Queries de questões
│   │   └── http/
│   │       ├── controllers/   # Camada HTTP (recebe req, chama service)
│   │       │   ├── user/
│   │       │   └── questions/
│   │       └── services/      # Regras de negócio
│   │           ├── user/
│   │           └── question/
│   ├── Dockerfile
│   └── package.json
│
├── frontend/                  # SPA React + Vite
│   ├── src/
│   │   ├── main.jsx           # Bootstrap React
│   │   ├── App.jsx            # Roteamento (react-router-dom)
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Estado global de autenticação
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── StatCard.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── QuizPage.jsx   # ← Quiz + Botão Revisão + Export PDF
│   │   │   └── ResultsPage.jsx
│   │   └── services/
│   │       └── api.js         # Funções de acesso à API
│   ├── Dockerfile
│   └── package.json
│
├── database/
│   └── init.sql               # Schema + índices do PostgreSQL
│
├── seeder/                    # Popula o banco com questões
│   ├── seed-all.ts
│   └── file/questions.json
│
├── nginx/
│   └── nginx.conf             # Proxy reverso
│
└── docker-compose.yml         # Orquestra todos os serviços
```

---

## 🗄️ Banco de Dados {#banco-de-dados}

### Tabelas

#### `users`
| Coluna       | Tipo           | Descrição                         |
|-------------|----------------|-----------------------------------|
| `id`        | UUID (PK)      | Gerado automaticamente (pgcrypto) |
| `name`      | VARCHAR(100)   | Nome do usuário                   |
| `email`     | VARCHAR(255)   | E-mail único                      |
| `password`  | VARCHAR(255)   | **Hash bcrypt** (12 rounds)       |
| `created_at`| TIMESTAMPTZ    | Data de criação                   |

#### `questions`
| Coluna                      | Tipo         | Descrição                    |
|-----------------------------|--------------|------------------------------|
| `id`                        | SERIAL (PK)  | ID incremental               |
| `question_index`            | INTEGER      | Índice original da questão   |
| `year`                      | INTEGER      | Ano da prova                 |
| `title`                     | TEXT         | Enunciado                    |
| `discipline`                | VARCHAR(100) | Matéria                      |
| `correct_alternative`       | CHAR(1)      | A, B, C, D ou E              |
| `context`                   | TEXT         | Texto de apoio (opcional)    |
| `alternatives_introduction` | TEXT         | Introdução das alternativas  |

#### `alternatives`
| Coluna        | Tipo       | Descrição                     |
|--------------|------------|-------------------------------|
| `id`         | SERIAL(PK) | ID incremental                |
| `question_id`| INTEGER FK | Referência à questão          |
| `letter`     | CHAR(1)    | A, B, C, D ou E               |
| `text`       | TEXT       | Texto da alternativa          |
| `is_correct` | BOOLEAN    | Indica a alternativa correta  |

#### `user_answers`
| Coluna         | Tipo        | Descrição                      |
|---------------|-------------|--------------------------------|
| `user_id`     | UUID FK     | Usuário que respondeu          |
| `question_id` | INTEGER FK  | Questão respondida             |
| `chosen_letter`| CHAR(1)   | Alternativa escolhida          |
| `is_correct`  | BOOLEAN     | Se acertou                     |
| `answered_at` | TIMESTAMPTZ | Timestamp da resposta          |

#### `results`
| Coluna            | Tipo        | Descrição                          |
|------------------|-------------|-------------------------------------|
| `user_id`        | UUID FK     | Usuário                             |
| `discipline`     | VARCHAR(100)| Matéria                             |
| `total_questions`| INTEGER     | Total de questões respondidas       |
| `correct`        | INTEGER     | Acertos                             |
| `wrong`          | INTEGER     | Erros                               |
| `to_review`      | INTEGER     | Marcadas para revisão               |
| `evaluated_at`   | DATE        | Data (uma linha por dia/matéria)    |

### Índices de performance
```sql
idx_questions_year           -- Filtro por ano
idx_questions_discipline     -- Filtro por matéria
idx_questions_year_discipline-- Filtro combinado
idx_user_answers_user        -- Histórico do usuário
idx_results_user             -- Dashboard do usuário
idx_results_date             -- Evolução semanal
```

---

## 🔧 Backend — API REST {#backend}

### Tecnologias
- **Node.js** com ES Modules (`"type": "module"`)
- **Express 5** — framework HTTP
- **pg** — driver PostgreSQL com pool de conexões
- **bcryptjs** — hash seguro de senhas
- **cors** — permite requisições do frontend
- **dotenv** — variáveis de ambiente

### Padrão de arquitetura: Controller → Service → Repository

```
HTTP Request
    │
    ▼
Controller        # Valida entrada, chama Service, retorna resposta HTTP
    │
    ▼
Service           # Regras de negócio, validações, lógica de domínio
    │
    ▼
Repository        # Acesso ao banco de dados (SQL puro com pg)
    │
    ▼
PostgreSQL
```

### Inicialização (`server.js`)
```js
// 1. Aguarda o PostgreSQL estar pronto (wait-for-db.js)
// 2. Registra rotas: /users e /questions
// 3. Habilita CORS para qualquer origem (*)
// 4. Escuta na porta definida em .env (padrão: 4000)
```

---

## 🌐 Frontend — React {#frontend}

### Tecnologias
- **React 18** com Hooks
- **Vite** — bundler ultra-rápido
- **react-router-dom** — roteamento client-side
- **recharts** — gráficos de desempenho
- **Context API** — estado global de autenticação

### Páginas

| Página           | Rota         | Descrição                                   |
|-----------------|--------------|---------------------------------------------|
| Login           | `/login`     | Formulário de autenticação                  |
| Cadastro        | `/register`  | Criação de conta                            |
| Dashboard       | `/`          | Estatísticas gerais e gráfico semanal       |
| Quiz            | `/quiz`      | Filtros + perguntas + revisão + PDF         |
| Resultados      | `/results`   | Histórico detalhado por dia e matéria       |

### Fluxo de autenticação
```
Login/Cadastro
     │
     ▼
AuthContext (useState)
     │  Armazena: { id, name, email }
     ▼
localStorage (persistência)
     │
     ▼
ProtectedRoute — redireciona para /login se não autenticado
```

### `api.js` — Camada de serviços
Todas as chamadas HTTP passam por `api.js`, que:
1. Usa `fetch` com a base URL de `VITE_API_URL`
2. Adiciona `Content-Type: application/json`
3. Lança erro automaticamente se `res.ok === false`

---

## 🔒 Segurança — Hash de Senhas {#segurança}

### Como funciona o bcrypt

```
Senha em texto puro → bcrypt.hash(password, 12) → Hash armazenado no banco
                                    │
                            12 rounds de salt
                            (custo computacional)
```

**Exemplo de hash bcrypt:**
```
$2b$12$eImiTXuWVxfM37uY4JANjQ==nzuCrPQCgzV6MTzS4yjz1Ga8y
│  │  │
│  │  └── Salt + Hash (53 chars)
│  └───── Rounds (12)
└──────── Versão do algoritmo (2b)
```

### Por que bcrypt?
- **Lento por design**: dificulta ataques de força bruta
- **Salt automático**: cada hash é único, mesmo para a mesma senha
- **Resistente a rainbow tables**: impossível usar tabelas pré-computadas

### Endpoint de verificação
```
GET /users/admin/check-hash
```
Retorna quantos usuários têm senhas hasheadas vs. em texto puro:
```json
{
  "status": "secure",
  "summary": {
    "total_users": 42,
    "hashed_passwords": 42,
    "plain_text_passwords": 0,
    "security_percentage": 100
  },
  "bcrypt_info": {
    "algorithm": "bcrypt",
    "salt_rounds": 12,
    "hash_prefix": "$2b$12$"
  }
}
```

---

## ✨ Funcionalidades Novas {#funcionalidades}

### 1. Botão "Marcar para Revisão"

Após responder uma questão, aparece **lado a lado** com o botão "Próxima":

```
[ Próxima → ]   [ 🔄 Marcar para Revisão ]
```

- O botão aparece somente após a questão ser respondida.
- Questões marcadas ficam com **ponto amarelo** nos indicadores de progresso.
- O contador de revisão aparece na tela de resultado e no banco (`to_review`).

### 2. Exportar PDF do Relatório

Na tela de resultado final do quiz, botão **📄 Exportar PDF**:
- Abre uma nova aba com relatório formatado.
- O navegador dispara a impressão automática (Ctrl+P / Salvar como PDF).
- O relatório inclui:
  - Cabeçalho com matéria, data e total de questões
  - Cards de resumo: Acertos / Erros / Revisão / Aproveitamento
  - Tabela detalhada com cada questão, alternativa escolhida, correta e status
  - Rodapé com data de geração

### 3. Hash de Senhas (bcrypt)

- Senhas são **nunca armazenadas em texto puro**.
- No cadastro: `bcrypt.hash(password, 12)` antes do INSERT.
- No login: `bcrypt.compare(inputPassword, storedHash)`.
- Endpoint `/users/admin/check-hash` para auditoria.

---

## ☁️ Deploy na AWS {#deploy}

### Pré-requisitos na EC2
```bash
# Instalar Docker
sudo apt update
sudo apt install -y docker.io docker-compose-plugin

# Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER
newgrp docker
```

### Subir o sistema
```bash
# 1. Clonar/transferir o projeto
git clone <seu-repositorio> study-app
cd study-app

# 2. Configurar variáveis de ambiente
cp backend/.env.example backend/.env
# Editar backend/.env com as configurações corretas

cp frontend/.env.example frontend/.env
# Editar VITE_API_URL com o IP público da EC2

# 3. Subir todos os serviços
docker compose up -d --build

# 4. Verificar status
docker compose ps
docker compose logs -f backend
```

### Portas e Security Groups (AWS)
| Porta | Serviço       | Regra de entrada         |
|-------|--------------|--------------------------|
| 80    | Nginx (HTTP) | Abrir para 0.0.0.0/0     |
| 443   | HTTPS (SSL)  | Abrir para 0.0.0.0/0     |
| 22    | SSH          | Restrito ao seu IP       |
| 4000  | Backend      | Somente interno (Docker) |
| 3000  | Frontend     | Somente interno (Docker) |
| 5432  | PostgreSQL   | Somente interno (Docker) |

### Fluxo de containers (ordem de inicialização)
```
db (postgres:16) → seeder → backend → frontend → nginx
```

---

## 🔑 Variáveis de Ambiente {#variaveis}

### `backend/.env`
```env
PORT=4000
DATABASE_URL=postgresql://postgres:postgres@db:5432/sistema_estudo
```

### `frontend/.env`
```env
VITE_API_URL=http://<IP-PUBLICO-EC2>/api
```

> **Atenção:** No `nginx.conf`, as rotas `/api/*` são redirecionadas para o backend removendo o prefixo `/api`. O frontend deve usar `/api` como base URL.

---

## 📡 Referência Rápida de Endpoints {#endpoints}

### Usuários (`/users`)

| Método | Rota                        | Descrição                    | Body/Params                              |
|--------|-----------------------------|------------------------------|------------------------------------------|
| POST   | `/users/register`           | Cadastro de novo usuário     | `{ name, email, password }`              |
| POST   | `/users/auth`               | Login                        | `{ email, password }`                    |
| GET    | `/users/:id/dashboard`      | Estatísticas gerais          | Query: `discipline`, `period`            |
| GET    | `/users/:id/weekly-evolution`| Evolução dos últimos 7 dias | Query: `discipline`, `period`            |
| GET    | `/users/:id/disciplines`    | Matérias estudadas           | —                                        |
| GET    | `/users/admin/check-hash`   | Auditoria de segurança       | —                                        |

### Questões (`/questions`)

| Método | Rota                  | Descrição                       | Body/Params                          |
|--------|-----------------------|----------------------------------|--------------------------------------|
| GET    | `/questions`          | Lista questões com filtros       | Query: `discipline`, `year`, `limit` |
| GET    | `/questions/filters`  | Matérias e anos disponíveis      | —                                    |
| GET    | `/questions/:id`      | Questão completa com alternativas| —                                    |
| POST   | `/questions/:id/answer`| Registra resposta do usuário    | `{ user_id, chosen_letter }`         |

### Exemplos de resposta

**POST `/users/auth`** — sucesso:
```json
{
  "id": "uuid-do-usuario",
  "name": "Arthur",
  "email": "arthur@exemplo.com",
  "created_at": "2026-06-11T12:00:00Z"
}
```

**GET `/questions/1`** — questão completa:
```json
{
  "id": 1,
  "year": 2023,
  "title": "Qual das alternativas...",
  "discipline": "Matemática",
  "context": "Considere a seguinte situação...",
  "alternatives": [
    { "letter": "A", "text": "Opção A" },
    { "letter": "B", "text": "Opção B" }
  ]
}
```

**POST `/questions/1/answer`** — resposta registrada:
```json
{
  "success": true,
  "is_correct": true,
  "correct_alternative": "C"
}
```

**GET `/users/admin/check-hash`** — auditoria:
```json
{
  "status": "secure",
  "summary": {
    "total_users": 10,
    "hashed_passwords": 10,
    "plain_text_passwords": 0,
    "security_percentage": 100
  }
}
```

---

## 🐳 Comandos Docker Úteis

```bash
# Ver logs em tempo real
docker compose logs -f

# Reiniciar apenas o backend
docker compose restart backend

# Acessar o banco de dados
docker exec -it postgres_db psql -U postgres -d sistema_estudo

# Parar tudo
docker compose down

# Parar e apagar volumes (cuidado: apaga os dados!)
docker compose down -v

# Ver containers em execução
docker compose ps
```

---

*Documentação gerada em Junho/2026 — Sistema de Estudos v1.1*
