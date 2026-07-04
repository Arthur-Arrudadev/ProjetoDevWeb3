import bcrypt from 'bcryptjs';
import { pool } from '../../../database/pg.js';

export async function CheckHashController(req, res) {
  try {
    // Verifica se todos os usuários têm senha hasheada (bcrypt começa com $2b$ ou $2a$)
    const result = await pool.query(
      `SELECT id, email, 
        CASE 
          WHEN password LIKE '$2b$%' OR password LIKE '$2a$%' THEN true 
          ELSE false 
        END AS is_hashed,
        LENGTH(password) AS pwd_length
       FROM users
       ORDER BY created_at DESC`
    );

    const users = result.rows;
    const totalUsers = users.length;
    const hashedCount = users.filter(u => u.is_hashed).length;
    const notHashedCount = totalUsers - hashedCount;

    return res.json({
      status: notHashedCount === 0 ? 'secure' : 'warning',
      summary: {
        total_users: totalUsers,
        hashed_passwords: hashedCount,
        plain_text_passwords: notHashedCount,
        security_percentage: totalUsers > 0 ? Math.round((hashedCount / totalUsers) * 100) : 100,
      },
      details: users.map(u => ({
        id: u.id,
        email: u.email,
        is_hashed: u.is_hashed,
        pwd_length: u.pwd_length,
      })),
      bcrypt_info: {
        algorithm: 'bcrypt',
        library: 'bcryptjs',
        salt_rounds: 12,
        hash_prefix: '$2b$12$',
      },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
