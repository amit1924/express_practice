import express from "express";
import jwt from "jsonwebtoken";
import session from "express-session";

const app = express();
app.use(express.json());
app.use(
  session({
    secret: "secret", //. This secret is used to sign the session ID cookie
    resave: false, // Don't save session if unmodified
    saveUninitialized: false,
    cookie: {
      maxAge: 11000, // 11 seconds in milliseconds
    }, // Don't create session until something stored
  })
);
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
    //    Store Token in Session
    req.session.token = token;
    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error("Error in login", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Verify Token Through Headers

const verifyToken = (req, res, next) => {
  const token = req.session.token;

  if (!token) {
    return res.status(401).json({ message: "Token is required" });
  }

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
