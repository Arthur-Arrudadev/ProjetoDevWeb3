#!/bin/bash

# Script para iniciar o projeto usando tmux com três painéis: frontend, backend e Docker

# Criar uma nova sessão tmux chamada 'projeto'
tmux new-session -d -s projeto

# Painel 0: Iniciar o Docker (banco de dados)
tmux send-keys -t projeto:0 'cd /workspaces/ProjetoDevWeb3 && docker-compose up' C-m

# Aguardar um pouco para o banco iniciar
sleep 5

# Dividir a janela horizontalmente para o backend
tmux split-window -h -t projeto:0

# Painel 1: Iniciar o backend
tmux send-keys -t projeto:1 'cd /workspaces/ProjetoDevWeb3/backend && npm install && node server.js' C-m

# Dividir a janela verticalmente para o frontend
tmux split-window -v -t projeto:1

# Painel 2: Iniciar o frontend
tmux send-keys -t projeto:2 'cd /workspaces/ProjetoDevWeb3/frontend && serve -l 8080' C-m

# Anexar à sessão tmux
tmux attach-session -t projeto