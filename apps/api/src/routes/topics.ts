import { Router } from "express";
import authorizeUser from "../middlewares";
import {
  CreateTopic,
  DeleteTopic,
  GetTopics,
  UpdateTopic,
} from "../controllers/topicController";

const router = Router();

router.post("/create", authorizeUser, CreateTopic);

router.post("/update", authorizeUser, UpdateTopic);

router.post("/delete", authorizeUser, DeleteTopic);

router.get("/all", authorizeUser, GetTopics);

export default router;
