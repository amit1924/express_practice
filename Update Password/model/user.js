import mongoose from "mongoose";

// Define the user schema
const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Create the user model
const User = mongoose.model("User", userSchema);

export default User;
