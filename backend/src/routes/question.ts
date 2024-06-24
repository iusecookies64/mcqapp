import { Router } from "express";
import authorizeUser from "../middlewares";
import {
  CreateQuestion,
  GetQuestions,
  GetResponse,
  UpdateQuestion,
} from "../controllers/questionController";

const router = Router();

router.post("/create", authorizeUser, CreateQuestion);

router.post("/update", authorizeUser, UpdateQuestion);

router.get("/get-questions", authorizeUser, GetQuestions);

router.get("/get-response", authorizeUser, GetResponse);

export default router;
