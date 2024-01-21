import express from "express";

const app = express();

// String Pattern
app.get("/ab?cd", (req, res) => {
  res.send("<h1>if user hit acd or abcd then this code will run</h1>");
});

// Regex Pattern
app.get(/a/, (req, res) => {
  res.send("if url path includes a then this code will run");
});

//

app.get(/^\/users\/[0-9]{4}$/, (req, res) => {
  res.send("working");
});

app.listen(8000, () => {
  console.log(`listening on ${8000}`);
});
