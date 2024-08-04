"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const redisClient = (0, redis_1.createClient)();
redisClient
    .on("error", () => {
    console.log("Error Connecting to Redis");
})
    .connect();
exports.default = redisClient;
