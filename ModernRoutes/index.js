import express from "express";

const app = express();

// Refactor
app
  .route("/student")
  .get((req, res) => res.send("All students"))
  .post((req, res) => res.send("Add New Student"));

app.listen(8000, () => {
  console.log(`Port listening on ${8000}`);
});
