"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// require("dotenv").config();
const dotenv_1 = require("dotenv");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const user_1 = __importDefault(require("./routes/user"));
const contest_1 = __importDefault(require("./routes/contest"));
// const socketHandler = require("./socket");
// adding env variables to node process
(0, dotenv_1.config)();
const port = process.env.PORT || 3000;
const app = (0, express_1.default)();
// const server = createServer(app);
// const io = new Server(server);
// io.on("connection", socketHandler);
app.use((0, cors_1.default)({
    origin: "*",
}));
app.use(express_1.default.json()); // req.body parser
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.static("./public"));
app.use("/users", user_1.default);
app.use("/contest", contest_1.default);
app.listen(port, () => {
    console.log("Server Running On Port", port);
});
// server.listen(port);
// module.exports = io;
