import { Router } from "express";
import {
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

export default router;
