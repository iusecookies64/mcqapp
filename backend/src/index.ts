require("dotenv").config();
const express = require("express");
const { Server } = require("socket.io");
const { createServer } = require("node:http");
const roomRouter = require("./routes/room");
const userRouter = require("./routes/user");
const topicRouter = require("./routes/topic");
const socketHandler = require("./socket");
const cors = require("cors");
const port = process.env.PORT || 3000;

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: "*",
});

io.on("connection", socketHandler);

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json()); // req.body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.static("./public"));

app.use("/users", userRouter);
app.use("/rooms", roomRouter);
app.use("/topics", topicRouter);

server.listen(port);

module.exports = io;
