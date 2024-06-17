import express from "express";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";
import path from "path";

const app = express();
app.use(express.json());
const PORT = 3000;

const SECRET_KEY = "mysecretkey";
const REFRESH_SECRET_KEY = "myrefreshkey";

let refreshTokens = [];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const users = [
  { username: "amit", password: "amit" },
  { username: "arsh", password: "arsh" },
  { username: "rita", password: "rita" },
];

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const accessToken = jwt.sign({ username }, SECRET_KEY, { expiresIn: "10s" }); // Short expiry for testing
  const refreshToken = jwt.sign({ username }, REFRESH_SECRET_KEY);
  refreshTokens.push(refreshToken);
  res.json({ accessToken, refreshToken });
});

app.post("/token", (req, res) => {
  const { token } = req.body;
  console.log(`Received token: ${token}`);

  if (!token) {
    console.log("Token is missing in request");
    return res.status(401).json({ message: "Invalid token" });
  }

  if (!refreshTokens.includes(token)) {
    console.log("Refresh token does not exist");
    return res.status(401).json({ message: "Refresh token does not exist" });
  }

  jwt.verify(token, REFRESH_SECRET_KEY, (err, user) => {
    if (err) {
      console.log("Error verifying token:", err);
      return res.sendStatus(403);
    }

    console.log("Token verified, generating new access token");
    const accessToken = jwt.sign({ username: user.username }, SECRET_KEY, {
      expiresIn: "10s",
    });
    res.json({ accessToken });
  });
});

app.post("/logout", (req, res) => {
  const { token } = req.body;
  console.log(`Logout request with token: ${token}`);
  refreshTokens = refreshTokens.filter((t) => t !== token);
  return res.status(200).json({ message: "Logout successfully" });
});

// Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.log(`Authenticating token: ${token}`);

  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      console.log("Token verification failed:", err);
      return res.sendStatus(403);
    }
    req.user = user;

    next();
  });
};

// Protected Route
app.get("/protected", authenticateToken, (req, res) => {
  res.send("Protected Page");
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
