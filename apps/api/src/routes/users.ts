import { Router } from "express";
import {
  GetMatchingUsers,
  Protected,
  Signin,
  Signup,
  refreshToken,
} from "../controllers/userController";
import authorizeUser from "../middlewares";

const router = Router();

router.post("/signup", Signup);

router.post("/signin", Signin);

router.get("/protected", authorizeUser, Protected);

router.get("/refreshtoken", refreshToken);

router.post("/users-search", authorizeUser, GetMatchingUsers);

export default router;
