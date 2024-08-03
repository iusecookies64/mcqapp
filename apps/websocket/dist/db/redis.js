"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const REDIS_STRING = process.env.REDIS_STRING;
const redisClient = (0, redis_1.createClient)({ url: REDIS_STRING });
redisClient
    .on("error", () => {
    console.log("Error connecting to redis");
})
    .connect();
exports.default = redisClient;
