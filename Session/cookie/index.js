const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  const username = req.cookies.username;
  if (username) {
    res.send(`Welcome back, ${username}!`);
  } else {
    res.send("Welcome! Please log in.");
  }
});

app.post("/login", (req, res) => {
  const { username } = req.body;

  const cookieOptions = {
    maxAge: 3000,
    httpOnly: true,
  };
  res.cookie("username", username, cookieOptions);
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
