// server.js
const express = require("express");
const app = express();

// Serve static files (e.g., JavaScript, CSS)
app.use(express.static("public"));

// Define route for serving HTML
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
