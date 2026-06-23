class DetailedReportService {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(userId, { period } = {}) {
    if (!userId) throw new Error('Usuário obrigatório');
    const rows = await this.repository.getDetailedReport(userId, { period });
    return rows;
  }
}

export default DetailedReportService;
