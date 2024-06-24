import { Router } from "express";
import { Signin, Signup, ValidateToken } from "../controllers/userController";

const router = Router();

router.post("/signup", Signup);

router.post("/signin", Signin);

router.post("/validateToken", ValidateToken);

export default router;
