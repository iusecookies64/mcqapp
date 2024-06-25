import { Router } from "express";
import authorizeUser from "../middlewares";
import {
  CreateContest,
  GetMyContests,
  GetParticipants,
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

router.get("/get-participants", authorizeUser, GetParticipants);

export default router;
