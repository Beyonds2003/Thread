import mongoose from "mongoose";
import Redis from "ioredis";

let isConnect = false;
let isConnect2 = false;
const collectionName = "threads";

export const connectToDatabase = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGO_URL) return console.log(`MONGO_URL not found`);

  if (isConnect && isConnect2)
    return console.log("MongoDB database have been already connected");

  try {
    await mongoose.connect(process.env.MONGO_URL);
    const redisClient = new Redis(`${process.env.REDIS_URL}`, {
      password: process.env.REDIS_PASS,
    });

    const redisClientSub = new Redis(`${process.env.REDIS_URL}`, {
      password: process.env.REDIS_PASS,
    });

    isConnect = true;
    isConnect2 = true;

    // Create Change Stream
    const db = mongoose.connection.db;
    const collection = db.collection(collectionName);
    const changeStream = collection.watch([], {
      fullDocument: "updateLookup",
      fullDocumentBeforeChange: "whenAvailable",
    });

    // Listen on Change
    changeStream.on("change", async (change: any) => {
      await redisClient.publish("mongo-thread-change", JSON.stringify(change));
    });

    // Subscribe to redis channel
    redisClientSub.subscribe("mongo-thread-change", (err, count) => {
      if (err) {
        console.error("Redis Subscription Error:", err);
      } else {
        console.log(`Subscribed to ${count} channels`);
      }
    });

    redisClientSub.on("message", (channel, message) => {
      if (channel === "mongo-thread-change") {
        const data = JSON.parse(message);
        const {
          operationType,
          fullDocument,
          clusterTime,
          fullDocumentBeforeChange,
        } = data;
        if (operationType === "insert") {
          redisClient.zadd(
            "threads",
            new Date(fullDocument.createdAt).getTime(),
            JSON.stringify(fullDocument),
          );
        } else if (operationType === "delete") {
          redisClient.zrem("threads", JSON.stringify(fullDocumentBeforeChange));
        }
      }
    });

    console.log("Successfully connected to MongoDB and Redis database.");
  } catch (error) {
    console.log(`Error from mongoose connecting: ${error}`);
  }
};
