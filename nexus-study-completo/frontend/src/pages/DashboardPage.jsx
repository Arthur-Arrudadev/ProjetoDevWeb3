import { useEffect, useState, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite';
}

function fmt(n) {
  return Number(n) || 0;
}

const PERIODS = [
  { value: '7d',  label: 'Últimos 7 dias' },
  { value: '30d', label: 'Últimos 30 dias' },
  { value: '90d', label: 'Últimos 90 dias' },
  { value: 'all', label: 'Todo período' },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [dash, setDash] = useState(null);
  const [weekly, setWeekly] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtering, setFiltering] = useState(false);
  const [error, setError] = useState('');

  // Filtros
  const [discipline, setDiscipline] = useState('');
  const [period, setPeriod] = useState('7d');

  // Carrega disciplinas uma vez
  useEffect(() => {
    api.getDisciplines(user.id)
      .then(setDisciplines)
      .catch(() => {});
  }, [user.id]);

  const loadData = useCallback(async (isFirst = false) => {
    if (isFirst) setLoading(true);
    else setFiltering(true);
    setError('');
    try {
      const params = {};
      if (discipline) params.discipline = discipline;
      if (period !== 'all') params.period = period;

      const [d, w] = await Promise.all([
        api.getDashboard(user.id, params),
        api.getWeeklyEvolution(user.id, params),
      ]);
      setDash(d);
      setWeekly(w);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setFiltering(false);
    }
  }, [user.id, discipline, period]);

  // Carga inicial
  useEffect(() => {
    loadData(true);
  }, []);  // eslint-disable-line

  // Recarrega ao mudar filtros (exceto carga inicial)
  useEffect(() => {
    loadData(false);
  }, [discipline, period]); // eslint-disable-line

  const correct  = dash ? fmt(dash.total_correct)  : 0;
  const wrong    = dash ? fmt(dash.total_wrong)    : 0;
  const review   = dash ? fmt(dash.total_review)   : 0;
  const total    = correct + wrong + review;
  const accuracy = total > 0 ? Math.round(correct / total * 100) : 0;
  const sessions = dash ? fmt(dash.total_sessions) : 0;
  const minutes  = dash ? fmt(dash.total_minutes)  : 0;

  // Preenche dias faltantes no gráfico
  const periodDays = period === '30d' ? 30 : period === '90d' ? 90 : period === 'all' ? 90 : 7;
  const chartData = Array.from({ length: Math.min(periodDays, 30) }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (Math.min(periodDays, 30) - 1 - i));
    const iso = d.toISOString().slice(0, 10);
    const found = weekly.find(w => w.evaluated_at?.slice(0, 10) === iso);
    return {
      date: d.toLocaleDateString('pt-BR', {
        day: '2-digit', month: '2-digit',
        ...(period === '90d' || period === 'all' ? {} : {}),
      }),
      Acertos: found ? fmt(found.correct) : 0,
      Erros:   found ? fmt(found.wrong)   : 0,
      Revisão: found ? fmt(found.review)  : 0,
    };
  }).filter(row => row.Acertos + row.Erros + row.Revisão > 0 || weekly.length === 0);

  const hasActivity = weekly.length > 0;

  return (
    <Layout>
      {/* Header */}
      <div className="page-title">
        {greeting()}, {user?.name?.split(' ')[0]}! 👋
        <div style={{ fontSize: '13px', fontWeight: 400, color: '#64748b', marginTop: 4 }}>
          {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>

      {/* Filtros */}
      <div style={{
        display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center',
        marginBottom: 24, padding: '14px 16px',
        background: '#f8fafc', borderRadius: 10,
        border: '1px solid #e2e8f0',
      }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#475569', marginRight: 4 }}>
          🔍 Filtrar:
        </span>

        {/* Disciplina */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <label style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Disciplina</label>
          <select
            value={discipline}
            onChange={e => setDiscipline(e.target.value)}
            style={{
              padding: '7px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8,
              fontSize: 13, background: '#fff', color: '#1e293b', cursor: 'pointer',
              minWidth: 180,
            }}
          >
            <option value="">Todas as disciplinas</option>
            {disciplines.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Período */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <label style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Período</label>
          <div style={{ display: 'flex', gap: 6 }}>
            {PERIODS.map(p => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                style={{
                  padding: '7px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                  cursor: 'pointer', border: '1.5px solid',
                  borderColor: period === p.value ? '#4f46e5' : '#e2e8f0',
                  background: period === p.value ? '#4f46e5' : '#fff',
                  color: period === p.value ? '#fff' : '#64748b',
                  transition: 'all 0.15s',
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Indicador de filtro ativo */}
        {(discipline || period !== '7d') && (
          <button
            onClick={() => { setDiscipline(''); setPeriod('7d'); }}
            style={{
              marginLeft: 'auto', padding: '7px 12px', borderRadius: 8, fontSize: 12,
              fontWeight: 600, cursor: 'pointer', border: '1.5px solid #fca5a5',
              background: '#fee2e2', color: '#991b1b',
            }}
          >
            ✕ Limpar filtros
          </button>
        )}

        {filtering && (
          <span style={{ fontSize: 12, color: '#94a3b8', marginLeft: 8 }}>Atualizando...</span>
        )}
      </div>

      {loading && <div style={{ color: '#64748b' }}>Carregando...</div>}
      {error && <div className="alert danger" style={{ display: 'block' }}>{error}</div>}

      {dash && (
        <>
          {/* StatCards */}
          <div className="grid-4" style={{ marginBottom: 24 }}>
            <StatCard icon="✅" value={correct}        label="Acertos"        color="green"  />
            <StatCard icon="❌" value={wrong}          label="Erros"          color="red"    />
            <StatCard icon="🔄" value={review}         label="Para Revisar"   color="yellow" />
            <StatCard icon="⏱️" value={`${minutes}min`} label="Tempo estudado" color="blue"  />
          </div>

          <div className="grid-2" style={{ marginBottom: 24 }}>
            {/* Resumo */}
            <div className="card">
              <div className="card-title">
                Resumo
                {discipline && (
                  <span style={{
                    marginLeft: 8, fontSize: 12, fontWeight: 500, padding: '2px 8px',
                    borderRadius: 20, background: '#ede9fe', color: '#5b21b6',
                  }}>
                    {discipline}
                  </span>
                )}
              </div>
              <div style={{ fontSize: 14, lineHeight: 2.2, color: '#475569' }}>
                📝 Total de questões: <strong>{total}</strong><br />
                ✅ Taxa de acerto: <strong style={{ color: accuracy >= 70 ? '#10b981' : accuracy >= 50 ? '#f59e0b' : '#ef4444' }}>{accuracy}%</strong><br />
                📚 Sessões realizadas: <strong>{sessions}</strong><br />
                🔄 Itens para revisar: <strong>{review}</strong>
              </div>
            </div>

            {/* Donut */}
            <div className="card">
              <div className="card-title">Distribuição de Respostas</div>
              {total === 0 ? (
                <div style={{ color: '#94a3b8', fontSize: 14, textAlign: 'center', padding: '32px 0' }}>
                  Nenhuma questão respondida ainda.<br />
                  <span style={{ fontSize: 12 }}>Faça um quiz para ver seu desempenho!</span>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
                  <div style={{ position: 'relative', width: 120, height: 120, flexShrink: 0 }}>
                    <DonutChart correct={correct} wrong={wrong} review={review} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[
                      { color: '#10b981', label: 'Acertos', val: correct },
                      { color: '#ef4444', label: 'Erros', val: wrong },
                      { color: '#f59e0b', label: 'Revisão', val: review },
                    ].map(i => (
                      <div key={i.label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                        <div style={{ width: 12, height: 12, borderRadius: 3, background: i.color }} />
                        <span>{i.label}: <strong>{i.val}</strong></span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Gráfico de evolução */}
          <div className="card">
            <div className="card-title">
              Evolução —{' '}
              {PERIODS.find(p => p.value === period)?.label ?? 'Últimos 7 dias'}
              {discipline && ` · ${discipline}`}
            </div>
            {!hasActivity ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8', fontSize: 14 }}>
                📊 Nenhum resultado{discipline ? ` em ${discipline}` : ''} neste período.<br />
                <small>Faça um Quiz para ver seu desempenho aqui.</small>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} allowDecimals={false} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="Acertos" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Erros"   fill="#ef4444" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Revisão" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </>
      )}
    </Layout>
  );
}

function DonutChart({ correct, wrong, review }) {
  const total = correct + wrong + review;
  if (total === 0) return null;

  const cx = 60, cy = 60, r = 50, stroke = 20;
  const circ = 2 * Math.PI * r;

  const segments = [
    { val: correct, color: '#10b981' },
    { val: wrong,   color: '#ef4444' },
    { val: review,  color: '#f59e0b' },
  ];

  let offset = 0;
  const arcs = segments.map(s => {
    const pct = s.val / total;
    const dash = pct * circ;
    const el = { ...s, dasharray: `${dash} ${circ - dash}`, offset };
    offset += dash;
    return el;
  });

  return (
    <svg viewBox="0 0 120 120" width="120" height="120">
      {arcs.map((a, i) => (
        <circle
          key={i}
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={a.color}
          strokeWidth={stroke}
          strokeDasharray={a.dasharray}
          strokeDashoffset={-a.offset}
          transform="rotate(-90 60 60)"
        />
      ))}
      <text x="60" y="65" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1e293b">
        {Math.round(correct / total * 100)}%
      </text>
    </svg>
  );
}
