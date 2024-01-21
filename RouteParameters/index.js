import express from "express";
const app = express();

// Getting Route Params
app.get("/student/:id", (req, res) => {
  // console.log(req.params.id);
  console.log(req.params);
  const { id } = req.params;
  res.send(`Student No:${req.params.id}`);
});

// Passing Multiple Route Params

app.get("/products/:category/:id", (req, res) => {
  const { category, id } = req.params;
  res.send(`Product category:${category} Product ID:${id}`);
});

app.param("id", (req, res, next, id) => {
  console.log(`id:${id}`);
  next();
});

app.get("/user/:id", (req, res) => {
  console.log("This is user id path");
  res.send("Response Ok");
});

app.listen(8000, () => {
  console.log(`listening on ${8000}`);
});
