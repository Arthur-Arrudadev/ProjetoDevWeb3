import { Router } from "express";
import { RegisterUserController } from "../RegisterUserController.js";
import { AuthUserController } from "../AuthUserController.js";
import { GetUserDashboardController } from "../GetUserDashboardController.js";
import { GetWeeklyEvolutionController } from "../GetWeeklyEvolutionController.js";
import { GetDisciplinesController } from "../GetDisciplinesController.js";
import { CheckHashController } from "../CheckHashController.js";
import { RequestPasswordResetController, ResetPasswordController } from "../PasswordResetController.js";
import { UpdateProfileController } from "../UpdateProfileController.js";
import { CreateStudySessionController } from "../CreateStudySessionController.js";

const router = Router();

router.post("/register", RegisterUserController);
router.post("/auth", AuthUserController);
router.get("/:id/dashboard", GetUserDashboardController);
router.get("/:id/weekly-evolution", GetWeeklyEvolutionController);
router.get("/:id/disciplines", GetDisciplinesController);
router.get("/admin/check-hash", CheckHashController);
router.post("/password-reset/request", RequestPasswordResetController);
router.post("/password-reset/confirm", ResetPasswordController);
router.put("/:id/profile", UpdateProfileController);
router.post("/:id/sessions", CreateStudySessionController);

export default router;
