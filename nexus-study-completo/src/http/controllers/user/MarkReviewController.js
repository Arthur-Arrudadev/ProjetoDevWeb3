import PostgresQuestionRepository from '../../../repositories/PostgresQuestionRepository.js';

const repo = new PostgresQuestionRepository();

export async function MarkReviewController(req, res) {
  try {
    const { id } = req.params;
    const { user_id, discipline } = req.body;

    if (!user_id || !discipline) {
      return res.status(400).json({ error: 'Dados obrigatórios ausentes' });
    }

    await repo.markReview({ user_id, question_id: id, discipline });
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
