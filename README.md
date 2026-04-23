# 📚 Sistema de Estudo

## Pré-requisitos
- [Node.js](https://nodejs.org/) instalado
- [Docker Desktop](https://www.docker.com/products/docker-desktop) instalado e rodando (para uso local do banco de dados)
- Conta GitHub para usar Codespaces (opcional, mas recomendado)

---

## ▶️ Como Rodar

### 🚀 Usando GitHub Codespaces (Recomendado)

1.  **Abra o projeto em um Codespace:**
    *   No repositório GitHub, clique no botão "Code" e selecione "Create codespace on main".
    *   O Codespace será inicializado, instalando as dependências e configurando o ambiente automaticamente.
    *   O banco de dados MySQL será iniciado via Docker Compose, e o `init.sql` será executado para criar o esquema e popular os dados.

2.  **Aguarde a inicialização:**
    *   Os comandos definidos no `.devcontainer/devcontainer.json` cuidarão de:
        *   Instalar o `serve` (servidor estático para o frontend).
        *   Instalar as dependências do backend (`npm install`).
        *   Iniciar o backend (`node server.js`).
        *   Iniciar o frontend (`serve -l 8080`).
    *   Você verá mensagens no terminal sobre a API rodando na porta 3001 e o frontend na porta 8080.

3.  **Acesse a aplicação:**
    *   O Codespaces detectará as portas 3001 (backend) e 8080 (frontend) e as forwardará.
    *   Clique nos links que aparecerão na aba "Ports" do VS Code para abrir o frontend (porta 8080) e testar o backend (porta 3001).
    *   O frontend será aberto automaticamente no seu navegador.

### 💻 Rodando Localmente com Docker (apenas para o banco de dados)

1.  **Certifique-se de ter o Docker Desktop instalado e rodando.**
2.  **Navegue até a raiz do projeto no terminal:**
    ```bash
    cd /caminho/para/ProjetoDevWeb3
    ```
3.  **Inicie o serviço do banco de dados com Docker Compose:**
    ```bash
    docker compose up -d
    ```
    Isso iniciará o banco de dados MySQL. O `init.sql` será executado automaticamente na primeira vez para criar o esquema e popular os dados.

4.  **Inicie o Backend (em um novo terminal):**
    ```bash
    cd backend
    npm install # Execute apenas na primeira vez ou se as dependências mudarem
    node server.js
    ```
    Aguarde ver no terminal: `API rodando na porta 3001` e `Banco conectado!`

5.  **Inicie o Frontend (em outro novo terminal):**
    ```bash
    cd frontend
    npm install -g serve # Execute apenas na primeira vez
    serve -l 8080
    ```
    O frontend estará acessível em `http://localhost:8080`.

6.  **Acesse a aplicação:**
    *   Abra seu navegador e acesse `http://localhost:8080`.

---

## 🔐 Login

| Campo   | Valor  |
|---------|--------|
| Usuário | geral  |
| Senha   | entrar |

---

## 📄 Telas

| Tela | Descrição |
|------|-----------|
| **Login** | Validação de campos obrigatórios, bloqueia acesso sem dados |
| **Dashboard** | Saudação + gráfico de pizza + desempenho por dia da semana (4 semanas) + heatmap de atividade + recomendação inteligente |
| **Quiz** | Escolha a matéria, responda 10 questões com alternativas A/B/C/D, veja acertos/erros/revisão e salva no histórico automaticamente |
| **Materiais** | 60+ materiais reais com busca em tempo real e filtro por categoria |
| **Resultados** | Tabela de histórico + exportação PDF detalhado |
| **Tempo de Estudo** | Barras por assunto + cronômetro para registrar sessões |

---

## 🗄️ Banco de Dados (MySQL via XAMPP)

- Host: `localhost:3306`
- Banco: `sistema_estudo`
- Usuário: `root` | Senha: *(vazia)*

### Tabelas

| Tabela | Descrição |
|--------|-----------|
| `usuarios` | Cadastro de usuários |
| `materiais` | Materiais de estudo por categoria |
| `questoes` | Questões do Quiz com alternativas A/B/C/D |
| `resultados` | Histórico de acertos/erros/revisão por assunto |
| `sessoes_estudo` | Sessões do cronômetro com duração em minutos |

---

## 🛑 Parar o sistema
```bash
docker compose down
```

(Requer Docker Desktop instalado e rodando)
