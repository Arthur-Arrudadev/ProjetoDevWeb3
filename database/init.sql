CREATE DATABASE IF NOT EXISTS sistema_estudo;
USE sistema_estudo;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario VARCHAR(50) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  nome VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS materiais (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(150) NOT NULL,
  categoria VARCHAR(80) NOT NULL,
  url VARCHAR(500) NOT NULL,
  descricao TEXT
);

CREATE TABLE IF NOT EXISTS sessoes_estudo (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  assunto VARCHAR(150) NOT NULL,
  inicio DATETIME NOT NULL,
  fim DATETIME,
  duracao_minutos INT DEFAULT 0,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS resultados (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  assunto VARCHAR(150) NOT NULL,
  total_questoes INT DEFAULT 0,
  acertos INT DEFAULT 0,
  erros INT DEFAULT 0,
  revisao INT DEFAULT 0,
  data_avaliacao DATE NOT NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

INSERT IGNORE INTO usuarios (usuario, senha, nome) VALUES ('geral', 'entrar', 'Usuário Geral');

-- =====================
-- MATEMÁTICA
-- =====================
INSERT IGNORE INTO materiais (titulo, categoria, url, descricao) VALUES
('Matemática Básica - Khan Academy', 'Matemática', 'https://pt.khanacademy.org/math/cc-sixth-grade-math', 'Fundamentos de matemática: frações, decimais, porcentagem e mais'),
('Álgebra Completa - Khan Academy', 'Matemática', 'https://pt.khanacademy.org/math/algebra', 'Equações, inequações, funções e expressões algébricas'),
('Geometria Plana - Brasil Escola', 'Matemática', 'https://brasilescola.uol.com.br/matematica/geometria-plana.htm', 'Áreas, perímetros, triângulos, círculos e polígonos'),
('Trigonometria - Stoodi', 'Matemática', 'https://www.stoodi.com.br/blog/matematica/trigonometria/', 'Seno, cosseno, tangente e relações trigonométricas'),
('Estatística e Probabilidade - Khan Academy', 'Matemática', 'https://pt.khanacademy.org/math/statistics-probability', 'Média, mediana, moda, desvio padrão e probabilidade'),
('Funções do 1º e 2º Grau - Descomplica', 'Matemática', 'https://descomplica.com.br/artigo/funcoes/', 'Funções lineares, quadráticas e suas representações gráficas'),
('Progressões Aritméticas e Geométricas - Brasil Escola', 'Matemática', 'https://brasilescola.uol.com.br/matematica/progressoes.htm', 'PA, PG, fórmulas e exercícios resolvidos'),
('Matrizes e Determinantes - Stoodi', 'Matemática', 'https://www.stoodi.com.br/blog/matematica/matrizes/', 'Operações com matrizes, determinantes e sistemas lineares'),
('Logaritmos - Khan Academy', 'Matemática', 'https://pt.khanacademy.org/math/algebra2/x2ec2f6f830c9fb89:logs', 'Propriedades dos logaritmos e equações logarítmicas'),
('Geometria Espacial - Brasil Escola', 'Matemática', 'https://brasilescola.uol.com.br/matematica/geometria-espacial.htm', 'Volumes e áreas de sólidos geométricos');

-- =====================
-- PORTUGUÊS
-- =====================
INSERT IGNORE INTO materiais (titulo, categoria, url, descricao) VALUES
('Gramática Portuguesa Completa - Brasil Escola', 'Português', 'https://brasilescola.uol.com.br/gramatica', 'Classes gramaticais, sintaxe, morfologia e ortografia'),
('Interpretação de Texto - Stoodi', 'Português', 'https://www.stoodi.com.br/blog/portugues/interpretacao-de-texto/', 'Técnicas para interpretar textos dissertativos e literários'),
('Redação ENEM - Descomplica', 'Português', 'https://descomplica.com.br/artigo/redacao-enem/', 'Estrutura da redação, competências e temas recorrentes'),
('Concordância Verbal e Nominal - Brasil Escola', 'Português', 'https://brasilescola.uol.com.br/gramatica/concordancia.htm', 'Regras de concordância com exemplos e exercícios'),
('Crase - Toda Matéria', 'Português', 'https://www.todamateria.com.br/crase/', 'Quando usar e quando não usar a crase'),
('Literatura Brasileira - Brasil Escola', 'Português', 'https://brasilescola.uol.com.br/literatura', 'Modernismo, Romantismo, Realismo e principais autores'),
('Figuras de Linguagem - Stoodi', 'Português', 'https://www.stoodi.com.br/blog/portugues/figuras-de-linguagem/', 'Metáfora, metonímia, hipérbole, ironia e outras figuras'),
('Pontuação - Toda Matéria', 'Português', 'https://www.todamateria.com.br/pontuacao/', 'Uso correto de vírgula, ponto e vírgula, dois pontos e mais');

-- =====================
-- HISTÓRIA
-- =====================
INSERT IGNORE INTO materiais (titulo, categoria, url, descricao) VALUES
('História do Brasil Colônia - Brasil Escola', 'História', 'https://brasilescola.uol.com.br/historiab/brasil-colonia.htm', 'Descobrimento, capitanias hereditárias e ciclos econômicos'),
('República Velha - Toda Matéria', 'História', 'https://www.todamateria.com.br/republica-velha/', 'Política do café com leite, coronelismo e oligarquias'),
('Segunda Guerra Mundial - Khan Academy', 'História', 'https://pt.khanacademy.org/humanities/world-history/euro-hist/wwii-causes/a/the-causes-of-world-war-ii', 'Causas, desenvolvimento e consequências da 2ª Guerra'),
('Revolução Industrial - Brasil Escola', 'História', 'https://brasilescola.uol.com.br/historiag/revolucao-industrial.htm', 'Primeira e segunda revolução industrial e impactos sociais'),
('Era Vargas - Stoodi', 'História', 'https://www.stoodi.com.br/blog/historia/era-vargas/', 'Governo Vargas, Estado Novo e trabalhismo no Brasil'),
('Guerra Fria - Toda Matéria', 'História', 'https://www.todamateria.com.br/guerra-fria/', 'Disputa EUA x URSS, corrida armamentista e espacial'),
('Ditadura Militar no Brasil - Brasil Escola', 'História', 'https://brasilescola.uol.com.br/historiab/ditadura-militar-no-brasil.htm', 'Golpe de 1964, AI-5 e redemocratização'),
('Revolução Francesa - Khan Academy', 'História', 'https://pt.khanacademy.org/humanities/world-history/euro-hist/french-rev-tutorial/a/the-french-revolution', 'Causas, fases e legado da Revolução Francesa');

-- =====================
-- FÍSICA
-- =====================
INSERT IGNORE INTO materiais (titulo, categoria, url, descricao) VALUES
('Cinemática - Brasil Escola', 'Física', 'https://brasilescola.uol.com.br/fisica/cinematica.htm', 'MRU, MRUV, queda livre e lançamento de projéteis'),
('Dinâmica - Leis de Newton - Stoodi', 'Física', 'https://www.stoodi.com.br/blog/fisica/leis-de-newton/', 'As três leis de Newton com exemplos e exercícios'),
('Termodinâmica - Brasil Escola', 'Física', 'https://brasilescola.uol.com.br/fisica/termodinamica.htm', 'Temperatura, calor, leis da termodinâmica e máquinas térmicas'),
('Eletrostática - Toda Matéria', 'Física', 'https://www.todamateria.com.br/eletrostatica/', 'Cargas elétricas, lei de Coulomb e campo elétrico'),
('Óptica Geométrica - Khan Academy', 'Física', 'https://pt.khanacademy.org/science/physics/geometric-optics', 'Reflexão, refração, lentes e espelhos'),
('Ondas e Som - Brasil Escola', 'Física', 'https://brasilescola.uol.com.br/fisica/ondas.htm', 'Propriedades das ondas, som e efeito Doppler'),
('Eletromagnetismo - Stoodi', 'Física', 'https://www.stoodi.com.br/blog/fisica/eletromagnetismo/', 'Campo magnético, indução eletromagnética e corrente elétrica'),
('Física Moderna - Descomplica', 'Física', 'https://descomplica.com.br/artigo/fisica-moderna/', 'Relatividade, efeito fotoelétrico e física quântica');

-- =====================
-- QUÍMICA
-- =====================
INSERT IGNORE INTO materiais (titulo, categoria, url, descricao) VALUES
('Tabela Periódica - Brasil Escola', 'Química', 'https://brasilescola.uol.com.br/quimica/tabela-periodica.htm', 'Elementos, grupos, períodos e propriedades periódicas'),
('Ligações Químicas - Toda Matéria', 'Química', 'https://www.todamateria.com.br/ligacoes-quimicas/', 'Ligação iônica, covalente e metálica'),
('Química Orgânica - Brasil Escola', 'Química', 'https://brasilescola.uol.com.br/quimica/quimica-organica.htm', 'Hidrocarbonetos, funções orgânicas e reações'),
('Estequiometria - Stoodi', 'Química', 'https://www.stoodi.com.br/blog/quimica/estequiometria/', 'Cálculos estequiométricos, mol e massa molar'),
('Soluções e Concentração - Toda Matéria', 'Química', 'https://www.todamateria.com.br/solucoes-quimicas/', 'Soluto, solvente, concentração molar e título'),
('Eletroquímica - Brasil Escola', 'Química', 'https://brasilescola.uol.com.br/quimica/eletroquimica.htm', 'Pilhas, eletrólise e potencial de redução'),
('Termoquímica - Descomplica', 'Química', 'https://descomplica.com.br/artigo/termoquimica/', 'Entalpia, reações exotérmicas e endotérmicas');

-- =====================
-- BIOLOGIA
-- =====================
INSERT IGNORE INTO materiais (titulo, categoria, url, descricao) VALUES
('Biologia Celular - Brasil Escola', 'Biologia', 'https://brasilescola.uol.com.br/biologia/celula.htm', 'Estrutura celular, organelas e divisão celular'),
('Genética - Khan Academy', 'Biologia', 'https://pt.khanacademy.org/science/ap-biology/heredity', 'Leis de Mendel, herança genética e mutações'),
('Evolução - Toda Matéria', 'Biologia', 'https://www.todamateria.com.br/evolucao/', 'Darwin, seleção natural e teorias evolutivas'),
('Ecologia - Brasil Escola', 'Biologia', 'https://brasilescola.uol.com.br/biologia/ecologia.htm', 'Ecossistemas, cadeias alimentares e ciclos biogeoquímicos'),
('Fisiologia Humana - Stoodi', 'Biologia', 'https://www.stoodi.com.br/blog/biologia/fisiologia-humana/', 'Sistemas digestório, circulatório, respiratório e nervoso'),
('Botânica - Brasil Escola', 'Biologia', 'https://brasilescola.uol.com.br/biologia/botanica.htm', 'Classificação das plantas, fotossíntese e reprodução vegetal'),
('Microbiologia - Toda Matéria', 'Biologia', 'https://www.todamateria.com.br/microbiologia/', 'Vírus, bactérias, fungos e protozoários');

-- =====================
-- GEOGRAFIA
-- =====================
INSERT IGNORE INTO materiais (titulo, categoria, url, descricao) VALUES
('Geopolítica Mundial - Brasil Escola', 'Geografia', 'https://brasilescola.uol.com.br/geografia/geopolitica.htm', 'Blocos econômicos, conflitos e relações internacionais'),
('Climatologia - Toda Matéria', 'Geografia', 'https://www.todamateria.com.br/climatologia/', 'Climas do Brasil e do mundo, fenômenos climáticos'),
('Cartografia - Brasil Escola', 'Geografia', 'https://brasilescola.uol.com.br/geografia/cartografia.htm', 'Mapas, escalas, projeções cartográficas e coordenadas'),
('Urbanização Brasileira - Stoodi', 'Geografia', 'https://www.stoodi.com.br/blog/geografia/urbanizacao-brasileira/', 'Crescimento das cidades, metropolização e problemas urbanos'),
('Biomas Brasileiros - Toda Matéria', 'Geografia', 'https://www.todamateria.com.br/biomas-brasileiros/', 'Amazônia, Cerrado, Caatinga, Mata Atlântica e Pantanal'),
('Globalização - Brasil Escola', 'Geografia', 'https://brasilescola.uol.com.br/geografia/globalizacao.htm', 'Impactos econômicos, culturais e ambientais da globalização');

-- =====================
-- INGLÊS
-- =====================
INSERT IGNORE INTO materiais (titulo, categoria, url, descricao) VALUES
('Gramática Inglesa - British Council', 'Inglês', 'https://learnenglish.britishcouncil.org/grammar', 'Gramática completa com exercícios interativos'),
('Tempos Verbais - Khan Academy', 'Inglês', 'https://www.khanacademy.org/humanities/grammar/partsofspeech/grammar-verbs', 'Present, past, future e tempos compostos em inglês'),
('Vocabulário ENEM - Stoodi', 'Inglês', 'https://www.stoodi.com.br/blog/ingles/vocabulario-ingles-enem/', 'Palavras e expressões mais cobradas no ENEM'),
('Inglês para Iniciantes - Duolingo', 'Inglês', 'https://www.duolingo.com/course/en/pt/Learn-English', 'Curso gratuito de inglês do básico ao avançado'),
('Listening e Compreensão - BBC Learning English', 'Inglês', 'https://www.bbc.co.uk/learningenglish', 'Áudios, vídeos e exercícios de compreensão auditiva');

-- =====================
-- FILOSOFIA E SOCIOLOGIA
-- =====================
INSERT IGNORE INTO materiais (titulo, categoria, url, descricao) VALUES
('Filosofia Grega - Brasil Escola', 'Filosofia', 'https://brasilescola.uol.com.br/filosofia/filosofia-grega.htm', 'Sócrates, Platão, Aristóteles e os pré-socráticos'),
('Iluminismo - Toda Matéria', 'Filosofia', 'https://www.todamateria.com.br/iluminismo/', 'Pensadores iluministas e influência na modernidade'),
('Sociologia - Émile Durkheim - Brasil Escola', 'Sociologia', 'https://brasilescola.uol.com.br/sociologia/durkheim.htm', 'Fato social, solidariedade e divisão do trabalho'),
('Desigualdade Social - Stoodi', 'Sociologia', 'https://www.stoodi.com.br/blog/sociologia/desigualdade-social/', 'Causas, consequências e indicadores de desigualdade'),
('Cidadania e Direitos Humanos - Toda Matéria', 'Sociologia', 'https://www.todamateria.com.br/direitos-humanos/', 'Declaração Universal, direitos civis e políticos');

INSERT IGNORE INTO resultados (usuario_id, assunto, total_questoes, acertos, erros, revisao, data_avaliacao) VALUES
(1, 'Matemática', 20, 14, 4, 2, CURDATE()),
(1, 'Português', 15, 10, 3, 2, CURDATE()),
(1, 'História', 10, 6, 2, 2, CURDATE()),
(1, 'Física', 12, 5, 5, 2, CURDATE()),
(1, 'Química', 10, 4, 4, 2, CURDATE());

INSERT IGNORE INTO sessoes_estudo (usuario_id, assunto, inicio, fim, duracao_minutos) VALUES
(1, 'Matemática', DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 45 MINUTE, 45),
(1, 'Português', DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 30 MINUTE, 30),
(1, 'História', NOW() - INTERVAL 60 MINUTE, NOW(), 60);
