import { Router } from "express";
import {
  Protected,
  Signin,
  Signup,
  refreshToken,
} from "../controllers/userController";

const router = Router();

router.post("/signup", Signup);

router.post("/signin", Signin);

router.get("/protected", Protected);

router.get("/token", refreshToken);

export default router;
