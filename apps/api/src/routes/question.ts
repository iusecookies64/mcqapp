import { Router } from "express";
import authorizeUser from "../middlewares";
import {
  CreateQuestion,
  DeleteQuestion,
  UpdateQuestion,
} from "../controllers/questionController";
import { isUserCreatedContest } from "../middlewares/isUserCreatedContest";

const router = Router();

router.post("/create", authorizeUser, isUserCreatedContest, CreateQuestion);

router.post("/update", authorizeUser, isUserCreatedContest, UpdateQuestion);

router.delete("/delete", authorizeUser, isUserCreatedContest, DeleteQuestion);

export default router;
