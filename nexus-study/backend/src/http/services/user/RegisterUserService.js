import bcrypt from 'bcryptjs';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

class RegisterUserService {

	constructor(repository) {
		this.repository = repository;
	}

	async execute(data) {

		const {
			name,
			email,
			password
		} = data;

		if (
			!name ||
			!email ||
			!password
		) {
			throw new Error(
				"Dados obrigatórios ausentes"
			);
		}

		if (!EMAIL_REGEX.test(email)) {
			throw new Error(
				"E-mail inválido"
			);
		}

		const userExists =
			await this.repository.findByEmail(
				email
			);

		if (userExists) {
			throw new Error(
				"Usuário já existe"
			);
		}

		const saltRounds = 12;
		const hashedPassword = await bcrypt.hash(password, saltRounds);

		const user =
			await this.repository.create({
				name,
				email,
				password: hashedPassword
			});

		return user;
	}
}

export default RegisterUserService;
