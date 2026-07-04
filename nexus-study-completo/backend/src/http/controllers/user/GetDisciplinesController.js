import PostgresUserRepository from "../../../repositories/PostgresUserRepository.js";
import GetDisciplinesService from "../../services/user/GetDisciplinesService.js";

async function GetDisciplinesController(req, res) {
	try {
		const { id } = req.params;

		const repository = new PostgresUserRepository();
		const service = new GetDisciplinesService(repository);

		const disciplines = await service.execute(id);

		return res.status(200).json(disciplines);
	} catch (err) {
		console.error(err);
		return res.status(400).json({
			error: err.message ?? "Erro ao buscar disciplinas"
		});
	}
}

export { GetDisciplinesController };
