@echo off
echo Instalando dependencias...
cd /d "%~dp0backend"
npm install
echo.
echo Iniciando backend na porta 3000...
node server.js
pause
