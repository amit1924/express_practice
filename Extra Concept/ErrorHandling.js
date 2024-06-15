// Error handling Middleware

import express from "express";

const app = express();
const PORT = 3000;

// Simple Example

// //  Middleware to simulate an error
// app.get("/", (req, res, next) => {
//   const error = new Error("Something went wrong!");
//   next(error);
// });

// // Error handling middleware

// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send("Something Broken!");
// });

/////////////////////////////////
// complex error handling example

// Define a custom error class
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "Not Found Error";
    this.statusCode = 404;
  }
}

// Another custom error class for validation errors
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "Validation Error";
    this.statusCode = 400;
  }
}

// Middleware to simulate a NotFoundError
app.get("/not-found", (req, res, next) => {
  const error = new NotFoundError("This resource was not found.");
  next(error);
});

// Middleware to simulate a ValidationError
app.get("/validation-error", (req, res, next) => {
  const error = new ValidationError("Invalid data provided.");
  next(error);
});

// General route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  console.error(err.stack);

  if (err instanceof NotFoundError || err instanceof ValidationError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
