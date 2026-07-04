import PostgresUserRepository from "../../../repositories/PostgresUserRepository.js";
import GetWeeklyEvolutionService from "../../services/user/GetWeeklyEvolutionService.js";

async function GetWeeklyEvolutionController(req, res) {
	try {
		const { id } = req.params;
		const { discipline, period } = req.query;

		const repository = new PostgresUserRepository();
		const service = new GetWeeklyEvolutionService(repository);

		const evolution = await service.execute(id, { discipline, period });

		return res.status(200).json(evolution);
	} catch (err) {
		console.error(err);
		return res.status(400).json({
			error: err.message ?? "Erro ao buscar evolução semanal"
		});
	}
}

export { GetWeeklyEvolutionController };
