import express from "express";
import User from "./model/user.js";
import dbConnect from "./db/db.js";

const app = express();
app.use(express.static("public"));
app.use(express.json());

app.post("/register", async (req, res) => {
  try {
    const { fullname, email, password } = req.body;
    console.log(fullname, email, password);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("email already exists");
      res.status(403).json({ message: "email already existed" });
    }
    const user = new User({
      fullname: fullname,
      email: email,
      password: password,
    });

    await user.save();
    res.status(200).json({ message: "User Registered successfully" });
  } catch (err) {
    res.status(401).json({ message: "Fill all data first" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email, password: password });
    if (user) {
      res
        .status(200)
        .json({
          message: "login successfully",
          userId: user._id,
          name: user.fullname,
        });
    } else {
      res.status(401).json({ message: "user not found" });
    }
  } catch (err) {
    console.error(err.message);
  }
});

app.post("/updatePassword", async (req, res) => {
  const { userId, newPassword } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.password = newPassword;
    await user.save();
    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(`Error updating password ${err.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/logout", async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(200).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User logged out successfully" });
  } catch (err) {
    console.error("Couldn't log out", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

dbConnect();

app.listen(3000, () => {
  console.log(`Server is listening on ${3000}`);
});
