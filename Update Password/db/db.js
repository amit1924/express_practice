// import dotenv from "dotenv";
import mongoose from "mongoose";

// dotenv.config();
// // Log the MONGO_URI to verify it's being loaded
// console.log("MONGO_URI:", process.env.MONGO_URI);

// MongoDB connection
const dbConnect = async () => {
  try {
    const connect = await mongoose.connect(
      "mongodb://localhost:27017/update-password"
    );
    console.log("Database successfully connected");
  } catch (e) {
    console.log("Error connecting Database", e.message);
  }
};

export default dbConnect;
