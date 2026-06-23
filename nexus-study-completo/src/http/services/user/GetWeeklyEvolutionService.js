class GetWeeklyEvolutionService {

	constructor(repository) {
		this.repository = repository;
	}

	async execute(userId, filters = {}) {
		if (!userId) throw new Error("Id do usuário é obrigatório");

		const user = await this.repository.findById(userId);
		if (!user) throw new Error("Usuário não encontrado");

		const evolution = await this.repository.getWeeklyEvolution(userId, filters);
		return evolution;
	}
}

export default GetWeeklyEvolutionService;
