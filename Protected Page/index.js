import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import path from "path";

const app = express();

// Connect database
const connectDb = async () => {
  const connect = mongoose.connect("mongodb://localhost:27017/protected-page");
};

// User Schema  Database
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);

connectDb();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");

const PORT = 3000;
const SECRET_KEY = "secret123456";

// function to create JWT token
const createToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, {
    expiresIn: "1h",
  });
};

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) return res.redirect("/login");

  // Verify token
  jwt.verify(token, SECRET_KEY, (err, decodedToken) => {
    if (err) {
      console.error("JWT verification error:", err);
      return res.redirect("/login");
    }
    console.log("Decoded token:", decodedToken);
    req.user = decodedToken;
    next();
  });
};

// Register routes
app.get("/", (re, res) => {
  res.render("register");
});

// Register post
app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  // Basic input validation
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const userExisted = await User.findOne({ email });
    if (userExisted) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    console.log("User registered successfully");

    res
      .status(201)
      .json({ message: "Registered Successfully", redirect: "/login" }); // 201 Created status code for successful registration
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// login routes
app.get("/login", (req, res) => {
  res.render("login");
});
// Login POST
// app.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   const user = await User.findOne({ email });
//   if (!user) return res.status(400).send("User not found");

//   const isValidPassword = await bcrypt.compare(password, user.password);
//   if (!isValidPassword)
//     return res.status(401).json({ message: "Invalid credentials" });

//   const token = createToken(user);
//   res.cookie("jwt", token, { httpOnly: true });
//   res.redirect("/protected");
// });

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = createToken(user);
    res.cookie("jwt", token, { httpOnly: true });

    return res
      .status(200)
      .json({ message: "Login successful", redirect: "/protected" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Protected route
app.get("/protected", authenticateToken, (req, res) => {
  console.log("User ID:", req.user.id);
  res.render("protectedpage", { user: req.user });
});

// cart
app.get("/cart", authenticateToken, (req, res) => {
  res.render("cart");
});
app.get("/complete", authenticateToken, (req, res) => {
  res.render("complete");
});

// Logout route
app.get("/logout", (req, res) => {
  res.clearCookie("jwt"); // Clear the jwt cookie
  res.redirect("/login"); // Redirect to login page or any other appropriate page
});
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
