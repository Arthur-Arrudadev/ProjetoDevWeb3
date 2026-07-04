import express from "express";
import cors from "cors";
import UserRoutes from "./http/controllers/user/routes/index.js";
import QuestionRoutes from "./http/controllers/questions/routes/index.js"
import { envConfig } from "./config/env.js";
import { waitForDatabase } from "./database/wait-for-db.js";

const app = express();

app.use(cors({
  origin: "*"
}));
app.use(express.json({ limit: "4mb" }));
app.use(express.urlencoded({ extended: false, limit: "4mb" }));

app.use("/users", UserRoutes);
app.use("/questions", QuestionRoutes);

async function bootstrap() {
  try {
    await waitForDatabase();

    app.listen(Number(envConfig.PORT), () => {
      console.log(`Ouvindo na porta ${envConfig.PORT}`);
    });
  } catch (err) {
    console.error("Erro ao iniciar aplicação:", err);
    process.exit(1);
  }
}

bootstrap();