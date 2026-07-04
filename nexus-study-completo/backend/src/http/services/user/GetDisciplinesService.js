class GetDisciplinesService {

	constructor(repository) {
		this.repository = repository;
	}

	async execute(userId) {
		if (!userId) throw new Error("Id do usuário é obrigatório");

		const user = await this.repository.findById(userId);
		if (!user) throw new Error("Usuário não encontrado");

		return this.repository.getDisciplines(userId);
	}
}

export default GetDisciplinesService;
