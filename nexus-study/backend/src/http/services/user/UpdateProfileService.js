import bcrypt from 'bcryptjs';

class UpdateProfileService {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(userId, data) {
    const { name, avatar_url, currentPassword, newPassword } = data;

    if (!name && avatar_url === undefined && !newPassword) {
      throw new Error('Nenhum dado para atualizar');
    }

    const user = await this.repository.findById(userId);
    if (!user) throw new Error('Usuário não encontrado');

    let hashedNewPassword;

    // Se quer trocar senha, valida a senha atual com bcrypt
    if (newPassword) {
      if (!currentPassword) {
        throw new Error('Senha atual é obrigatória para alterar a senha');
      }

      const full = await this.repository.findByEmail(user.email);
      const passwordMatch = await bcrypt.compare(currentPassword, full.password);

      if (!passwordMatch) {
        throw new Error('Senha atual incorreta');
      }
      if (newPassword.length < 6) {
        throw new Error('A nova senha deve ter pelo menos 6 caracteres');
      }

      hashedNewPassword = await bcrypt.hash(newPassword, 12);
    }

    // Validação básica de tamanho para imagem base64 (limite de ~2MB)
    if (avatar_url && avatar_url.length > 2_800_000) {
      throw new Error('Imagem muito grande. Escolha uma foto de até 2MB.');
    }

    const updated = await this.repository.updateProfile(userId, {
      name: name !== undefined ? name : undefined,
      avatar_url: avatar_url !== undefined ? avatar_url : undefined,
      password: hashedNewPassword,
    });

    return updated;
  }
}

export default UpdateProfileService;
