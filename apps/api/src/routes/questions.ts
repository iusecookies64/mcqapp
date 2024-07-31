import { Router } from "express";
import authorizeUser from "../middlewares";
import {
  CreateQuestion,
  DeleteQuestion,
  GetUserQuestions,
  UpdateQuestion,
} from "../controllers/questionController";

const router = Router();

router.get("/my-questions", authorizeUser, GetUserQuestions);

router.post("/create", authorizeUser, CreateQuestion);

router.post("/update", authorizeUser, UpdateQuestion);

router.post("/delete", authorizeUser, DeleteQuestion);

export default router;
