import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { to: '/dashboard', icon: '🏠', label: 'Dashboard' },
  { to: '/quiz',      icon: '🧠', label: 'Quiz' },
  { to: '/results',   icon: '📊', label: 'Resultados' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">📚</div>
        <span>Nexus Study</span>
      </div>
      <nav>
        {NAV.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            <span className="icon">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/profile" className="sidebar-profile-link">
          <div className="sidebar-avatar">
            {user?.avatar_url
              ? <img src={user.avatar_url} alt={user?.name} />
              : <span>{user?.name?.charAt(0).toUpperCase()}</span>}
          </div>
          <div className="sidebar-profile-info">
            <strong>{user?.name}</strong>
            <span>{user?.email}</span>
          </div>
        </NavLink>
        <button className="btn-logout" onClick={handleLogout}>Sair</button>
      </div>
    </aside>
  );
}
