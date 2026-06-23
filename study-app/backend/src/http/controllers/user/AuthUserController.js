import PostgresUserRepository
	from "../../../repositories/PostgresUserRepository.js";

import AuthUserService
	from "../../services/user/AuthUserService.js";

async function AuthUserController(
	req,
	res
) {

	try {

		const {
			email,
			password
		} = req.body;

		const repository =
			new PostgresUserRepository();

		const service =
			new AuthUserService(
				repository
			);

		const user =
			await service.execute({
				email,
				password
			});

		return res.status(200).json(
			user
		);

	} catch (err) {

		console.error(err);

		return res.status(400).json({
			error:
				err.message ??
				"Erro ao autenticar usuário"
		});
	}
}

export {
	AuthUserController
};  