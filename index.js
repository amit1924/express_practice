import path from "path";

import express from "express";

const app = express();

app.use(express.static("./public"));

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./public/index.html"));
});

app.listen(8000, () => {
  console.log(`Listening on ${8000}`);
});
