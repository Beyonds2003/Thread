import Redis from "ioredis";

let redisClient: null | Redis = null;

export const connectToRedis = async () => {
  try {
    if (redisClient) {
      console.log("Redis database have been already connected");
      return redisClient;
    }

    console.log("Redis ENV", process.env.REDIS_URL, "password: ", process.env.REDIS_PASS);

    redisClient = new Redis(`${process.env.REDIS_URL}`, {
      password: process.env.REDIS_PASS,
    });

    return redisClient;
  } catch (error) {
    console.log(`Error from redis connecting: ${error}`);
  }
};
