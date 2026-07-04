# Documentação Técnica

## Sistema de Estudo e Avaliação

---

## 1. Visão Geral

O Sistema de Estudo e Avaliação é uma aplicação web desenvolvida para gerenciamento de materiais de estudo, realização de quizzes, acompanhamento de desempenho e controle de tempo de estudo.

A solução foi projetada utilizando arquitetura em três camadas:

* Frontend (Interface do Usuário)
* Backend (API e Regras de Negócio)
* Banco de Dados (Persistência)

---

## 2. Arquitetura da Solução

### 2.1 Componentes

| Camada          | Tecnologia            | Responsabilidade                    |
| --------------- | --------------------- | ----------------------------------- |
| Frontend        | HTML, CSS, JavaScript | Interface e interação com o usuário |
| Backend         | Node.js               | Processamento das regras de negócio |
| Banco de Dados  | MySQL                 | Armazenamento persistente           |
| Containerização | Docker                | Provisionamento do banco de dados   |

### 2.2 Fluxo de Comunicação

```text
Usuário
   │
   ▼
Frontend
   │ HTTP/REST
   ▼
Backend (Node.js)
   │ SQL
   ▼
MySQL
```

---

## 3. Estrutura de Diretórios

```text
root/
├── frontend/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── app.js
│   │   ├── materiais-data.js
│   │   └── sidebar.js
│   └── pages/
│       ├── dashboard.html
│       ├── materiais.html
│       ├── quiz.html
│       ├── resultados.html
│       └── tempo.html
│
├── backend/
│   ├── server.js
│   └── package.json
│
└── database/
    └── init.sql
```

---

## 4. Frontend

### Responsabilidades

* Renderização da interface.
* Navegação entre módulos.
* Consumo da API REST.
* Manipulação dinâmica do DOM.
* Controle de sessões locais.

### Arquivos Principais

| Arquivo           | Função                         |
| ----------------- | ------------------------------ |
| index.html        | Página inicial                 |
| style.css         | Estilos globais                |
| app.js            | Navegação e integração com API |
| materiais-data.js | Dados e filtros de materiais   |
| sidebar.js        | Controle do menu lateral       |

---

## 5. Backend

### Tecnologia

* Node.js

### Responsabilidades

* Disponibilizar endpoints REST.
* Processar regras de negócio.
* Realizar consultas ao banco.
* Registrar resultados e sessões.

### Arquivo Principal

```text
backend/server.js
```

### Porta Padrão

```text
3001
```

---

## 6. Banco de Dados

### SGBD

```text
MySQL
```

### Script de Inicialização

```text
database/init.sql
```

Responsável por:

* Criação do banco.
* Criação das tabelas.
* Inserção dos dados iniciais.

---

## 7. Modelo de Dados

### usuarios

Armazena informações de autenticação.

| Campo   | Tipo    |
| ------- | ------- |
| id      | INT     |
| usuario | VARCHAR |
| senha   | VARCHAR |

#### Restrições

* Chave primária: id
* Usuário único

---

### materiais

Armazena conteúdos de estudo.

| Campo     | Tipo    |
| --------- | ------- |
| id        | INT     |
| titulo    | VARCHAR |
| categoria | VARCHAR |
| conteudo  | TEXT    |

---

### questoes

Armazena perguntas utilizadas nos quizzes.

| Campo            | Tipo    |
| ---------------- | ------- |
| id               | INT     |
| pergunta         | TEXT    |
| alternativa_a    | VARCHAR |
| alternativa_b    | VARCHAR |
| alternativa_c    | VARCHAR |
| alternativa_d    | VARCHAR |
| resposta_correta | CHAR(1) |

---

### resultados

Armazena desempenho dos usuários.

| Campo           | Tipo     |
| --------------- | -------- |
| id              | INT      |
| usuario_id      | INT      |
| pontuacao       | INT      |
| data_realizacao | DATETIME |

#### Relacionamento

```text
usuarios (1) ---- (N) resultados
```

---

### sessoes_estudo

Armazena registros de estudo.

| Campo            | Tipo     |
| ---------------- | -------- |
| id               | INT      |
| usuario_id       | INT      |
| duracao_segundos | INT      |
| data_sessao      | DATETIME |

#### Relacionamento

```text
usuarios (1) ---- (N) sessoes_estudo
```

---

## 8. Requisitos de Infraestrutura

### Software

| Componente          | Requisito                       |
| ------------------- | ------------------------------- |
| Sistema Operacional | Windows, Linux ou macOS         |
| Runtime             | Node.js                         |
| Banco de Dados      | MySQL                           |
| Containers          | Docker Desktop                  |
| Navegador           | Chrome, Edge, Firefox ou Safari |
| Servidor Estático   | Serve                           |

### Hardware

| Recurso       | Mínimo      |
| ------------- | ----------- |
| CPU           | 1 núcleo    |
| Memória RAM   | 4 GB        |
| Armazenamento | 2 GB livres |

---

## 9. Implantação

### Instalação de Dependências

```bash
cd backend
npm install

npm install -g serve
```

### Inicialização do Banco

```bash
docker compose up -d
```

### Inicialização do Backend

```bash
cd backend
node server.js
```

### Inicialização do Frontend

```bash
serve -l 8080
```

### Acesso

```text
http://localhost:8080
```

---

## 10. Segurança

A implementação atual utiliza autenticação simples para fins acadêmicos.

### Melhorias Futuras

* JWT Authentication
* BCrypt para hash de senhas
* Controle de perfis de acesso
* HTTPS
* Rate Limiting
* Proteção contra SQL Injection

---

## 11. Encerramento do Ambiente

Parar e remover os containers:

```bash
docker compose down
```

---

## 12. Escalabilidade

A arquitetura permite futuras implementações de:

* Autenticação baseada em JWT
* Múltiplos usuários simultâneos
* Multi-tenancy
* Dashboard analítico avançado
* Exportação de relatórios
* Integração com APIs externas
