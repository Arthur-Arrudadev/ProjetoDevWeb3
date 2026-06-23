import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      setError('As senhas não coincidem');
      return;
    }
    setLoading(true);
    try {
      const data = await api.register({ name: form.name, email: form.email, password: form.password });
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  }

  function update(field) {
    return e => setForm(f => ({ ...f, [field]: e.target.value }));
  }

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-logo">
          <div className="logo-circle">📚</div>
          <h1>Criar Conta</h1>
          <p>Comece sua jornada no Nexus Study</p>
        </div>

        {error && (
          <div className="alert danger" style={{ display: 'block' }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome</label>
            <input type="text" placeholder="Seu nome" value={form.name} onChange={update('name')} required />
          </div>
          <div className="form-group">
            <label>E-mail</label>
            <input type="email" placeholder="seu@email.com" value={form.email} onChange={update('email')} required />
          </div>
          <div className="form-group">
            <label>Senha</label>
            <input type="password" placeholder="••••••••" value={form.password} onChange={update('password')} required minLength={6} />
          </div>
          <div className="form-group">
            <label>Confirmar Senha</label>
            <input type="password" placeholder="••••••••" value={form.confirm} onChange={update('confirm')} required />
          </div>
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#64748b' }}>
          Já tem conta?{' '}
          <Link to="/login" style={{ color: '#4f46e5', fontWeight: 600 }}>Entrar</Link>
        </p>
      </div>
    </div>
  );
}
