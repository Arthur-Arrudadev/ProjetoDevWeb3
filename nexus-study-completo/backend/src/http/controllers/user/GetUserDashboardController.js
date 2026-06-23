import PostgresUserRepository from "../../../repositories/PostgresUserRepository.js";
import GetUserDashboardService from "../../services/user/GetUserDashboardService.js";

async function GetUserDashboardController(req, res) {
	try {
		const { id } = req.params;
		const { discipline, period } = req.query;

		const repository = new PostgresUserRepository();
		const service = new GetUserDashboardService(repository);

		const dashboard = await service.execute(id, { discipline, period });

		return res.status(200).json(dashboard);
	} catch (err) {
		console.error(err);
		return res.status(400).json({
			error: err.message ?? "Erro ao buscar dashboard"
		});
	}
}

export { GetUserDashboardController };
