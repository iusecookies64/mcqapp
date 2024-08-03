import { createClient } from "redis";

const REDIS_STRING = process.env.REDIS_STRING;

const redisClient = createClient({ url: REDIS_STRING });

redisClient
  .on("error", () => {
    console.log("Error connecting to redis");
  })
  .connect();

export default redisClient;
