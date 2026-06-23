import { pool } from "../database/pg.js";

class PostgresUserRepository {

	async create(data) {
		const { name, email, password } = data;
		const result = await pool.query(
			`INSERT INTO users (name, email, password)
			 VALUES ($1,$2,$3)
			 RETURNING id, name, email, avatar_url, created_at`,
			[name, email, password]
		);
		return result.rows[0];
	}

	async findByEmail(email) {
		const result = await pool.query(
			`SELECT id, name, email, password, avatar_url, created_at
			 FROM users WHERE email = $1`,
			[email]
		);
		return result.rows[0];
	}

	async findById(id) {
		const result = await pool.query(
			`SELECT id, name, email, avatar_url, created_at
			 FROM users WHERE id = $1`,
			[id]
		);
		return result.rows[0];
	}

	async updateProfile(userId, { name, avatar_url, password }) {
		const fields = [];
		const params = [];
		let idx = 1;

		if (name !== undefined) {
			fields.push(`name = $${idx++}`);
			params.push(name);
		}
		if (avatar_url !== undefined) {
			fields.push(`avatar_url = $${idx++}`);
			params.push(avatar_url);
		}
		if (password !== undefined) {
			fields.push(`password = $${idx++}`);
			params.push(password);
		}

		if (fields.length === 0) {
			return this.findById(userId);
		}

		params.push(userId);
		const result = await pool.query(
			`UPDATE users SET ${fields.join(', ')}
			 WHERE id = $${idx}
			 RETURNING id, name, email, avatar_url, created_at`,
			params
		);
		return result.rows[0];
	}

	async getDashboard(userId, { discipline, period } = {}) {
		const conditions = ["user_id = $1"];
		const params = [userId];
		let idx = 2;

		if (discipline) {
			conditions.push(`discipline = $${idx++}`);
			params.push(discipline);
		}

		if (period && period !== "all") {
			const intervals = { "7d": "7 days", "30d": "30 days", "90d": "90 days" };
			const interval = intervals[period];
			if (interval) {
				conditions.push(`evaluated_at >= CURRENT_DATE - INTERVAL '${interval}'`);
			}
		}

		const where = conditions.join(" AND ");

		const result = await pool.query(
			`SELECT
				COALESCE(SUM(correct), 0)          AS total_correct,
				COALESCE(SUM(wrong), 0)             AS total_wrong,
				COALESCE(SUM(to_review), 0)         AS total_review,
				COALESCE(SUM(total_questions), 0)   AS total_questions
			 FROM results
			 WHERE ${where}`,
			params
		);

		// sessions filter: only discipline (period not tracked at session level by date here)
		const sessionConditions = ["user_id = $1"];
		const sessionParams = [userId];
		let sidx = 2;
		if (discipline) {
			sessionConditions.push(`discipline = $${sidx++}`);
			sessionParams.push(discipline);
		}

		const sessions = await pool.query(
			`SELECT
				COUNT(*) AS total_sessions,
				COALESCE(SUM(duration_minutes), 0) AS total_minutes
			 FROM study_sessions
			 WHERE ${sessionConditions.join(" AND ")}`,
			sessionParams
		);

		return {
			...result.rows[0],
			...sessions.rows[0],
		};
	}

	async getWeeklyEvolution(userId, { discipline, period } = {}) {
		const conditions = ["user_id = $1"];
		const params = [userId];
		let idx = 2;

		if (discipline) {
			conditions.push(`discipline = $${idx++}`);
			params.push(discipline);
		}

		const intervals = { "7d": "7 days", "30d": "30 days", "90d": "90 days" };
		const interval = intervals[period] || "7 days";
		conditions.push(`evaluated_at >= CURRENT_DATE - INTERVAL '${interval}'`);

		const where = conditions.join(" AND ");

		const result = await pool.query(
			`SELECT
				evaluated_at,
				SUM(correct)    AS correct,
				SUM(wrong)      AS wrong,
				SUM(to_review)  AS review
			 FROM results
			 WHERE ${where}
			 GROUP BY evaluated_at
			 ORDER BY evaluated_at ASC`,
			params
		);

		return result.rows;
	}

	async getDisciplines(userId) {
		const result = await pool.query(
			`SELECT DISTINCT discipline
			 FROM results
			 WHERE user_id = $1
			 ORDER BY discipline ASC`,
			[userId]
		);
		return result.rows.map(r => r.discipline);
	}

	async createResetToken(userId, token) {
		const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 minutos de validade
		const result = await pool.query(
			`INSERT INTO password_reset_tokens (user_id, token, expires_at)
			 VALUES ($1, $2, $3)
			 RETURNING id, user_id, token, expires_at`,
			[userId, token, expiresAt]
		);
		return result.rows[0];
	}

	async findResetToken(token) {
		const result = await pool.query(
			`SELECT id, user_id, token, used, expires_at
			 FROM password_reset_tokens
			 WHERE token = $1`,
			[token]
		);
		return result.rows[0];
	}

	async invalidateResetToken(token) {
		await pool.query(
			`UPDATE password_reset_tokens
			 SET used = TRUE
			 WHERE token = $1`,
			[token]
		);
	}

	async updatePassword(userId, hashedPassword) {
		await pool.query(
			`UPDATE users
			 SET password = $1
			 WHERE id = $2`,
			[hashedPassword, userId]
		);
	}

	async createStudySession({ user_id, discipline, duration_minutes }) {
		await pool.query(
			`INSERT INTO study_sessions (user_id, discipline, started_at, ended_at, duration_minutes)
			 VALUES ($1, $2, NOW() - ($3 || ' minutes')::INTERVAL, NOW(), $3)`,
			[user_id, discipline, duration_minutes]
		);
	}
}

export default PostgresUserRepository;
