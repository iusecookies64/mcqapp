"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ws_1 = require("ws");
var wss = new ws_1.WebSocketServer({ port: 8080 });
wss.on("connection", function (ws, req) {
    // const userData = extractAuthUser(token);
    console.log(req);
});
