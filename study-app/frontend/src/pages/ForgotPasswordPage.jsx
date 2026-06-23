import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1); // 1 = solicitar, 2 = redefinir, 3 = concluído
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tokenFromServer, setTokenFromServer] = useState(''); // só para demo

  async function handleRequest(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await api.requestPasswordReset(email);
      // Em produção o token vai por e-mail; aqui exibimos para demo
      if (res.token) setTokenFromServer(res.token);
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleReset(e) {
    e.preventDefault();
    if (newPassword !== confirmPassword) { setError('As senhas não coincidem'); return; }
    setError(''); setLoading(true);
    try {
      await api.confirmPasswordReset(token, newPassword);
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-logo">
          <div className="logo-circle">🔑</div>
          <h1>Recuperar Senha</h1>
          <p>
            {step === 1 && 'Informe seu e-mail para receber o token de recuperação'}
            {step === 2 && 'Insira o token e defina sua nova senha'}
            {step === 3 && 'Senha redefinida com sucesso!'}
          </p>
        </div>

        {error && <div className="alert danger">{error}</div>}

        {step === 1 && (
          <form onSubmit={handleRequest}>
            <div className="form-group">
              <label>E-mail</label>
              <input type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com" required />
            </div>
            <button className="btn-primary" disabled={loading}>
              {loading ? 'Enviando...' : 'Solicitar recuperação'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleReset}>
            {tokenFromServer && (
              <div style={{
                background: '#fffbeb', border: '1px solid #fcd34d',
                borderRadius: 8, padding: '10px 14px', marginBottom: 16,
                fontSize: 12, color: '#92400e'
              }}>
                <strong>📧 Token de demonstração</strong> (em produção seria enviado por e-mail):<br />
                <code style={{ wordBreak: 'break-all', fontFamily: 'monospace', fontSize: 11 }}>
                  {tokenFromServer}
                </code>
              </div>
            )}
            <div className="form-group">
              <label>Token de recuperação</label>
              <input value={token} onChange={e => setToken(e.target.value)}
                placeholder="Cole o token aqui" required />
            </div>
            <div className="form-group">
              <label>Nova senha</label>
              <input type="password" value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                minLength={6} required />
            </div>
            <div className="form-group">
              <label>Confirmar nova senha</label>
              <input type="password" value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                minLength={6} required />
            </div>
            <button className="btn-primary" disabled={loading}>
              {loading ? 'Redefinindo...' : 'Redefinir senha'}
            </button>
          </form>
        )}

        {step === 3 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
            <p style={{ color: 'var(--muted)', marginBottom: 20 }}>
              Sua senha foi redefinida. Faça login com a nova senha.
            </p>
            <Link to="/login">
              <button className="btn-primary">Ir para o Login</button>
            </Link>
          </div>
        )}

        {step !== 3 && (
          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--muted)' }}>
            Lembrou a senha? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Entrar</Link>
          </p>
        )}
      </div>
    </div>
  );
}
