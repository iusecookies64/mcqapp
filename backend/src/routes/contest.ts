import { Router } from "express";
import authorizeUser from "../middlewares";
import {
  CreateContest,
  GetMyContests,
  GetPastContests,
  GetUpcomingContests,
  PublishContest,
  UpdateContest,
} from "../controllers/contestController";

const router = Router();

router.post("/create", authorizeUser, CreateContest);

router.post("/update", authorizeUser, UpdateContest);

router.post("/publish", authorizeUser, PublishContest);

router.get("/upcoming-contests", authorizeUser, GetUpcomingContests);

router.get("/past-contests", authorizeUser, GetPastContests);

router.get("/my-contests", authorizeUser, GetMyContests);

export default router;
