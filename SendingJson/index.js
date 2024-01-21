// index.js
import express from "express";
import data from "./data.js"; // Import the data object

const app = express();
const port = 8000;

app.get("/data", (req, res) => {
  res.json(data);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
