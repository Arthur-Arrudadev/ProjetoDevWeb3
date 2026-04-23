// Usa URL relativa para funcionar com proxy nginx
// Se estiver em localhost:8080, o /api será encaminhado ao backend
const API = window.location.origin.includes('localhost:3001') 
  ? 'http://localhost:3001/api'  // Para desenvolvimento direto
  : '/api';  // Para produção com proxy

function getUsuario() {
  try { return JSON.parse(localStorage.getItem('usuario')); } catch { return null; }
}

function _raiz() {
  // Sobe de frontend/pages/ até a raiz do projeto
  return window.location.href
    .replace(/\/frontend\/pages\/[^\/]+$/, '')
    .replace(/\/[^\/]+$/, function(m) {
      return m.endsWith('.html') ? '' : m;
    });
}

function protegerPagina() {
  if (!getUsuario()) {
    const raiz = window.location.href.replace(/\/frontend\/pages\/[^\/]+$/, '');
    window.location.href = raiz + '/index.html';
  }
}

function logout() {
  localStorage.removeItem('usuario');
  const raiz = window.location.href.replace(/\/frontend\/pages\/[^\/]+$/, '');
  window.location.href = raiz + '/index.html';
}

function formatarMinutos(min) {
  min = parseInt(min) || 0;
  if (min === 0) return '0 min';
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h > 0 ? `${h}h ${m}min` : `${m} min`;
}

async function api(endpoint, options = {}) {
  const res = await fetch(API + endpoint, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
