# 📚 Sistema de Estudo

## Pré-requisitos
- [XAMPP](https://www.apachefriends.org/pt_br/download.html) instalado
- [Node.js](https://nodejs.org/) instalado
- Navegador Google Chrome

---

## ▶️ Como Rodar com XAMPP

### 1. Criar o banco de dados

**a) Abre o XAMPP Control Panel e inicia o MySQL:**
- Clica em **Start** no **MySQL**
- Aguarda ficar verde

**b) Abre o phpMyAdmin:**
- Clica em **Admin** ao lado do MySQL no XAMPP
- Ou acessa: http://localhost/phpmyadmin

**c) Importa o banco:**
- Clica em **SQL** no topo
- Copia TODO o conteúdo do arquivo `database/init.sql`
- Cola na caixa de texto e clica em **Executar**

### 2. Iniciar o backend

**Opção 1 - Duplo clique no arquivo:**
```
iniciar.bat
```

**Opção 2 - Pelo terminal:**
```bash
cd backend
npm install
node server.js
```

Aguarde ver: `API rodando na porta 3000` e `Banco conectado!`

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
| **Dashboard** | Saudação personalizada + gráfico pizza + evolução semanal + recomendação inteligente |
| **Materiais** | 60+ materiais reais com busca em tempo real e filtro por categoria |
| **Resultados** | Tabela de histórico + exportação PDF detalhado |
| **Tempo de Estudo** | Barras por assunto + cronômetro para registrar sessões |

---

## 🗄️ Banco de Dados (MySQL via XAMPP)
- Host: `localhost:3306`
- Banco: `sistema_estudo`
- Usuário: `root` | Senha: *(vazia)*

---

## 🛑 Parar o sistema
- Fecha a janela do terminal onde o backend está rodando
- Para o MySQL no XAMPP Control Panel

---

## 🐳 Alternativa com Docker

Se preferir usar Docker ao invés do XAMPP:

```bash
docker compose up --build
```

(Requer Docker Desktop instalado e rodando)
