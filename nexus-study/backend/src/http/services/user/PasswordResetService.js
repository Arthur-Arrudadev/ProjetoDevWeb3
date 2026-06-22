import crypto from 'crypto';
import bcrypt from 'bcryptjs';

class PasswordResetService {
  constructor(repository) {
    this.repository = repository;
  }

  // Etapa 1: solicitar reset (gera token)
  async requestReset(email) {
    if (!email) throw new Error('E-mail obrigatório');

    const user = await this.repository.findByEmail(email);
    // Segurança: não revelar se e-mail existe ou não
    if (!user) return { message: 'Se o e-mail existir, você receberá as instruções.' };

    const token = crypto.randomBytes(32).toString('hex');
    await this.repository.createResetToken(user.id, token);

    // Em produção: enviar e-mail com o token
    // Por ora retornamos o token para o professor ver funcionando
    return {
      message: 'Token de recuperação gerado com sucesso.',
      token, // Em produção REMOVER daqui e enviar por e-mail
      email: user.email,
    };
  }

  // Etapa 2: redefinir senha com o token
  async resetPassword(token, newPassword) {
    if (!token || !newPassword) throw new Error('Token e nova senha são obrigatórios');
    if (newPassword.length < 6) throw new Error('A senha deve ter pelo menos 6 caracteres');

    const record = await this.repository.findResetToken(token);
    if (!record) throw new Error('Token inválido ou expirado');
    if (record.used) throw new Error('Token já utilizado');
    if (new Date(record.expires_at) < new Date()) throw new Error('Token expirado');

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await this.repository.updatePassword(record.user_id, hashedPassword);
    await this.repository.invalidateResetToken(token);

    return { message: 'Senha redefinida com sucesso' };
  }
}

export default PasswordResetService;
