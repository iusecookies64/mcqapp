import { Router } from "express";
import {
  Signin,
  Signup,
  GetUserInfo,
  GetMatchingUsers,
} from "../controllers/userController";
import authorizeUser from "../middlewares";

const router = Router();

router.post("/signup", Signup);

router.post("/signin", Signin);

router.get("/user-info", authorizeUser, GetUserInfo);

router.get("/matching-users", authorizeUser, GetMatchingUsers);

export default router;
