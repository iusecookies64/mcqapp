"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const auth_1 = __importDefault(require("./auth/auth"));
const url_1 = __importDefault(require("url"));
const wss = new ws_1.WebSocketServer({ port: 8080 });
wss.on("connection", (ws, req) => {
    const token = url_1.default.parse(req.url || "", true).query.token;
    const userData = (0, auth_1.default)(token);
    if (userData) {
        console.log(userData);
    }
    ws.on("close", () => {
        console.log("hey");
    });
    ws.on("close", () => {
        console.log("hi");
    });
});
