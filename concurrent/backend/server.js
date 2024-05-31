import express from "express";
import dotenv from "dotenv";
const app = express();
dotenv.config();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  if (process.env.NODE_ENV === "production") {
    res.send("Hello, Production!");
  } else {
    res.send("Hello, Development!");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
