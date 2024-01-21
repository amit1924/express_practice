import express from "express";

const app = express();

const port = 8000;

app.post("/post", (req, res) => {
  res.send("Post Successfully");
});

app.listen(port, () => {
  console.log(` listening on port ${port}`);
});
