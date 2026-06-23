import { useEffect, useState } from 'react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, Legend, Cell
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import Layout from '../components/Layout';

const PERIODS = [
  { value: '7d',  label: 'Últimos 7 dias' },
  { value: '30d', label: 'Últimos 30 dias' },
  { value: '90d', label: 'Últimos 90 dias' },
  { value: 'all', label: 'Todo período' },
];

function pctColor(v) {
  if (v >= 70) return 'var(--success)';
  if (v >= 40) return 'var(--warning)';
  return 'var(--danger)';
}

export default function DetailedReportPage() {
  const { user } = useAuth();
  const [report, setReport] = useState([]);
  const [period, setPeriod] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true); setError('');
    api.getDetailedReport(user.id, { period })
      .then(setReport)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [user.id, period]);

  // dados para radar
  const radarData = report.map(r => ({
    discipline: r.discipline.length > 12 ? r.discipline.slice(0, 12) + '…' : r.discipline,
    aproveitamento: Number(r.accuracy_pct),
  }));

  // totais
  const totals = report.reduce((acc, r) => ({
    questions: acc.questions + Number(r.total_questions),
    correct:   acc.correct   + Number(r.correct),
    wrong:     acc.wrong     + Number(r.wrong),
    review:    acc.review    + Number(r.to_review),
    minutes:   acc.minutes   + Number(r.total_minutes),
  }), { questions: 0, correct: 0, wrong: 0, review: 0, minutes: 0 });

  const globalPct = totals.questions > 0
    ? ((totals.correct / totals.questions) * 100).toFixed(1)
    : 0;

  return (
    <Layout>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 className="page-title" style={{ margin: 0 }}>📋 Relatório Detalhado</h1>
        <select
          className="form-group"
          style={{ margin: 0, padding: '8px 12px', borderRadius: 8,
            border: '1.5px solid var(--border)', fontSize: 13, fontFamily: 'inherit' }}
          value={period} onChange={e => setPeriod(e.target.value)}
        >
          {PERIODS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
        </select>
      </div>

      {loading && <p style={{ color: 'var(--muted)' }}>Carregando relatório...</p>}
      {error   && <div className="alert danger">{error}</div>}

      {!loading && !error && report.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: 48 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
          <p style={{ color: 'var(--muted)' }}>Nenhum dado encontrado para o período selecionado.</p>
          <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 4 }}>
            Complete alguns quizzes para ver seu relatório aqui.
          </p>
        </div>
      )}

      {!loading && report.length > 0 && (
        <>
          {/* Sumário global */}
          <div className="grid-4" style={{ marginBottom: 24 }}>
            {[
              { icon: '❓', label: 'Total de Questões', value: totals.questions, color: 'blue' },
              { icon: '✅', label: 'Acertos',           value: totals.correct,   color: 'green' },
              { icon: '❌', label: 'Erros',             value: totals.wrong,     color: 'red' },
              { icon: '🎯', label: 'Aproveitamento',    value: `${globalPct}%`,  color: globalPct >= 70 ? 'green' : globalPct >= 40 ? 'yellow' : 'red' },
            ].map(s => (
              <div key={s.label} className="stat-card">
                <div className={`stat-icon ${s.color}`}>{s.icon}</div>
                <div>
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid-2" style={{ marginBottom: 24 }}>
            {/* Gráfico de barras */}
            <div className="card">
              <p className="card-title">Desempenho por Disciplina</p>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={report} margin={{ top: 4, right: 4, left: -10, bottom: 40 }}>
                  <XAxis dataKey="discipline" tick={{ fontSize: 11 }}
                    angle={-35} textAnchor="end" interval={0} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v, name) => [v, name === 'correct' ? 'Acertos' : name === 'wrong' ? 'Erros' : 'Revisar']} />
                  <Legend formatter={v => ({ correct: 'Acertos', wrong: 'Erros', to_review: 'Revisar' }[v] || v)} />
                  <Bar dataKey="correct"   fill="var(--success)" name="correct"   radius={[4,4,0,0]} />
                  <Bar dataKey="wrong"     fill="var(--danger)"  name="wrong"     radius={[4,4,0,0]} />
                  <Bar dataKey="to_review" fill="var(--warning)" name="to_review" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Radar */}
            <div className="card">
              <p className="card-title">Aproveitamento por Disciplina (%)</p>
              {radarData.length >= 3 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="discipline" tick={{ fontSize: 11 }} />
                    <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Radar name="Aproveitamento" dataKey="aproveitamento"
                      stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.3} />
                    <Tooltip formatter={v => [`${v}%`, 'Aproveitamento']} />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ height: 260, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: 'var(--muted)', fontSize: 13 }}>
                  Radar disponível com 3+ disciplinas
                </div>
              )}
            </div>
          </div>

          {/* Tabela detalhada */}
          <div className="card">
            <p className="card-title">Tabela Completa por Disciplina</p>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Disciplina</th>
                    <th>Questões</th>
                    <th>Acertos</th>
                    <th>Erros</th>
                    <th>Revisar</th>
                    <th>Aproveitamento</th>
                    <th>Dias ativos</th>
                    <th>Tempo estudo</th>
                    <th>Última atividade</th>
                  </tr>
                </thead>
                <tbody>
                  {report.map(r => {
                    const pct = Number(r.accuracy_pct);
                    return (
                      <tr key={r.discipline}>
                        <td><strong>{r.discipline}</strong></td>
                        <td>{r.total_questions}</td>
                        <td style={{ color: 'var(--success)', fontWeight: 600 }}>{r.correct}</td>
                        <td style={{ color: 'var(--danger)',  fontWeight: 600 }}>{r.wrong}</td>
                        <td style={{ color: 'var(--warning)', fontWeight: 600 }}>{r.to_review}</td>
                        <td>
                          <span style={{
                            display: 'inline-block', padding: '2px 10px',
                            borderRadius: 20, fontWeight: 700, fontSize: 13,
                            background: `${pctColor(pct)}22`,
                            color: pctColor(pct),
                          }}>
                            {pct}%
                          </span>
                        </td>
                        <td>{r.active_days}</td>
                        <td>{r.total_minutes > 0 ? `${r.total_minutes} min` : '—'}</td>
                        <td style={{ fontSize: 12, color: 'var(--muted)' }}>
                          {r.last_activity
                            ? new Date(r.last_activity).toLocaleDateString('pt-BR')
                            : '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}
