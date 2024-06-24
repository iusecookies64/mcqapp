import { Router } from "express";
import authorizeUser from "../middlewares";
import { OptionsTable } from "../types/models";
import client from "../models";
import { CreateQuestionRequest } from "../types/requests";
import { CreateQuestion } from "../controllers/questionController";
const router = Router();

router.post("/create", authorizeUser, CreateQuestion);

router.post("/update", authorizeUser);
export default router;
