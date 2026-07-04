import PostgresQuestionRepository
	from "../../../repositories/PostgresQuestionRepository.js";

import FindQuestionByIdService
	from "../../services/question/FindQuestionById.js"

async function FindQuestionByIdController(
	req,
	res
) {

	try {

		const { id } = req.params;

		const repository =
			new PostgresQuestionRepository();

		const service =
			new FindQuestionByIdService(
				repository
			);

		const question =
			await service.execute(id);

		return res.status(200).json(
			question
		);

	} catch (err) {

		console.error(err);

		return res.status(500).json({
			error:
				"Erro ao buscar questão"
		});
	}
}

export {
	FindQuestionByIdController
};