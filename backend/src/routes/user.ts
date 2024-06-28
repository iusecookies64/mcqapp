import { Router } from "express";
import { Signin, Signup, GetUserInfo } from "../controllers/userController";
import authorizeUser from "../middlewares";

const router = Router();

router.post("/signup", Signup);

router.post("/signin", Signin);

router.get("/user-info", authorizeUser, GetUserInfo);

export default router;
