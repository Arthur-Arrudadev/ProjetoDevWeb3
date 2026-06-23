class FindAllQuestionsService {

	constructor(repository) {
		this.repository = repository;
	}

	async execute(filters = {}) {

		return await this.repository.findAll(
			filters
		);
	}
}

export default FindAllQuestionsService;