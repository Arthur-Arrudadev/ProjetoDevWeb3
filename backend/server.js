// Importa as dependências principais
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());          // Permite requisições de outras origens (frontend)
app.use(express.json()); // Interpreta o corpo das requisições como JSON

// Configurações de conexão com o banco de dados
// Usa variáveis de ambiente se disponíveis, senão usa os valores padrão do XAMPP
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sistema_estudo',
  port: parseInt(process.env.DB_PORT) || 3306
};

let db;

// Tenta conectar ao banco até 10 vezes, aguardando 3s entre cada tentativa
async function conectar() {
  let tentativas = 10;
  while (tentativas > 0) {
    try {
      db = await mysql.createConnection(dbConfig);
      console.log('Banco conectado!');
      return;
    } catch (e) {
      tentativas--;
      console.log(`Aguardando banco... (${tentativas} tentativas restantes)`);
      await new Promise(r => setTimeout(r, 3000));
    }
  }
  process.exit(1); // Encerra o processo se não conseguir conectar
}

// LOGIN - valida usuário e senha no banco
app.post('/api/login', async (req, res) => {
  const { usuario, senha } = req.body;
  if (!usuario || !senha) return res.status(400).json({ erro: 'Preencha todos os campos' });
  try {
    const [rows] = await db.execute(
      'SELECT id, nome, usuario FROM usuarios WHERE usuario = ? AND senha = ?',
      [usuario, senha]
    );
    if (rows.length === 0) return res.status(401).json({ erro: 'Usuário ou senha incorretos' });
    res.json({ sucesso: true, usuario: rows[0] });
  } catch (e) {
    res.status(500).json({ erro: 'Erro interno' });
  }
});

// DASHBOARD - retorna totais de acertos/erros/revisão e dados de sessões do usuário
app.get('/api/dashboard/:usuarioId', async (req, res) => {
  try {
    const [resultados] = await db.execute(
      'SELECT SUM(acertos) as acertos, SUM(erros) as erros, SUM(revisao) as revisao FROM resultados WHERE usuario_id = ?',
      [req.params.usuarioId]
    );
    const [sessoes] = await db.execute(
      'SELECT SUM(duracao_minutos) as total_minutos, COUNT(*) as total_sessoes FROM sessoes_estudo WHERE usuario_id = ?',
      [req.params.usuarioId]
    );
    res.json({ resultados: resultados[0], sessoes: sessoes[0] });
  } catch (e) {
    res.status(500).json({ erro: 'Erro interno' });
  }
});

// MATERIAIS - lista todos os materiais, com filtro opcional por categoria
app.get('/api/materiais', async (req, res) => {
  try {
    const { categoria } = req.query;
    let query = 'SELECT * FROM materiais';
    const params = [];
    if (categoria && categoria !== 'Todos') {
      query += ' WHERE categoria = ?';
      params.push(categoria);
    }
    const [rows] = await db.execute(query, params);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ erro: 'Erro interno' });
  }
});

// CATEGORIAS - retorna lista de categorias únicas dos materiais
app.get('/api/categorias', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT DISTINCT categoria FROM materiais ORDER BY categoria');
    res.json(rows.map(r => r.categoria));
  } catch (e) {
    res.status(500).json({ erro: 'Erro interno' });
  }
});

// EVOLUÇÃO SEMANAL - acertos/erros/revisão agrupados por dia nos últimos 7 dias
app.get('/api/evolucao/:usuarioId', async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT
         DATE(data_avaliacao) as dia,
         SUM(acertos) as acertos,
         SUM(erros) as erros,
         SUM(revisao) as revisao
       FROM resultados
       WHERE usuario_id = ?
         AND data_avaliacao >= CURDATE() - INTERVAL 6 DAY
       GROUP BY DATE(data_avaliacao)
       ORDER BY dia ASC`,
      [req.params.usuarioId]
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ erro: 'Erro interno' });
  }
});

// RECOMENDAÇÃO - identifica o assunto mais fraco e sugere materiais relacionados
app.get('/api/recomendacao/:usuarioId', async (req, res) => {
  try {
    // Busca o assunto com menor taxa de acerto (acertos / total de questões)
    const [fraco] = await db.execute(
      `SELECT assunto,
         SUM(acertos) as acertos,
         SUM(erros) as erros,
         SUM(revisao) as revisao,
         ROUND(SUM(acertos) / NULLIF(SUM(acertos)+SUM(erros)+SUM(revisao),0) * 100) as taxa
       FROM resultados WHERE usuario_id = ?
       GROUP BY assunto
       ORDER BY taxa ASC
       LIMIT 1`,
      [req.params.usuarioId]
    );

    if (fraco.length === 0) return res.json({ assunto: null, materiais: [] });

    const assunto = fraco[0].assunto;

    // Busca materiais cuja categoria ou título contenha o nome do assunto
    const [materiais] = await db.execute(
      `SELECT * FROM materiais
       WHERE LOWER(categoria) LIKE LOWER(?)
          OR LOWER(titulo) LIKE LOWER(?)
       LIMIT 3`,
      [`%${assunto}%`, `%${assunto}%`]
    );

    // Se não encontrou materiais relacionados, retorna os 3 primeiros como fallback
    if (materiais.length === 0) {
      const [fallback] = await db.execute('SELECT * FROM materiais LIMIT 3');
      return res.json({ assunto: fraco[0], materiais: fallback });
    }

    res.json({ assunto: fraco[0], materiais });
  } catch (e) {
    res.status(500).json({ erro: 'Erro interno' });
  }
});

// RESULTADOS - histórico de avaliações do usuário, do mais recente ao mais antigo
app.get('/api/resultados/:usuarioId', async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM resultados WHERE usuario_id = ? ORDER BY data_avaliacao DESC',
      [req.params.usuarioId]
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ erro: 'Erro interno' });
  }
});

// TEMPO DE ESTUDO - total de minutos e número de sessões agrupados por assunto
app.get('/api/tempo/:usuarioId', async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT assunto, SUM(duracao_minutos) as total_minutos, COUNT(*) as sessoes,
       MIN(inicio) as primeira_sessao, MAX(fim) as ultima_sessao
       FROM sessoes_estudo WHERE usuario_id = ?
       GROUP BY assunto ORDER BY total_minutos DESC`,
      [req.params.usuarioId]
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ erro: 'Erro interno' });
  }
});

// INICIAR SESSÃO - registra o início de uma sessão de estudo
app.post('/api/sessao/iniciar', async (req, res) => {
  const { usuario_id, assunto } = req.body;
  try {
    const [result] = await db.execute(
      'INSERT INTO sessoes_estudo (usuario_id, assunto, inicio) VALUES (?, ?, NOW())',
      [usuario_id, assunto]
    );
    res.json({ id: result.insertId }); // Retorna o ID da sessão criada
  } catch (e) {
    res.status(500).json({ erro: 'Erro interno' });
  }
});

// FINALIZAR SESSÃO - registra o fim e calcula a duração em minutos
app.put('/api/sessao/finalizar/:id', async (req, res) => {
  try {
    await db.execute(
      `UPDATE sessoes_estudo SET fim = NOW(),
       duracao_minutos = TIMESTAMPDIFF(MINUTE, inicio, NOW())
       WHERE id = ?`,
      [req.params.id]
    );
    res.json({ sucesso: true });
  } catch (e) {
    res.status(500).json({ erro: 'Erro interno' });
  }
});

// Conecta ao banco e inicia o servidor na porta definida (padrão: 3001)
conectar().then(() => {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));
});
