import express from "express";

const app = express();
const port = 8000;

app.get(
  "/get",
  (req, res, next) => {
    res.write("<h1>home page</h1>");
    next(); // Pass control to the next callback
  },
  (req, res) => {
    res.end(" More than one callback"); // End the response
  }
);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
