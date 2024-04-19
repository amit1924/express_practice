import express from "express";
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());
const secretKey = "amit@test123";
const PORT = 3000;

const users = [
  {
    id: 1,
    email: "amit@test.com",
    password: "test1234",
  },
  {
    id: 2,
    email: "arsh@test.com",
    password: "test12345",
  },
];

app.post("/user/login", (req, res) => {
  const { email, password } = req.body;

  try {
    const user = users.find(
      (user) => user.email === email && user.password === password
    );

    if (!user) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    // Token Generation
    const token = jwt.sign(user, secretKey, { expiresIn: "1h" });
    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error("Error in login", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Verify Token Through Headers

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token is required" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
    console.log("Token verified", token);
  } catch (err) {
    res.status(403).json({ message: "Invalid Token" });
  }
};

// Protected Routes

app.get("/protected", verifyToken, (req, res) => {
  res.json({ message: "Protected Route", user: req.user });
});

// Decoding token
// URL = http://localhost:3000/decode?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJhcnNoQHRlc3QuY29tIiwicGFzc3dvcmQiOiJ0ZXN0MTIzNDUiLCJpYXQiOjE3MTM0NDI0NjMsImV4cCI6MTcxMzQ0NjA2M30.-Vq_MPP_G7VgrwWJEu3S5FUsEPJ0ngakPWzW_jLfpoY
app.get("/decode", (req, res) => {
  const token = req.query.token;

  try {
    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    const decoded = jwt.decode(token);
    console.log("Decoded token:", decoded);

    if (!decoded) {
      return res.status(400).json({ message: "Invalid Token" });
    }

    res.status(200).json({ message: "Token decoded", decoded });
  } catch (err) {
    console.error("Error decoding token:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
