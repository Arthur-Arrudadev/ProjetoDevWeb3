import PostgresQuestionRepository from "../../../repositories/PostgresQuestionRepository.js";

async function GetQuestionFiltersController(req, res) {
	try {
		const repository = new PostgresQuestionRepository();
		const filters = await repository.getFilters();
		return res.status(200).json(filters);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Erro ao buscar filtros" });
	}
}

export { GetQuestionFiltersController };
