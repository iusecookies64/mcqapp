"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const ws_1 = require("ws");
const auth_1 = __importDefault(require("./auth/auth"));
const url_1 = __importDefault(require("url"));
const UserManager_1 = __importDefault(require("./UserManager"));
const User_1 = require("./User");
const PORT = process.env.PORT || "3001";
const wss = new ws_1.WebSocketServer({ port: parseInt(PORT) });
wss.on("connection", (ws, req) => {
    const token = url_1.default.parse(req.url || "", true).query.token;
    try {
        const userData = (0, auth_1.default)(token);
        if ((userData === null || userData === void 0 ? void 0 : userData.user_id) && userData.username) {
            const user = new User_1.User(userData, ws);
            UserManager_1.default.getInstance().addUser(user);
        }
    }
    catch (err) { }
});
