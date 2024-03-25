import mongoose from "mongoose";
import "dotenv/config";

const connectDB = async () => {
  const connection = await mongoose.connect(process.env.MONGO_URI, {
    autoIndex: process.env.AUTO_INDEX,
    autoCreate: process.env.AUTO_CREATE,
  });
  console.log("Connected to the DB");
  return connection;
};

export { connectDB };
