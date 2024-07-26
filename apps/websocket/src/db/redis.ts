import { createClient } from "redis";

const redisClient = createClient();

redisClient
  .on("error", () => {
    console.log("Error connecting to redis");
  })
  .connect();

export default redisClient;
