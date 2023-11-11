import mongoose from "mongoose";

let isConnect = false;

export const connectToDatabase = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGO_URL) return console.log(`MONGO_URL not found`);

  if (isConnect)
    return console.log("MongoDB database have been already connected");

  try {
    await mongoose.connect(process.env.MONGO_URL);

    isConnect = true;

    console.log("Successfully connected to MongoDB database.");
  } catch (error) {
    console.log(`Error from mongoose connecting: ${error}`);
  }
};
