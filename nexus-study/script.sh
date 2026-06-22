#!/bin/bash

set -e

echo "========================================"
echo " Parando e removendo containers antigos "
echo "========================================"

docker compose down -v --remove-orphans

echo "========================================"
echo " Removendo imagens antigas do projeto "
echo "========================================"

docker compose rm -f

echo "========================================"
echo " Limpando cache de build "
echo "========================================"

docker builder prune -af

echo "========================================"
echo " Subindo containers com build sem cache "
echo "========================================"

docker compose up --build --no-cache

echo "========================================"
echo " Projeto iniciado com sucesso "
echo "========================================"
