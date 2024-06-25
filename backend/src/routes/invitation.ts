import { Router } from "express";
import authorizeUser from "../middlewares";

import {
  AcceptInvite,
  SendInvite,
  DeleteInvite,
  GetAllInvitations,
} from "../controllers/invitationController";

const router = Router();

router.post("/send-invite", authorizeUser, SendInvite);

router.post("/accept-invite", authorizeUser, AcceptInvite);

router.post("/delete", authorizeUser, DeleteInvite);

router.get("/all-invitations", authorizeUser, GetAllInvitations);

export default router;
