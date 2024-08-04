import { config } from "dotenv";
// adding env variables to node process
config();
import express from "express";
import cors from "cors";
import userRouter from "./routes/users";
import gamesRouter from "./routes/games";
import questionRouter from "./routes/questions";
import topicsRouter from "./routes/topics";
import { GlobalErrorHandler } from "./controllers/errorController";
import CustomError from "./utils/CustomError";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 min window
  limit: 20, // 20 requests per window
});

const port = process.env.PORT || 3000;

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(limiter);
app.use(express.json()); // req.body parser
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("./public"));

app.use("/users", userRouter);
app.use("/games", gamesRouter);
app.use("/questions", questionRouter);
app.use("/topics", topicsRouter);

app.all("*", (req, res, next) => {
  throw new CustomError("Oops! Error 404 Not Found", 404);
});

app.use(GlobalErrorHandler);

app.listen(port, () => {
  console.log("Server Up And Running On Port", port);
});
