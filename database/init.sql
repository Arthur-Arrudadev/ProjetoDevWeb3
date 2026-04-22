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

-- =====================
-- QUESTÕES DO QUIZ
-- =====================
CREATE TABLE IF NOT EXISTS questoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  materia VARCHAR(80) NOT NULL,
  enunciado TEXT NOT NULL,
  alternativa_a VARCHAR(300) NOT NULL,
  alternativa_b VARCHAR(300) NOT NULL,
  alternativa_c VARCHAR(300) NOT NULL,
  alternativa_d VARCHAR(300) NOT NULL,
  resposta_correta CHAR(1) NOT NULL
);

INSERT IGNORE INTO questoes (id, materia, enunciado, alternativa_a, alternativa_b, alternativa_c, alternativa_d, resposta_correta) VALUES
(1,  'Matemática', 'Qual é o valor de 2³ + 3²?', '13', '17', '15', '19', 'b'),
(2,  'Matemática', 'A raiz quadrada de 144 é:', '11', '12', '13', '14', 'b'),
(3,  'Matemática', 'Qual é o resultado de 15% de 200?', '25', '30', '35', '20', 'b'),
(4,  'Matemática', 'Se f(x) = 2x + 3, qual é f(4)?', '10', '11', '12', '9', 'b'),
(5,  'Matemática', 'Quantos graus tem a soma dos ângulos internos de um triângulo?', '90°', '180°', '270°', '360°', 'b'),
(6,  'Matemática', 'Qual é o MMC de 4 e 6?', '8', '12', '24', '6', 'b'),
(7,  'Matemática', 'O logaritmo de 1000 na base 10 é:', '2', '3', '4', '1', 'b'),
(8,  'Matemática', 'Numa PA com a1=2 e r=3, qual é o 5º termo?', '12', '14', '16', '10', 'b'),
(9,  'Matemática', 'Qual é a área de um círculo com raio 5? (π≈3,14)', '78,5', '31,4', '62,8', '157', 'a'),
(10, 'Matemática', 'Quantas soluções reais tem x² + 1 = 0?', '1', '2', '0', 'Infinitas', 'c'),
(11, 'Português', 'Qual classe gramatical é a palavra "rapidamente"?', 'Adjetivo', 'Advérbio', 'Substantivo', 'Verbo', 'b'),
(12, 'Português', 'Em "O menino correu", o sujeito é:', 'correu', 'O menino', 'O', 'menino correu', 'b'),
(13, 'Português', 'Qual alternativa usa a crase corretamente?', 'Fui à escola', 'Fui a escola', 'Fui à ele', 'Fui à Paris', 'a'),
(14, 'Português', '"Ele chegou cedo" — o tempo verbal é:', 'Presente', 'Pretérito perfeito', 'Futuro', 'Pretérito imperfeito', 'b'),
(15, 'Português', 'Qual figura de linguagem está em "O tempo é dinheiro"?', 'Hipérbole', 'Metáfora', 'Ironia', 'Metonímia', 'b'),
(16, 'Português', 'Qual é o plural de "cidadão"?', 'Cidadões', 'Cidadãos', 'Cidadões ou cidadãos', 'Cidadãs', 'b'),
(17, 'Português', 'A vírgula é obrigatória em:', 'Sujeito e predicado', 'Aposto explicativo', 'Objeto direto', 'Predicativo', 'b'),
(18, 'Português', '"Que livro lindo!" é uma frase:', 'Declarativa', 'Exclamativa', 'Interrogativa', 'Imperativa', 'b'),
(19, 'Português', 'Qual palavra é um substantivo coletivo?', 'Bando', 'Correr', 'Belo', 'Rapidamente', 'a'),
(20, 'Português', 'O prefixo "in-" em "infeliz" indica:', 'Repetição', 'Negação', 'Intensidade', 'Lugar', 'b'),
(21, 'História', 'Em que ano o Brasil foi descoberto pelos portugueses?', '1498', '1500', '1502', '1510', 'b'),
(22, 'História', 'Quem proclamou a República no Brasil?', 'Dom Pedro I', 'Dom Pedro II', 'Deodoro da Fonseca', 'Getúlio Vargas', 'c'),
(23, 'História', 'A Revolução Francesa ocorreu em:', '1776', '1789', '1799', '1804', 'b'),
(24, 'História', 'O Estado Novo de Vargas durou de:', '1930 a 1937', '1937 a 1945', '1945 a 1950', '1930 a 1945', 'b'),
(25, 'História', 'A Segunda Guerra Mundial terminou em:', '1943', '1944', '1945', '1946', 'c'),
(26, 'História', 'O AI-5 foi decretado em:', '1964', '1968', '1970', '1972', 'b'),
(27, 'História', 'A Guerra Fria foi uma disputa entre:', 'EUA e China', 'EUA e URSS', 'URSS e Europa', 'EUA e Alemanha', 'b'),
(28, 'História', 'A Revolução Industrial começou em:', 'França', 'Alemanha', 'Inglaterra', 'EUA', 'c'),
(29, 'História', 'Quem foi o líder da Revolução Cubana?', 'Che Guevara', 'Fidel Castro', 'Batista', 'Allende', 'b'),
(30, 'História', 'O Tratado de Versalhes encerrou:', 'A Guerra Fria', 'A 1ª Guerra Mundial', 'A 2ª Guerra Mundial', 'A Guerra do Vietnã', 'b'),
(31, 'Física', 'A 1ª Lei de Newton é conhecida como:', 'Lei da Ação e Reação', 'Lei da Inércia', 'Lei da Gravitação', 'Princípio da Conservação', 'b'),
(32, 'Física', 'A unidade de força no SI é:', 'Joule', 'Newton', 'Pascal', 'Watt', 'b'),
(33, 'Física', 'Qual é a velocidade da luz no vácuo?', '300 km/s', '300.000 km/s', '3.000 km/s', '30.000 km/s', 'b'),
(34, 'Física', 'O que mede o amperímetro?', 'Tensão', 'Corrente elétrica', 'Resistência', 'Potência', 'b'),
(35, 'Física', 'Na queda livre, a aceleração é de aproximadamente:', '8 m/s²', '9,8 m/s²', '10,8 m/s²', '11 m/s²', 'b'),
(36, 'Física', 'O efeito Doppler está relacionado a:', 'Luz', 'Som', 'Ambos', 'Calor', 'c'),
(37, 'Física', 'A lei de Ohm relaciona:', 'Força e massa', 'Tensão, corrente e resistência', 'Calor e temperatura', 'Pressão e volume', 'b'),
(38, 'Física', 'Qual fenômeno explica o arco-íris?', 'Reflexão', 'Refração e dispersão', 'Difração', 'Interferência', 'b'),
(39, 'Física', 'A unidade de energia no SI é:', 'Newton', 'Watt', 'Joule', 'Pascal', 'c'),
(40, 'Física', 'O princípio de Arquimedes trata de:', 'Gravitação', 'Empuxo', 'Inércia', 'Pressão atmosférica', 'b'),
(41, 'Química', 'Qual é o símbolo do ouro na tabela periódica?', 'Go', 'Ou', 'Au', 'Or', 'c'),
(42, 'Química', 'O número atômico do carbono é:', '5', '6', '7', '8', 'b'),
(43, 'Química', 'Ligação entre metal e não-metal é chamada de:', 'Covalente', 'Metálica', 'Iônica', 'Dativa', 'c'),
(44, 'Química', 'pH 7 indica solução:', 'Ácida', 'Básica', 'Neutra', 'Tampão', 'c'),
(45, 'Química', 'A fórmula da água é:', 'H₂O₂', 'HO', 'H₂O', 'H₃O', 'c'),
(46, 'Química', 'Qual gás é produzido na fotossíntese?', 'CO₂', 'N₂', 'O₂', 'H₂', 'c'),
(47, 'Química', 'O mol é a unidade de:', 'Massa', 'Volume', 'Quantidade de matéria', 'Temperatura', 'c'),
(48, 'Química', 'Reação que libera calor é chamada de:', 'Endotérmica', 'Exotérmica', 'Neutra', 'Catalítica', 'b'),
(49, 'Química', 'Qual é o principal componente do gás natural?', 'Etano', 'Propano', 'Metano', 'Butano', 'c'),
(50, 'Química', 'A eletrólise é usada para:', 'Medir pH', 'Decompor substâncias com eletricidade', 'Medir temperatura', 'Calcular mol', 'b'),
(51, 'Biologia', 'Qual organela é responsável pela respiração celular?', 'Ribossomo', 'Mitocôndria', 'Núcleo', 'Vacúolo', 'b'),
(52, 'Biologia', 'O DNA está localizado principalmente no:', 'Citoplasma', 'Ribossomo', 'Núcleo', 'Mitocôndria', 'c'),
(53, 'Biologia', 'A 1ª Lei de Mendel é chamada de:', 'Lei da Segregação', 'Lei da Dominância', 'Lei da Independência', 'Lei da Herança', 'a'),
(54, 'Biologia', 'Qual processo produz gametas?', 'Mitose', 'Meiose', 'Fissão', 'Brotamento', 'b'),
(55, 'Biologia', 'A fotossíntese ocorre nos:', 'Mitocôndrias', 'Ribossomos', 'Cloroplastos', 'Vacúolos', 'c'),
(56, 'Biologia', 'Vírus são considerados:', 'Seres vivos completos', 'Células procariontes', 'Acelulares', 'Fungos', 'c'),
(57, 'Biologia', 'A teoria da evolução foi proposta por:', 'Lamarck', 'Darwin', 'Mendel', 'Pasteur', 'b'),
(58, 'Biologia', 'Qual sistema é responsável pela troca de gases?', 'Digestório', 'Circulatório', 'Respiratório', 'Nervoso', 'c'),
(59, 'Biologia', 'O bioma com maior biodiversidade do Brasil é:', 'Cerrado', 'Caatinga', 'Amazônia', 'Mata Atlântica', 'c'),
(60, 'Biologia', 'Bactérias são organismos:', 'Eucariontes', 'Procariontes', 'Acelulares', 'Multicelulares', 'b');

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
