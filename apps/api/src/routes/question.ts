import { Router } from "express";
import authorizeUser from "../middlewares";
import {
  CreateQuestion,
  DeleteQuestion,
  GetUserQuestions,
  UpdateQuestion,
} from "../controllers/questionController";
import { isUserCreatedContest } from "../middlewares/isUserCreatedContest";

const router = Router();

router.get("/my-questions", authorizeUser, GetUserQuestions);

router.post("/create", authorizeUser, isUserCreatedContest, CreateQuestion);

router.post("/update", authorizeUser, isUserCreatedContest, UpdateQuestion);

router.post("/delete", authorizeUser, isUserCreatedContest, DeleteQuestion);

export default router;
