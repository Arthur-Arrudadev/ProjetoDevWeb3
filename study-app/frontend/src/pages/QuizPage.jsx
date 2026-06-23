import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import Layout from '../components/Layout';

// --- Sub-components ---

function ProgressDots({ total, current, answers }) {
  return (
    <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
      {Array.from({ length: total }, (_, i) => {
        let bg = '#e2e8f0';
        if (i === current) bg = '#4f46e5';
        else if (answers[i]?.isCorrect === true)  bg = '#10b981';
        else if (answers[i]?.isReview === true)    bg = '#f59e0b';
        else if (answers[i]?.isCorrect === false) bg = '#ef4444';
        return <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: bg }} />;
      })}
    </div>
  );
}

function Alternative({ letter, text, state, onClick, disabled }) {
  const colors = {
    correct: { border: '#10b981', bg: '#d1fae5', letterBg: '#d1fae5', letterColor: '#065f46' },
    wrong:   { border: '#ef4444', bg: '#fee2e2', letterBg: '#fee2e2', letterColor: '#991b1b' },
    review:  { border: '#f59e0b', bg: '#fef3c7', letterBg: '#fef3c7', letterColor: '#92400e' },
    null:    { border: '#e2e8f0', bg: '#fff',    letterBg: '#f1f5f9', letterColor: '#475569' },
  };
  const c = colors[state] ?? colors[null];
  return (
    <div
      onClick={disabled ? null : onClick}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 12,
        padding: '14px 18px', border: `2px solid ${c.border}`,
        borderRadius: 10, cursor: disabled ? 'default' : 'pointer',
        marginBottom: 10, background: c.bg, transition: 'all 0.2s', fontSize: 14,
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.borderColor = '#4f46e5'; }}
      onMouseLeave={e => { if (!disabled) e.currentTarget.style.borderColor = c.border; }}
    >
      <div style={{
        width: 30, height: 30, borderRadius: '50%',
        background: c.letterBg, border: `1px solid ${c.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 700, fontSize: 13, color: c.letterColor, flexShrink: 0,
      }}>
        {letter}
      </div>
      <span style={{ lineHeight: 1.5, paddingTop: 4 }}>{text}</span>
    </div>
  );
}

function QuestionCard({ question, index, total, answered, onAnswer, onNext, onReview, isLast, answering }) {
  return (
    <div className="card" style={{ maxWidth: 720 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#4f46e5' }}>{question.discipline}</span>
        <span style={{ fontSize: 13, color: '#94a3b8' }}>Questão {index + 1} de {total}</span>
      </div>

      {question.context && (
        <div style={{ background: '#f8fafc', borderRadius: 8, padding: '12px 14px', marginBottom: 16, fontSize: 13, color: '#475569', lineHeight: 1.6, borderLeft: '3px solid #4f46e5' }}>
          {question.context}
        </div>
      )}

      <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 20, lineHeight: 1.6 }}>
        {question.title}
      </p>

      {question.alternatives_introduction && (
        <p style={{ fontSize: 13, color: '#64748b', marginBottom: 12 }}>{question.alternatives_introduction}</p>
      )}

      {question.alternatives?.map(alt => {
        let state = null;
        if (answered) {
          if (answered.isReview) state = 'review';
          else if (alt.letter === answered.correct_alternative) state = 'correct';
          else if (alt.letter === answered.chosen && !answered.isCorrect) state = 'wrong';
        }
        return (
          <Alternative
            key={alt.letter}
            letter={alt.letter}
            text={alt.text}
            state={state}
            disabled={!!answered || answering}
            onClick={() => onAnswer(alt.letter)}
          />
        );
      })}

      {answering && !answered && (
        <div style={{ fontSize: 13, color: '#64748b', marginTop: 8 }}>Verificando...</div>
      )}

      {answered && !answered.isReview && (
        <div style={{
          marginTop: 14, padding: '12px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600,
          background: answered.isCorrect ? '#d1fae5' : '#fee2e2',
          color: answered.isCorrect ? '#065f46' : '#991b1b',
        }}>
          {answered.isCorrect
            ? '✅ Correto!'
            : `❌ Errado! A resposta correta é a alternativa ${answered.correct_alternative}.`}
        </div>
      )}

      {answered && answered.isReview && (
        <div style={{
          marginTop: 14, padding: '12px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600,
          background: '#fef3c7', color: '#92400e',
        }}>
          🔄 Marcada para revisão posterior.
        </div>
      )}

      {answered && (
        <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
          <button
            onClick={onNext}
            style={{
              padding: '10px 24px', background: '#4f46e5', color: '#fff',
              border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer',
            }}
          >
            {isLast ? 'Ver Resultado' : 'Próxima →'}
          </button>

          {!answered.isReview && (
            <button
              onClick={onReview}
              style={{
                padding: '10px 20px', background: '#fef3c7', color: '#92400e',
                border: '2px solid #f59e0b', borderRadius: 8, fontSize: 14, fontWeight: 600,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              🔄 Marcar para Revisão
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function ResultScreen({ questions, answers, discipline, onRetry, onBack }) {
  const correct  = answers.filter(a => a?.isCorrect === true && !a?.isReview).length;
  const wrong    = answers.filter(a => a?.isCorrect === false && !a?.isReview).length;
  const review   = answers.filter(a => a?.isReview === true).length;
  const skipped  = answers.filter(a => a === null).length;
  const total    = questions.length;
  const accuracy = (correct + wrong) > 0 ? Math.round(correct / (correct + wrong) * 100) : 0;

  const emoji = accuracy >= 80 ? '🏆' : accuracy >= 60 ? '👍' : accuracy >= 40 ? '📚' : '💪';
  const title = accuracy >= 80 ? 'Excelente!' : accuracy >= 60 ? 'Bom trabalho!' : accuracy >= 40 ? 'Continue estudando!' : 'Não desista!';

  function exportPDF() {
    const printWindow = window.open('', '_blank');
    const date = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    const rows = questions.map((q, i) => {
      const ans = answers[i];
      let status = '—';
      let statusColor = '#64748b';
      let chosenLetter = '—';
      let correctLetter = '—';

      if (ans) {
        chosenLetter = ans.isReview ? 'Revisão' : (ans.chosen || '—');
        correctLetter = ans.correct_alternative || '—';
        if (ans.isReview) { status = '🔄 Revisão'; statusColor = '#92400e'; }
        else if (ans.isCorrect) { status = '✅ Correto'; statusColor = '#065f46'; }
        else { status = '❌ Errado'; statusColor = '#991b1b'; }
      }

      return `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 10px 8px; font-weight: 600; color: #4f46e5;">${i + 1}</td>
          <td style="padding: 10px 8px; font-size: 12px; max-width: 320px; line-height: 1.5;">${q.discipline}<br/><span style="color:#64748b; font-size:11px;">${q.title.substring(0, 120)}${q.title.length > 120 ? '...' : ''}</span></td>
          <td style="padding: 10px 8px; text-align: center; font-weight: 700; color: #4f46e5;">${chosenLetter}</td>
          <td style="padding: 10px 8px; text-align: center; font-weight: 700; color: #10b981;">${correctLetter}</td>
          <td style="padding: 10px 8px; font-weight: 600; color: ${statusColor};">${status}</td>
        </tr>`;
    }).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8"/>
        <title>Relatório de Questões — ${discipline}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; background: #fff; padding: 32px; }
          .header { border-bottom: 3px solid #4f46e5; padding-bottom: 20px; margin-bottom: 28px; }
          .header h1 { font-size: 22px; color: #4f46e5; margin-bottom: 4px; }
          .header p { font-size: 13px; color: #64748b; }
          .summary { display: flex; gap: 16px; margin-bottom: 28px; }
          .stat { flex: 1; padding: 16px; border-radius: 10px; text-align: center; }
          .stat .val { font-size: 28px; font-weight: 800; }
          .stat .lbl { font-size: 11px; font-weight: 600; margin-top: 4px; }
          table { width: 100%; border-collapse: collapse; font-size: 13px; }
          thead tr { background: #4f46e5; color: #fff; }
          thead th { padding: 12px 8px; text-align: left; font-weight: 600; }
          tbody tr:nth-child(even) { background: #f8fafc; }
          .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center; }
          @media print { body { padding: 16px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📊 Relatório de Questões</h1>
          <p>Matéria: <strong>${discipline}</strong> &nbsp;|&nbsp; Gerado em: ${date} &nbsp;|&nbsp; Total: ${total} questões</p>
        </div>

        <div class="summary">
          <div class="stat" style="background:#d1fae5;">
            <div class="val" style="color:#065f46;">${correct}</div>
            <div class="lbl" style="color:#065f46;">✅ Acertos</div>
          </div>
          <div class="stat" style="background:#fee2e2;">
            <div class="val" style="color:#991b1b;">${wrong}</div>
            <div class="lbl" style="color:#991b1b;">❌ Erros</div>
          </div>
          <div class="stat" style="background:#fef3c7;">
            <div class="val" style="color:#92400e;">${review}</div>
            <div class="lbl" style="color:#92400e;">🔄 Para Revisão</div>
          </div>
          <div class="stat" style="background:#e0e7ff;">
            <div class="val" style="color:#3730a3;">${accuracy}%</div>
            <div class="lbl" style="color:#3730a3;">🎯 Aproveitamento</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width:40px;">#</th>
              <th>Questão / Matéria</th>
              <th style="width:80px; text-align:center;">Escolhida</th>
              <th style="width:80px; text-align:center;">Correta</th>
              <th style="width:120px;">Status</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>

        <div class="footer">
          Sistema de Estudos &mdash; Relatório gerado automaticamente &mdash; ${date}
        </div>
        <script>window.onload = () => { window.print(); }</script>
      </body>
      </html>
    `);
    printWindow.document.close();
  }

  return (
    <div className="card" style={{ maxWidth: 620 }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 52, marginBottom: 8 }}>{emoji}</div>
        <div style={{ fontSize: 22, fontWeight: 700 }}>{title}</div>
        <div style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>
          {accuracy}% de acerto em {discipline}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 24 }}>
        {[
          { val: correct, label: 'Acertos',   bg: '#d1fae5', color: '#065f46' },
          { val: wrong,   label: 'Erros',     bg: '#fee2e2', color: '#991b1b' },
          { val: review,  label: 'Revisão',   bg: '#fef3c7', color: '#92400e' },
          { val: skipped, label: 'Sem resp.', bg: '#f1f5f9', color: '#475569' },
        ].map(s => (
          <div key={s.label} style={{ textAlign: 'center', padding: 14, background: s.bg, borderRadius: 10 }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 11, color: s.color, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button onClick={onRetry}
          style={{ flex: 1, minWidth: 140, padding: 12, background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          🔁 Novo Quiz
        </button>
        <button onClick={exportPDF}
          style={{ flex: 1, minWidth: 140, padding: 12, background: '#dc2626', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          📄 Exportar PDF
        </button>
        <button onClick={onBack}
          style={{ flex: 1, minWidth: 140, padding: 12, background: '#f1f5f9', color: '#1e293b', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          ← Voltar
        </button>
      </div>
    </div>
  );
}

// --- Tela de filtros com selects dinâmicos ---

function FilterScreen({ onStart }) {
  const [availableDisciplines, setAvailableDisciplines] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [loadingFilters, setLoadingFilters] = useState(true);

  const [discipline, setDiscipline] = useState('');
  const [year, setYear] = useState('');
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getQuestionFilters()
      .then(data => {
        setAvailableDisciplines(data.disciplines || []);
        setAvailableYears(data.years || []);
      })
      .catch(() => {})
      .finally(() => setLoadingFilters(false));
  }, []);

  async function handleStart() {
    setError('');
    setLoading(true);
    try {
      await onStart({ discipline, year, limit });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card" style={{ maxWidth: 520 }}>
      <div className="card-title">🧠 Configurar Quiz</div>

      {error && (
        <div className="alert danger" style={{ display: 'block', marginBottom: 12 }}>{error}</div>
      )}

      <div className="form-group">
        <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>
          Matéria
        </label>
        {loadingFilters ? (
          <div style={{ fontSize: 13, color: '#94a3b8', padding: '10px 0' }}>Carregando matérias...</div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
            <button
              onClick={() => setDiscipline('')}
              style={{
                padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                cursor: 'pointer', border: '1.5px solid',
                borderColor: discipline === '' ? '#4f46e5' : '#e2e8f0',
                background: discipline === '' ? '#4f46e5' : '#f8fafc',
                color: discipline === '' ? '#fff' : '#64748b',
              }}
            >
              Todas
            </button>
            {availableDisciplines.map(d => (
              <button
                key={d}
                onClick={() => setDiscipline(d)}
                style={{
                  padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                  cursor: 'pointer', border: '1.5px solid',
                  borderColor: discipline === d ? '#4f46e5' : '#e2e8f0',
                  background: discipline === d ? '#4f46e5' : '#f8fafc',
                  color: discipline === d ? '#fff' : '#475569',
                  transition: 'all 0.15s',
                }}
              >
                {d}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="form-group" style={{ marginTop: 16 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>
          Ano
        </label>
        {loadingFilters ? (
          <div style={{ fontSize: 13, color: '#94a3b8', padding: '10px 0' }}>Carregando anos...</div>
        ) : (
          <select
            value={year}
            onChange={e => setYear(e.target.value)}
            style={{
              width: '100%', padding: '10px 12px',
              border: '1.5px solid #e2e8f0', borderRadius: 8,
              fontSize: 14, background: '#fff', color: '#1e293b',
            }}
          >
            <option value="">Todos os anos</option>
            {availableYears.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        )}
      </div>

      <div className="form-group" style={{ marginTop: 16 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>
          Número de questões
        </label>
        <div style={{ display: 'flex', gap: 8 }}>
          {[5, 10, 15, 20].map(n => (
            <button
              key={n}
              onClick={() => setLimit(n)}
              style={{
                flex: 1, padding: '10px 0', borderRadius: 8, fontSize: 13, fontWeight: 600,
                cursor: 'pointer', border: '1.5px solid',
                borderColor: limit === n ? '#4f46e5' : '#e2e8f0',
                background: limit === n ? '#4f46e5' : '#f8fafc',
                color: limit === n ? '#fff' : '#64748b',
                transition: 'all 0.15s',
              }}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div style={{
        marginTop: 20, padding: '12px 14px', background: '#f1f5f9',
        borderRadius: 8, fontSize: 13, color: '#475569', lineHeight: 1.8,
      }}>
        📚 Matéria: <strong>{discipline || 'Todas'}</strong><br />
        📅 Ano: <strong>{year || 'Todos'}</strong><br />
        🔢 Questões: <strong>{limit}</strong>
      </div>

      <button
        onClick={handleStart}
        disabled={loading || loadingFilters}
        style={{
          marginTop: 16, width: '100%', padding: '13px 0',
          background: loading ? '#a5b4fc' : '#4f46e5',
          color: '#fff', border: 'none', borderRadius: 8,
          fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'background 0.2s',
        }}
      >
        {loading ? 'Carregando questões...' : '▶ Iniciar Quiz'}
      </button>
    </div>
  );
}

// --- Main QuizPage ---

export default function QuizPage() {
  const { user } = useAuth();
  const [screen, setScreen] = useState('filters');
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [answering, setAnswering] = useState(false);
  const [selectedDiscipline, setSelectedDiscipline] = useState('');

  async function handleStart({ discipline, year, limit }) {
    const qs = await api.getQuestions({
      discipline: discipline || undefined,
      year: year || undefined,
      limit,
    });
    if (qs.length === 0) {
      throw new Error('Nenhuma questão encontrada com esses filtros.');
    }
    const full = await Promise.all(qs.map(q => api.getQuestion(q.id)));
    setQuestions(full);
    setAnswers(new Array(full.length).fill(null));
    setCurrent(0);
    setSelectedDiscipline(discipline || full[0]?.discipline || 'Quiz');
    setScreen('quiz');
  }

  async function handleAnswer(letter) {
    if (answering || answers[current] !== null) return;
    setAnswering(true);
    const question = questions[current];
    try {
      const result = await api.answerQuestion(question.id, { user_id: user.id, chosen_letter: letter });
      setAnswers(prev => {
        const next = [...prev];
        next[current] = {
          chosen: letter,
          correct_alternative: result.correct_alternative,
          isCorrect: result.is_correct,
          isReview: false,
        };
        return next;
      });
    } catch (err) {
      if (err.message?.toLowerCase().includes('já respondida')) {
        setAnswers(prev => {
          const next = [...prev];
          next[current] = {
            chosen: letter,
            correct_alternative: question.correct_alternative ?? '?',
            isCorrect: false,
            isReview: false,
          };
          return next;
        });
      }
    } finally {
      setAnswering(false);
    }
  }

  function handleReview() {
    setAnswers(prev => {
      const next = [...prev];
      const cur = next[current];
      if (cur) {
        next[current] = { ...cur, isReview: true };
      }
      return next;
    });
  }

  function handleNext() {
    if (current < questions.length - 1) setCurrent(c => c + 1);
    else setScreen('result');
  }

  return (
    <Layout>
      <div className="page-title">🧠 Quiz</div>

      {screen === 'filters' && (
        <FilterScreen onStart={handleStart} />
      )}

      {screen === 'quiz' && questions.length > 0 && (
        <>
          <ProgressDots total={questions.length} current={current} answers={answers} />
          <QuestionCard
            key={current}
            question={questions[current]}
            index={current}
            total={questions.length}
            answered={answers[current]}
            onAnswer={handleAnswer}
            onNext={handleNext}
            onReview={handleReview}
            isLast={current === questions.length - 1}
            answering={answering}
          />
        </>
      )}

      {screen === 'result' && (
        <ResultScreen
          questions={questions}
          answers={answers}
          discipline={selectedDiscipline}
          onRetry={() => setScreen('filters')}
          onBack={() => setScreen('filters')}
        />
      )}
    </Layout>
  );
}
