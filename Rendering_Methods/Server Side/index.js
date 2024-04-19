// server.js
const express = require("express");
const app = express();

// Define route for rendering HTML
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Server-Side Rendering</title>
      </head>
      <body>
        <h1>Hello, SSR!</h1>
      </body>
    </html>
  `);
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
