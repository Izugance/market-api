import { env } from "node:process";
import mongoose from "mongoose";

const connectDB = async () => {
  const connection = await mongoose.connect(env.MONGO_URI, {
    autoIndex: env.AUTO_INDEX,
    autoCreate: env.AUTO_CREATE,
  });
  console.log("Connected to the DB");
  return connection;
};

export { connectDB };
