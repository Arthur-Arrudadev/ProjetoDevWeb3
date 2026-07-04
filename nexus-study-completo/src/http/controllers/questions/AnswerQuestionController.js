import PostgresQuestionRepository
	from "../../../repositories/PostgresQuestionRepository.js";

import PostgresUserRepository from "../../../repositories/PostgresUserRepository.js";

import AnswerQuestionService
	from "../../services/question/AnswerQuestionService.js";

async function AnswerQuestionController(
	req,
	res
) {

	try {

		const { id } = req.params;

		const {
			user_id,
			chosen_letter
		} = req.body;

		const questionRepository =
			new PostgresQuestionRepository();

		const userRepository =
			new PostgresUserRepository();

		const service =
			new AnswerQuestionService(
				questionRepository,
				userRepository
			);

		const result =
			await service.execute({
				user_id,
				question_id: id,
				chosen_letter
			});

		return res.status(200).json(
			result
		);

	} catch (err) {

		console.error(err);

		return res.status(400).json({
			error:
				err.message ??
				"Erro ao responder questão"
		});
	}
}

export {
	AnswerQuestionController
};