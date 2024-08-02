import { Router } from "express";
import { GetPastGames } from "../controllers/gameController";
import authorizeUser from "../middlewares";

const router = Router();

router.get("/past-games", authorizeUser, GetPastGames);

export default router;
