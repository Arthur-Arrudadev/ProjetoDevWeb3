import bcrypt from 'bcryptjs';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

class AuthUserService {

	constructor(repository) {
		this.repository = repository;
	}

	async execute(data) {

		const {
			email,
			password
		} = data;

		if (
			!email ||
			!password
		) {
			throw new Error(
				"Email e senha são obrigatórios"
			);
		}

		if (!EMAIL_REGEX.test(email)) {
			throw new Error(
				"E-mail inválido"
			);
		}

		const user =
			await this.repository.findByEmail(
				email
			);

		if (!user) {
			throw new Error(
				"Usuário não encontrado"
			);
		}

		const passwordMatch = await bcrypt.compare(password, user.password);

		if (!passwordMatch) {
			throw new Error(
				"Senha incorreta"
			);
		}

		return {
			id: user.id,
			name: user.name,
			email: user.email,
			avatar_url: user.avatar_url,
			created_at: user.created_at
		};
	}
}

export default AuthUserService;
