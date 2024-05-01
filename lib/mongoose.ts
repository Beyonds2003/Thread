import mongoose from "mongoose";

let isConnect = false;

export const connectToDatabase = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGO_URL) return console.log(`MONGO_URL not found`);

  if (isConnect) return;

  try {
    await mongoose.connect(process.env.MONGO_URL);

    isConnect = true;
  } catch (error) {
    console.log(`Error from mongoose connecting: ${error}`);
  }
};
