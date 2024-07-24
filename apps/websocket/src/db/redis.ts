import { createClient } from "redis";

const redisClient = createClient();
redisClient
  .on("error", () => {
    console.log("Error Connecting to Redis");
  })
  .connect();

export default redisClient;
