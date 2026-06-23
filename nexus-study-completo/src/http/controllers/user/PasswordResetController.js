import PostgresUserRepository from '../../../repositories/PostgresUserRepository.js';
import PasswordResetService from '../../services/user/PasswordResetService.js';

export async function RequestPasswordResetController(req, res) {
  try {
    const repository = new PostgresUserRepository();
    const service = new PasswordResetService(repository);
    const result = await service.requestReset(req.body.email);
    return res.json(result);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

export async function ResetPasswordController(req, res) {
  try {
    const repository = new PostgresUserRepository();
    const service = new PasswordResetService(repository);
    const result = await service.resetPassword(req.body.token, req.body.newPassword);
    return res.json(result);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}
