"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
// adding env variables to node process
(0, dotenv_1.config)();
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const node_fs_1 = require("node:fs");
const node_http_1 = require("node:http");
const cors_1 = __importDefault(require("cors"));
const user_1 = __importDefault(require("./routes/user"));
const contest_1 = __importDefault(require("./routes/contest"));
const question_1 = __importDefault(require("./routes/question"));
const errorController_1 = require("./controllers/errorController");
const CustomError_1 = __importDefault(require("./utils/CustomError"));
const socketController_1 = require("./controllers/socketController");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const redis_1 = __importDefault(require("./models/redis"));
setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield redis_1.default.keys("contest:*");
    console.log(result);
    console.log(typeof result[0]);
}), 1000);
const port = process.env.PORT || 3000;
// ssl certificates
const options = {
    key: (0, node_fs_1.readFileSync)("server.key"),
    cert: (0, node_fs_1.readFileSync)("server.cert"),
};
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
