import PostgresUserRepository from '../../../repositories/PostgresUserRepository.js';

const repo = new PostgresUserRepository();

export async function CreateStudySessionController(req, res) {
  try {
    const { id } = req.params;
    const { discipline, duration_minutes } = req.body;

    if (!discipline || !duration_minutes) {
      return res.status(400).json({ error: 'Dados obrigatórios ausentes' });
    }

    await repo.createStudySession({ user_id: id, discipline, duration_minutes });
    return res.status(201).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
