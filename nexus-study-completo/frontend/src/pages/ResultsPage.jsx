import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';

function Badge({ value, type }) {
  const colors = {
    green:  { bg: '#d1fae5', color: '#065f46' },
    red:    { bg: '#fee2e2', color: '#991b1b' },
    yellow: { bg: '#fef3c7', color: '#92400e' },
  };
  const c = colors[type] || colors.green;
  return (
    <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600, background: c.bg, color: c.color }}>
      {value}
    </span>
  );
}

export default function ResultsPage() {
  const { user } = useAuth();
  const [dash, setDash] = useState(null);
  const [weekly, setWeekly] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [d, w] = await Promise.all([
        api.getDashboard(user.id),
        api.getWeeklyEvolution(user.id),
      ]);
      setDash(d);
      setWeekly(w);
      setLoading(false);
    }
    load().catch(() => setLoading(false));
  }, [user.id]);

  const correct  = dash ? Number(dash.total_correct)    || 0 : 0;
  const wrong    = dash ? Number(dash.total_wrong)      || 0 : 0;
  const review   = dash ? Number(dash.total_review)     || 0 : 0;
  const total    = correct + wrong + review;
  const accuracy = total > 0 ? Math.round(correct / total * 100) : 0;

  // Build full 7-day chart data (fill missing days with 0)
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const iso = d.toISOString().slice(0, 10);
    const found = weekly.find(w => w.evaluated_at?.slice(0, 10) === iso);
    return {
      date: d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' }),
      Acertos:  found ? Number(found.correct) || 0 : 0,
      Erros:    found ? Number(found.wrong)   || 0 : 0,
      Revisão:  found ? Number(found.review)  || 0 : 0,
    };
  });

  // History table: weekly sorted most recent first
  const history = [...weekly].sort((a, b) => new Date(b.evaluated_at) - new Date(a.evaluated_at));

  return (
    <Layout>
      <div className="page-title">📊 Resultados</div>

      {loading && <div style={{ color: '#64748b' }}>Carregando...</div>}

      {dash && (
        <>
          <div className="grid-4" style={{ marginBottom: 24 }}>
            <StatCard icon="✅" value={correct}  label="Total de Acertos" color="green"  />
            <StatCard icon="❌" value={wrong}    label="Total de Erros"   color="red"    />
            <StatCard icon="🔄" value={review}   label="Para Revisar"     color="yellow" />
            <StatCard icon="🎯" value={`${accuracy}%`} label="Taxa Geral" color="blue"  />
          </div>

          {/* Acertos/Erros/Revisão agrupados por dia (últimos 7 dias) */}
          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-title">Desempenho por Dia — Últimos 7 Dias</div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={last7} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} allowDecimals={false} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="Acertos" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Erros"   stackId="a" fill="#ef4444" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Revisão" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* History table */}
          <div className="card">
            <div className="card-title">Histórico de Avaliações</div>
            {history.length === 0 ? (
              <div style={{ color: '#94a3b8', fontSize: 14, padding: '20px 0' }}>
                Nenhum resultado ainda. Faça um quiz!
              </div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Disciplina</th>
                      <th>Total</th>
                      <th>Acertos</th>
                      <th>Erros</th>
                      <th>Revisão</th>
                      <th>Aproveitamento</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((row, i) => {
                      const t = (Number(row.correct) || 0) + (Number(row.wrong) || 0) + (Number(row.review) || 0);
                      const pct = t > 0 ? Math.round((Number(row.correct) || 0) / t * 100) : 0;
                      const badgeColor = pct >= 70 ? 'green' : pct >= 50 ? 'yellow' : 'red';
                      // Group by discipline per day — use evaluated_at as key
                      const date = row.evaluated_at
                        ? new Date(row.evaluated_at).toLocaleDateString('pt-BR')
                        : '—';
                      return (
                        <tr key={i}>
                          <td>{date}</td>
                          <td><strong>{row.discipline || '—'}</strong></td>
                          <td>{t}</td>
                          <td><Badge value={row.correct || 0} type="green" /></td>
                          <td><Badge value={row.wrong   || 0} type="red" /></td>
                          <td><Badge value={row.review  || 0} type="yellow" /></td>
                          <td><Badge value={`${pct}%`} type={badgeColor} /></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </Layout>
  );
}
