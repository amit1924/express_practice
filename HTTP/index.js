import express from "express";

const app = express();

const port = 3000;

// Params
// By destructuring the id property from params
app.get("/page/:id", (req, res) => {
  console.log(req.params.id);
  const { id } = req.params;
  res.send(`<h1>This is ${id} page</h1>`);
});

// Without destructuring the id property from params
app.get("/list/:id", (req, res) => {
  console.log(req.params.id);

  res.send(`<h1>This is ${req.params.id} list</h1>`);
});

// Query
// http://localhost:3000/product/poco%20x6?brand=redmi
app.get("/product/:model", (req, res) => {
  const brand = req.query.brand;
  res.send(
    `<h1>This is ${req.params.model} from brand ${req.query.brand}</h1>`
  );
});

// Headers
app.get("/", (req, res) => {
  console.log(req.headers.host); // Logging the host
  console.log(req.headers["user-agent"]); // Logging the user-agent

  // Check if authorization header exists and is in the correct format
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    // Extracting the token part after "Bearer "
    const token = req.headers.authorization.substring(7);
    console.log(token); // Logging the token
    res.send(`<h1>Token received: ${token}</h1>`);
  } else {
    console.log(
      "Missing Authorization Header: Make sure that the client is sending the request with the correct authorization header. The header should look like this: Authorization: Bearer your_token_here."
    );
    res
      .status(401)
      .send(
        "Missing Authorization Header: Make sure that the client is sending the request with the correct authorization header. The header should look like this: Authorization: Bearer your_token_here."
      );
  }
});

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
