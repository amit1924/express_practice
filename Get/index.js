import express from "express";

const app = express();
const port = 8000;

app.get("/", (req, res) => {
  res.send("<h1>This is homepage</h1>");
});

app.get("/about", (req, res) => {
  res.send("<h1>This is about page</h1>");
});

app.listen(port, () => {
  console.log(` listening on port ${port}`);
});
