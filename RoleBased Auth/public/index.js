import express from "express";
import jwt from "jsonwebtoken";
import authorizeRole from "./Middleware/auth.js";
import { users, ROLES } from "./models/User.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authenticateToken from "./Middleware/authenticateToken.js";

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://127.0.0.1:5500" }));

// app.set("view engine", "ejs");

const secretKey = "amit12345";
const PORT = 3000;

app.use(express.static("public"));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get("/", (req, res) => {
  // Render the login page
  res.sendFile(path.join(__dirname, "client", "login.html"));
});

// Login route to generate a token
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);

  const user = users.find(
    (user) => user.username === username && user.password === password
  );
  console.log(user);

  if (user) {
    const token = jwt.sign(
      { username: user.username, role: user.role },
      secretKey
    );
    res.json({ token });
  } else {
    res.status(401).json({ message: "Invalid username or password" });
  }
});

// Protected route accessible only to admins
app.get("/admin", authenticateToken, authorizeRole(ROLES.ADMIN), (req, res) => {
  res.json({ message: "Admin Dashboard" });
});

// Protected routes accessible for users only
app.get("/user", authenticateToken, authorizeRole(ROLES.USER), (req, res) => {
  // res.json({ message: "User Dashboard" });
  res.redirect("/user.html");
});

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
