function renderSidebar(paginaAtiva) {
  const usuario = getUsuario();
  const links = [
    { href: 'dashboard.html', icon: '📊', label: 'Dashboard' },
    { href: 'materiais.html', icon: '📖', label: 'Materiais' },
    { href: 'resultados.html', icon: '📋', label: 'Resultados' },
    { href: 'tempo.html',     icon: '⏱️', label: 'Tempo de Estudo' },
    { href: 'quiz.html',      icon: '🧠', label: 'Quiz' }
  ];

  const nav = links.map(l => `
    <a href="${l.href}" class="${paginaAtiva === l.href ? 'active' : ''}">
      <span class="icon">${l.icon}</span>
      <span>${l.label}</span>
    </a>
  `).join('');

  return `
    <aside class="sidebar">
      <div class="sidebar-logo">
        <div class="logo-icon">📚</div>
        <span>StudySystem</span>
      </div>
      <nav>${nav}</nav>
      <div class="sidebar-footer">
        <strong>${usuario ? usuario.nome : ''}</strong>
        <small>@${usuario ? usuario.usuario : ''}</small>
        <button class="btn-logout" onclick="logout()">Sair</button>
      </div>
    </aside>
  `;
}
