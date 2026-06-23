class AnswerQuestionService {

	constructor(
		questionRepository,
		userRepository
	) {
		this.questionRepository =
			questionRepository;

		this.userRepository =
			userRepository;
	}

	async execute(data) {

		const {
			user_id,
			question_id,
			chosen_letter
		} = data;

		if (
			!user_id ||
			!question_id ||
			!chosen_letter
		) {
			throw new Error(
				"Dados obrigatórios ausentes"
			);
		}

		const user =
			await this.userRepository
				.findById(user_id);

		if (!user) {
			throw new Error(
				"Usuário não encontrado"
			);
		}

		const question =
			await this.questionRepository
				.findById(question_id);

		if (!question) {
			throw new Error(
				"Questão não encontrada"
			);
		}

		const alreadyAnswered =
			await this.questionRepository
				.findUserAnswer({
					user_id,
					question_id
				});

		if (alreadyAnswered) {
			throw new Error(
				"Questão já respondida"
			);
		}

		const correctAnswer =
		await this.questionRepository
			.getCorrectAlternative(
				question_id
			);

		const isCorrect =
			chosen_letter ===
			correctAnswer.correct_alternative;

		await this.questionRepository
			.answerQuestion({
				user_id,
				question_id,
				chosen_letter,
				is_correct: isCorrect
			});

		await this.questionRepository
			.updateResults({
				user_id,
				discipline:
					question.discipline,
				is_correct: isCorrect
			});

		return {
			success: true,
			is_correct: isCorrect,
			correct_alternative:
				correctAnswer.correct_alternative
		};
	}
}

export default AnswerQuestionService;