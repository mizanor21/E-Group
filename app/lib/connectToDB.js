import mongoose from "mongoose";

export const connectToDB = async () => {
  await mongoose
    .connect(process.env.DB_URI, {
      useNewUrlParser: true,
    })
    .then(() => {
      console.log("MongoDB connected");
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err);
    });
};
