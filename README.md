📚 Nexus Study

Plataforma web de estudos inteligente desenvolvida para estudo e avaliação de questões do ENEM. O sistema permite que o usuário resolva questões, acompanhe seu desempenho em um dashboard com gráficos e gerencie seu perfil.

Projeto desenvolvido por Arthur Arruda e Maria Eduarda como trabalho da disciplina de Desenvolvimento de Sistemas Web.


🚀 Funcionalidades

 
- ✅ Cadastro e login de usuário com senha criptografada (bcrypt, salt rounds 12)
- ✅ Validação de formato de e-mail no backend (rejeita e-mails inválidos)
- ✅ Quiz de questões com filtro por disciplina e ano
- ✅ Imagens das questões renderizadas corretamente no quiz
- ✅ Cronômetro de tempo estudado durante o quiz
- ✅ Marcação de questões para revisão (salva no banco de dados)
- ✅ Registro automático de sessões de estudo com tempo em minutos
- ✅ Dashboard de desempenho com gráficos de acertos, erros e revisão
- ✅ Filtros por disciplina e período (7, 30, 90 dias ou todo período)
- ✅ Sessões realizadas e tempo estudado contabilizados no dashboard
- ✅ Página de resultados com exportação em PDF
- ✅ Edição de perfil com nome e foto (upload em base64, limite de 2MB)
- ✅ Alteração de senha com validação da senha atual via bcrypt
- ✅ Recuperação de senha via token com expiração de 30 minutos



🛠️ Tecnologias utilizadas

# Frontend

TecnologiaVersãoUsoReact19Interface do usuárioReact Router DOM7Navegação entre páginasRecharts3Gráficos do dashboardVite8Bundler e servidor de desenvolvimento

# Backend

TecnologiaVersãoUsoNode.js18+ServidorExpress5Framework HTTPPostgreSQL16Banco de dados relacionalbcryptjs2Hash de senhaspg8Driver do PostgreSQL

# Infraestrutura

TecnologiaUsoDockerContainerização dos serviçosDocker ComposeOrquestração dos containersNginxProxy reverso (roteamento /api → backend, / → frontend)


# 📁 Estrutura do projeto

- nexus-study-completo/
- ├── backend/        -   # API REST em Node.js + Express
- ├── frontend/       -  # Interface em React + Vite
- ├── database/       -  # Script SQL de criação das tabelas
- ├── seeder/         -  # Popula o banco com questões do ENEM
- ├── nginx/          -  # Configuração do proxy reverso
- └── docker-compose.yml


▶️ Como rodar o projeto

# Pré-requisitos

- Docker Desktop
- Git

# Passo a passo

1. Clonar o repositório
```
bashgit clone https://github.com/Arthur-Arrudadev/ProjetoDevWeb3.git
cd ProjetoDevWeb3
```
3. Entrar na pasta do projeto
```
bashcd nexus-study-completo
```
4. Subir todos os serviços com Docker
```
bashdocker compose up --build
```
Esse comando vai:

Criar e iniciar o banco de dados PostgreSQL
Popular o banco com as questões do ENEM automaticamente (seeder)
Iniciar o backend na porta 4000
Iniciar o frontend na porta 3000
Iniciar o Nginx na porta 80 fazendo o roteamento

4. Acessar no navegador
```
http://localhost
```
Pronto! O sistema estará rodando. 🎉

⏹️ Parar o projeto
```
bashdocker compose down
```
Para parar e apagar os dados do banco:
```
bashdocker compose down -v
```

👤 Testando o sistema

1. Acesse `http://localhost`
2. Clique em **Criar conta** e cadastre um usuário.
3. Faça login com o e-mail e senha cadastrados.
4. Acesse o **Quiz**, selecione disciplina, ano e número de questões.
5. Responda as questões — o cronômetro conta o tempo automaticamente.
6. Use o botão **Marcar para Revisão** para salvar questões para revisar depois.
7. Ao finalizar, a sessão de estudo é registrada automaticamente.
8. Acesse o **Dashboard** para ver acertos, erros, revisões, sessões e tempo estudado.
9. Acesse **Perfil** para editar nome, foto e senha.
10. Para recuperar a senha, clique em **Esqueci minha senha** na tela de login.

🗄️ Banco de dados

O banco é criado automaticamente ao subir os containers. As tabelas são:

- users — usuários cadastrados
- questions — questões do ENEM
- alternatives — alternativas de cada questão
- user_answers — respostas dos usuários
- results — desempenho por disciplina e dia
- study_sessions — sessões de estudo
- password_reset_tokens — tokens de recuperação de senha


- `user_answers` — Respostas dos usuários (UNIQUE por usuário+questão, impede resposta duplicada)
- `results` — Desempenho por disciplina e dia (acertos, erros, revisão — atualizado via UPSERT)
- `study_sessions` — Sessões de estudo salvas automaticamente ao finalizar o quiz com duração em minutos
- `password_reset_tokens` — Tokens de recuperação de senha (expiram em 30 min, invalidados após uso)

👥 Equipe

Integrante Responsabilidade

- 1 Arthur Arruda - Backend - Frontend - Docker - integração geral
- 2 Maria Eduarda - Documentação - requisitos - protótipos e casos de uso


