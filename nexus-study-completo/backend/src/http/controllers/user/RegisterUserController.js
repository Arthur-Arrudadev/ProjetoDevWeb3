import PostgresUserRepository
	from "../../../repositories/PostgresUserRepository.js";

import RegisterUserService
	from "../../services/user/RegisterUserService.js";

async function RegisterUserController(
	req,
	res
) {

	try {

		const {
			name,
			email,
			password
		} = req.body;

		const repository =
			new PostgresUserRepository();

		const service =
			new RegisterUserService(
				repository
			);

		const user =
			await service.execute({
				name,
				email,
				password
			});

		return res.status(201).json(
			user
		);

	} catch (err) {

		console.error(err);

		return res.status(400).json({
			error:
				err.message ??
				"Erro ao cadastrar usuário"
		});
	}
}

export {
	RegisterUserController
};