import { Router } from "express";
import authorizeUser from "../middlewares";
import {
  CreateContest,
  DeleteContest,
  GetActiveContests,
  GetMyContests,
  GetParticipants,
  PublishContest,
  UpdateContest,
} from "../controllers/contestController";

const router = Router();

router.post("/create", authorizeUser, CreateContest);

router.post("/update", authorizeUser, UpdateContest);

router.post("/delete/:contest_id", authorizeUser, DeleteContest);

router.post("/publish", authorizeUser, PublishContest);

router.get("/active-contests", authorizeUser, GetActiveContests);

router.get("/my-contests", authorizeUser, GetMyContests);

router.get("/get-participants", authorizeUser, GetParticipants);

export default router;
