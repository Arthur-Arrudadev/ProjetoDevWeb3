import PostgresUserRepository from '../../../repositories/PostgresUserRepository.js';
import UpdateProfileService from '../../services/user/UpdateProfileService.js';

export async function UpdateProfileController(req, res) {
  try {
    const { id } = req.params;
    const repository = new PostgresUserRepository();
    const service = new UpdateProfileService(repository);
    const result = await service.execute(id, req.body);
    return res.json(result);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}
