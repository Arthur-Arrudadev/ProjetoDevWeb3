# 📚 Sistema de Estudo

## Pré-requisitos
- [XAMPP](https://www.apachefriends.org/pt_br/download.html) instalado
- [Node.js](https://nodejs.org/) instalado
- Navegador Google Chrome

---

## ▶️ Como Rodar

### 1. Configurar o banco de dados

**a) Abra o XAMPP Control Panel e inicie o MySQL:**
- Clique em **Start** no **MySQL**
- Aguarde ficar verde

**b) Abra o phpMyAdmin:**
- Clique em **Admin** ao lado do MySQL no XAMPP
- Ou acesse: http://localhost/phpmyadmin

**c) Importe o banco:**
- Clique em **SQL** no topo
- Copie TODO o conteúdo do arquivo `database/init.sql`
- Cole na caixa de texto e clique em **Executar**

> ⚠️ Se já tinha o banco criado antes, apague o banco `sistema_estudo` no phpMyAdmin e reimporte o `init.sql` para incluir a tabela de questões do Quiz.

---

### 2. Iniciar o backend

**Opção 1 — Duplo clique no arquivo:**
```
iniciar.bat
```

**Opção 2 — Pelo terminal:**
```bash
cd backend
npm install
node server.js
```

Aguarde ver no terminal: `API rodando na porta 3001` e `Banco conectado!`

---

### 3. Abrir o frontend no Chrome

**Feche todas as janelas do Chrome**, depois abra o terminal e execute:

```bash
start chrome --disable-web-security --user-data-dir="C:/tmp/chrome-dev" "c:/Users/arthu/OneDrive/Documentos/Sistema de Estudo/index.html"
```

> ⚠️ Isso é necessário porque o Chrome bloqueia requisições `fetch` quando o arquivo é aberto via `file://`.

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
- Feche a janela do terminal onde o backend está rodando
- Pare o MySQL no XAMPP Control Panel

---

## 🐳 Alternativa com Docker

Se preferir usar Docker ao invés do XAMPP:

```bash
docker compose up --build
```

(Requer Docker Desktop instalado e rodando)
