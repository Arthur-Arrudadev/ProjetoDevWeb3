CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Migration segura: garante a coluna avatar_url mesmo em bancos já existentes
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;


CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,

    question_index INTEGER NOT NULL,
    year INTEGER NOT NULL,

    title TEXT NOT NULL,
    discipline VARCHAR(100) NOT NULL,
    language VARCHAR(50),

    context TEXT,

    files TEXT[] DEFAULT '{}',

    correct_alternative CHAR(1) NOT NULL,

    alternatives_introduction TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (question_index, year),

    CONSTRAINT chk_correct_alternative
    CHECK (correct_alternative IN ('A', 'B', 'C', 'D', 'E'))
);

CREATE TABLE IF NOT EXISTS alternatives (
    id SERIAL PRIMARY KEY,
    question_id INTEGER NOT NULL REFERENCES questions (id) ON DELETE CASCADE,
    letter CHAR(1) NOT NULL,
    text TEXT NOT NULL,
    file TEXT,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    UNIQUE (question_id, letter),
    CONSTRAINT chk_letter CHECK (
        letter IN ('A', 'B', 'C', 'D', 'E')
    )
);

CREATE TABLE IF NOT EXISTS user_answers (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    question_id INTEGER NOT NULL REFERENCES questions (id) ON DELETE CASCADE,
    chosen_letter CHAR(1) NOT NULL,
    is_correct BOOLEAN NOT NULL,
    answered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, question_id)
);

CREATE TABLE IF NOT EXISTS study_sessions (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    discipline VARCHAR(100) NOT NULL,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    duration_minutes INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT chk_session_end CHECK (
        ended_at IS NULL
        OR ended_at > started_at
    )
);

CREATE TABLE IF NOT EXISTS results (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    discipline VARCHAR(100) NOT NULL,
    total_questions INTEGER NOT NULL DEFAULT 0,
    correct INTEGER NOT NULL DEFAULT 0,
    wrong INTEGER NOT NULL DEFAULT 0,
    to_review INTEGER NOT NULL DEFAULT 0,
    evaluated_at DATE NOT NULL DEFAULT CURRENT_DATE,
    UNIQUE (
        user_id,
        discipline,
        evaluated_at
    ),
    CONSTRAINT chk_totals CHECK (
        correct + wrong + to_review <= total_questions
    ),
    CONSTRAINT chk_total_questions CHECK (total_questions >= 0),
    CONSTRAINT chk_correct CHECK (correct >= 0),
    CONSTRAINT chk_wrong CHECK (wrong >= 0),
    CONSTRAINT chk_to_review CHECK (to_review >= 0)
);

CREATE INDEX IF NOT EXISTS idx_questions_year ON questions (year);

CREATE INDEX IF NOT EXISTS idx_questions_discipline ON questions (discipline);

CREATE INDEX IF NOT EXISTS idx_questions_year_discipline ON questions (year, discipline);

CREATE INDEX IF NOT EXISTS idx_alternatives_question ON alternatives (question_id);

CREATE INDEX IF NOT EXISTS idx_user_answers_user ON user_answers (user_id);

CREATE INDEX IF NOT EXISTS idx_user_answers_question ON user_answers (question_id);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON study_sessions (user_id);

CREATE INDEX IF NOT EXISTS idx_sessions_discipline ON study_sessions (discipline);

CREATE INDEX IF NOT EXISTS idx_sessions_started ON study_sessions (started_at);

CREATE INDEX IF NOT EXISTS idx_results_user ON results (user_id);

CREATE INDEX IF NOT EXISTS idx_results_discipline ON results (discipline);

CREATE INDEX IF NOT EXISTS idx_results_date ON results (evaluated_at);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    used BOOLEAN NOT NULL DEFAULT FALSE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reset_tokens_token ON password_reset_tokens (token);

CREATE INDEX IF NOT EXISTS idx_reset_tokens_user ON password_reset_tokens (user_id);
