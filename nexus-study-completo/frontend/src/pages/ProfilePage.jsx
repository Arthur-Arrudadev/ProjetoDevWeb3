import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import Layout from '../components/Layout';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ProfilePage() {
  const { user, login } = useAuth();
  const fileInputRef = useRef(null);

  // Seção: dados gerais (nome + foto)
  const [name, setName] = useState(user?.name || '');
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar_url || null);
  const [avatarFile, setAvatarFile] = useState(null); // base64 pronto pra enviar
  const [nameLoading, setNameLoading] = useState(false);
  const [nameMsg, setNameMsg] = useState(null);

  // Seção: troca de senha
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passLoading, setPassLoading] = useState(false);
  const [passMsg, setPassMsg] = useState(null);

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setNameMsg(null);

    if (!file.type.startsWith('image/')) {
      setNameMsg({ type: 'error', text: 'Selecione um arquivo de imagem válido.' });
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setNameMsg({ type: 'error', text: 'A imagem deve ter no máximo 2MB.' });
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      setAvatarPreview(base64);
      setAvatarFile(base64);
    } catch {
      setNameMsg({ type: 'error', text: 'Não foi possível ler a imagem.' });
    }
  }

  function handleRemovePhoto() {
    setAvatarPreview(null);
    setAvatarFile(''); // string vazia sinaliza remoção
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleUpdateName(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setNameLoading(true);
    setNameMsg(null);
    try {
      const payload = { name };
      if (avatarFile !== null) payload.avatar_url = avatarFile; // só envia se mudou

      const updated = await api.updateProfile(user.id, payload);
      login({ ...user, name: updated.name, avatar_url: updated.avatar_url });
      setAvatarFile(null); // já foi salvo, limpa o "pendente"
      setNameMsg({ type: 'success', text: 'Perfil atualizado com sucesso!' });
    } catch (err) {
      setNameMsg({ type: 'error', text: err.message });
    } finally {
      setNameLoading(false);
    }
  }

  async function handleUpdatePassword(e) {
    e.preventDefault();
    setPassMsg(null);
    if (newPassword !== confirmPassword) {
      setPassMsg({ type: 'error', text: 'As senhas não coincidem' });
      return;
    }
    setPassLoading(true);
    try {
      await api.updateProfile(user.id, { name: user.name, currentPassword, newPassword });
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
      setPassMsg({ type: 'success', text: 'Senha alterada com sucesso!' });
    } catch (err) {
      setPassMsg({ type: 'error', text: err.message });
    } finally {
      setPassLoading(false);
    }
  }

  return (
    <Layout>
      <h1 className="page-title">👤 Meu Perfil</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 900 }}>

        {/* Card: Dados pessoais + Foto */}
        <div className="card">
          <p className="card-title">Informações Pessoais</p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 24 }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                width: 76, height: 76, borderRadius: '50%',
                background: 'var(--primary)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 30, fontWeight: 800, flexShrink: 0,
                overflow: 'hidden', border: '3px solid #e2e8f0',
              }}>
                {avatarPreview
                  ? <img src={avatarPreview} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : (name?.charAt(0).toUpperCase() || '?')}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Alterar foto"
                style={{
                  position: 'absolute', bottom: -2, right: -2,
                  width: 28, height: 28, borderRadius: '50%',
                  background: '#4f46e5', color: '#fff', border: '2px solid #fff',
                  cursor: 'pointer', fontSize: 13, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                }}
              >
                📷
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{user?.name}</div>
              <div style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 6 }}>{user?.email}</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    fontSize: 12, padding: '5px 10px', borderRadius: 6,
                    border: '1px solid #e2e8f0', background: '#f8fafc',
                    color: '#475569', cursor: 'pointer',
                  }}
                >
                  Trocar foto
                </button>
                {avatarPreview && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    style={{
                      fontSize: 12, padding: '5px 10px', borderRadius: 6,
                      border: '1px solid #fca5a5', background: '#fee2e2',
                      color: '#991b1b', cursor: 'pointer',
                    }}
                  >
                    Remover foto
                  </button>
                )}
              </div>
            </div>
          </div>

          <form onSubmit={handleUpdateName}>
            {nameMsg && (
              <div className={`alert ${nameMsg.type === 'success' ? '' : 'danger'}`}
                style={nameMsg.type === 'success' ? {
                  background: '#d1fae5', color: '#065f46',
                  border: '1px solid #6ee7b7', padding: '10px 14px',
                  borderRadius: 8, marginBottom: 14, fontSize: 13
                } : { display: 'block' }}>
                {nameMsg.text}
              </div>
            )}
            <div className="form-group">
              <label>Nome completo</label>
              <input value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>E-mail</label>
              <input value={user?.email} disabled style={{ background: '#f8fafc', color: 'var(--muted)' }} />
            </div>
            <button className="btn-primary" type="submit" disabled={nameLoading}>
              {nameLoading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </form>
        </div>

        {/* Card: Trocar senha */}
        <div className="card">
          <p className="card-title">Alterar Senha</p>
          <form onSubmit={handleUpdatePassword}>
            {passMsg && (
              <div className={`alert ${passMsg.type === 'success' ? '' : 'danger'}`}
                style={passMsg.type === 'success' ? {
                  background: '#d1fae5', color: '#065f46',
                  border: '1px solid #6ee7b7', padding: '10px 14px',
                  borderRadius: 8, marginBottom: 14, fontSize: 13
                } : { display: 'block' }}>
                {passMsg.text}
              </div>
            )}
            <div className="form-group">
              <label>Senha atual</label>
              <input type="password" value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Nova senha</label>
              <input type="password" value={newPassword}
                onChange={e => setNewPassword(e.target.value)} required minLength={6} />
            </div>
            <div className="form-group">
              <label>Confirmar nova senha</label>
              <input type="password" value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)} required minLength={6} />
            </div>
            <button className="btn-primary" type="submit" disabled={passLoading}>
              {passLoading ? 'Alterando...' : 'Alterar Senha'}
            </button>
          </form>
        </div>

        {/* Card: Informações da conta */}
        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <p className="card-title">Informações da Conta</p>
          <div style={{ display: 'flex', gap: 40 }}>
            <div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>ID do usuário</div>
              <div style={{ fontFamily: 'monospace', fontSize: 13, color: 'var(--text)' }}>{user?.id}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>Membro desde</div>
              <div style={{ fontSize: 13 }}>
                {user?.created_at
                  ? new Date(user.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
                  : '—'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
