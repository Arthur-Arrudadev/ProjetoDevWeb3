import PostgresUserRepository from '../../../repositories/PostgresUserRepository.js';
import DetailedReportService from '../../services/user/DetailedReportService.js';

export async function DetailedReportController(req, res) {
  try {
    const { id } = req.params;
    const { period } = req.query;
    const repository = new PostgresUserRepository();
    const service = new DetailedReportService(repository);
    const result = await service.execute(id, { period });
    return res.json(result);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}
