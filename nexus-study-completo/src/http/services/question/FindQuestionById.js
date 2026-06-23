class FindQuestionByIdService {

	constructor(repository) {
		this.repository = repository;
	}

	async execute(id) {

		if (!id) {
			throw new Error(
				"Id da questão é obrigatório"
			);
		}

		const question =
			await this.repository.findById(id);

		if (!question) {
			throw new Error(
				"Questão não encontrada"
			);
		}

		return question;
	}
}

export default FindQuestionByIdService;