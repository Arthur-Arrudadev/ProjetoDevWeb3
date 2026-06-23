import PostgresQuestionRepository
	from "../../../repositories/PostgresQuestionRepository.js";

import FindAllQuestionsService
	from "../../services/question/FindAllQuestionsService.js";

async function FindAllQuestionsController(
	req,
	res
) {

	try {

		const repository =
			new PostgresQuestionRepository();

		const service =
			new FindAllQuestionsService(
				repository
			);

		const questions =
			await service.execute({
				discipline:
					req.query.discipline,

				year:
					req.query.year,

				limit:
					Number(req.query.limit) || 10
			});

		return res.status(200).json(
			questions
		);

	} catch (err) {

		console.error(err);

		return res.status(500).json({
			error:
				"Erro ao buscar questões"
		});
	}
}

export {
	FindAllQuestionsController
};