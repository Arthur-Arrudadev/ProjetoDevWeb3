import { Router } from "express";
import { AnswerQuestionController } from "../AnswerQuestionController.js";
import { FindAllQuestionsController } from "../FindAllQuestionController.js";
import { FindQuestionByIdController } from "../FindQuestionByIdController.js";
import { GetQuestionFiltersController } from "../GetQuestionFiltersController.js";
import { MarkReviewController } from "../../user/MarkReviewController.js";

const router = Router();

router.get("/filters", GetQuestionFiltersController);
router.get("/", FindAllQuestionsController);
router.get("/:id", FindQuestionByIdController);
router.post("/:id/answer", AnswerQuestionController);
router.post("/:id/review", MarkReviewController);

export default router;
