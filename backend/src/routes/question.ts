import { Router } from "express";
import authorizeUser from "../middlewares";
import {
  CreateQuestion,
  DeleteQuestion,
  GetContestQuestions,
  GetResponse,
  ReorderOptions,
  ReorderQuestions,
  UpdateQuestion,
} from "../controllers/questionController";
import { isUserCreatedContest } from "../middlewares/isUserCreatedContest";

const router = Router();

router.post("/create", authorizeUser, isUserCreatedContest, CreateQuestion);

router.post("/update", authorizeUser, isUserCreatedContest, UpdateQuestion);

router.post(
  "/reorder-questions",
  authorizeUser,
  isUserCreatedContest,
  ReorderQuestions
);

router.post(
  "/reorder-options",
  authorizeUser,
  isUserCreatedContest,
  ReorderOptions
);

router.delete("/delete", authorizeUser, isUserCreatedContest, DeleteQuestion);

router.get(
  "/getAllQuestions",
  authorizeUser,
  isUserCreatedContest,
  GetContestQuestions
);

router.get("/response", authorizeUser, GetResponse);

export default router;
