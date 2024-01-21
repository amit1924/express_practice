import express from "express";

const app = express();

const userAuth = (req, res, next) => {
  console.log("username:(amit)");
  console.log("pasword:(amit)");
  console.log("age:(18)");
  next();
};

app.use(userAuth);

app.get("/", userAuth, (req, res) => {
  res.send("<h1>Hello</h1>");
});
app.get("/about", (req, res) => {
  res.send("<h1>This is about page</h1>");
});

app.listen(8000, (req, res) => {
  console.log(` listening on port${8000}`);
});
