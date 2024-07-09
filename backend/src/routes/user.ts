import { Router } from "express";
import { Signin, Signup, verifyToken } from "../controllers/userController";
import authorizeUser from "../middlewares";

const router = Router();

router.post("/signup", Signup);

router.post("/signin", Signin);

router.get("/user-info", authorizeUser);

router.post("/verify-token", verifyToken);

export default router;
