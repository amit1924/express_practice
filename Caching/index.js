import express from "express";

const app = express();
const PORT = 3000;

// in-memory cache
const cache = {};

// Middleware  check cache before making requests

const cacheMiddleware = (req, res, next) => {
  const key = req.originalUrl || req.url;

  if (cache[key]) {
    console.log("Cache Hit");
  } else {
    console.log("Cache miss");

    next();
  }
};

app.get("/", cacheMiddleware, (req, res) => {
  // Data fetching
  const content = "Hello world! This is a dynamic content";

  // Store Content in Cache
  const key = req.originalUrl || req.url;
  console.log(key);
  cache[key] = content;
  res.send(content);
});

app.listen(PORT, () => {
  console.log(`server listening on `);
});
