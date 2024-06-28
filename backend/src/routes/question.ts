import { Router } from "express";
import authorizeUser from "../middlewares";
import {
  CreateQuestion,
  DeleteQuestion,
  GetContestQuestions,
  GetResponse,
  UpdateQuestion,
} from "../controllers/questionController";

const router = Router();

router.post("/create", authorizeUser, CreateQuestion);

router.post("/update", authorizeUser, UpdateQuestion);

router.post("/delete", authorizeUser, DeleteQuestion);

router.get("/:contest_id", authorizeUser, GetContestQuestions); // get all questions of a contest

router.get("/response", authorizeUser, GetResponse);

export default router;
