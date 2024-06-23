// require("dotenv").config();
import { config } from "dotenv";
import express from "express";
import { Server } from "socket.io";
import { createServer } from "node:http";
import cors from "cors";
import userRouter from "./routes/user";
import contestRouter from "./routes/contest";
import questionRouter from "./routes/question";

// const socketHandler = require("./socket");

// adding env variables to node process
config();

const port = process.env.PORT || 3000;
const app = express();
// const server = createServer(app);
// const io = new Server(server);

// io.on("connection", socketHandler);

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json()); // req.body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.static("./public"));

app.use("/users", userRouter);
app.use("/contest", contestRouter);
app.use("/question", questionRouter);

app.listen(port, () => {
  console.log("Server Running On Port", port);
});

// server.listen(port);

// module.exports = io;
