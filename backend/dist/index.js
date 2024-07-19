"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
// adding env variables to node process
(0, dotenv_1.config)();
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const node_http_1 = require("node:http");
const cors_1 = __importDefault(require("cors"));
const user_1 = __importDefault(require("./routes/user"));
const contest_1 = __importDefault(require("./routes/contest"));
const question_1 = __importDefault(require("./routes/question"));
const errorController_1 = require("./controllers/errorController");
const CustomError_1 = __importDefault(require("./utils/CustomError"));
const socketController_1 = require("./controllers/socketController");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const port = process.env.PORT || 3000;
const app = (0, express_1.default)();
const server = (0, node_http_1.createServer)(app);
const io = new socket_io_1.Server(server, { cors: { origin: "*" } });
io.on("connection", socketController_1.SocketHandler);
app.use((0, cors_1.default)({
    origin: "*",
}));
app.use(express_1.default.json()); // req.body parser
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.static("./public"));
app.use("/users", user_1.default);
app.use("/contest", contest_1.default);
app.use("/question", question_1.default);
app.all("*", (req, res, next) => {
    throw new CustomError_1.default("Oops! Error 404 Not Found", 404);
});
app.use(errorController_1.GlobalErrorHandler);
server.listen(port, () => {
    console.log("Server Up And Running On Port", port);
});
