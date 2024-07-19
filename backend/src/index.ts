import { config } from "dotenv";
// adding env variables to node process
config();
import express from "express";
import { Server } from "socket.io";
import { createServer } from "node:http";
import cors from "cors";
import userRouter from "./routes/user";
import contestRouter from "./routes/contest";
import questionRouter from "./routes/question";
import { GlobalErrorHandler } from "./controllers/errorController";
import CustomError from "./utils/CustomError";
import { SocketHandler } from "./controllers/socketController";
import cookieParser from "cookie-parser";

const port = process.env.PORT || 3000;

const app = express();
const server = createServer(app);

const io = new Server(server, { cors: { origin: "*" } });
io.on("connection", SocketHandler);

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json()); // req.body parser
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("./public"));

app.use("/users", userRouter);
app.use("/contest", contestRouter);
app.use("/question", questionRouter);

app.all("*", (req, res, next) => {
  throw new CustomError("Oops! Error 404 Not Found", 404);
});

app.use(GlobalErrorHandler);

server.listen(port, () => {
  console.log("Server Up And Running On Port", port);
});
