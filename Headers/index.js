import express from "express";

const app = express();
const PORT = 3000;

// setHeader(name, value): Sets a single header with the given name and value.

// Setting a Response Header
app.use((req, res, next) => {
  res.setHeader("X-Custom-Header", "I am response header");
  next();
});

// Response Header:
// Content-Length	27
// Content-Type	application/json; charset=utf-8
// Date	Sat, 15 Jun 2024 07:32:49 GMT
// ETag	W/"1b-tDnArHZ232y12bSoTiMc+/cz4as"
// X-Custom-Header	I am response header
// X-Powered-By	Express

// Route handler to send JSON response with custom header
app.get("/", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.json({ message: "Hello, world!" });
});

// Reading Request Headers
app.get("/user-agent", (req, res) => {
  const userAgent = req.headers["user-agent"];
  res.send(`User-Agent: ${userAgent}`);
});

// User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:127.0) Gecko/20100101 Firefox/127.0

////////////////////////////////

// Conditionally Handling Headers

// Check In Postman in headers section Key:Authorization and value:Bearer token123
app.get("/profile", (req, res) => {
  const isLoggedIn = req.headers.authorization === "Bearer token123";
  if (isLoggedIn) {
    res.status(200).send("Authorized");
  } else {
    res.status(403).send("Unauthorized");
  }
});

//////////////////////////////////////
// Define a route to demonstrate headers and JSON.stringify

app.get("/headers", (req, res) => {
  // Headers Object
  const headers = {
    Authorization: "Bearer token123",
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  console.log(req.headers);

  // {
  //     host: 'localhost:3000',
  //     connection: 'keep-alive',
  //     'cache-control': 'max-age=0',
  //     'sec-ch-ua': '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
  //     'sec-ch-ua-mobile': '?0',
  //     'sec-ch-ua-platform': '"Windows"',
  //     dnt: '1',
  //     'upgrade-insecure-requests': '1',
  //     'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  //     accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
  //     'sec-fetch-site': 'none',
  //     'sec-fetch-mode': 'navigate',
  //     'sec-fetch-user': '?1',
  //     'sec-fetch-dest': 'document',
  //     'accept-encoding': 'gzip, deflate, br, zstd',
  //     'accept-language': 'en,en-US;q=0.9,hu;q=0.8',
  //     'if-none-match': 'W/"61-TykyYSI02rHz41v8RwE/du69/do"'}

  // Convert headers object to JSON string
  const headersJSONString = JSON.stringify(headers);

  console.log(headersJSONString);

  res.send(headersJSONString);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
