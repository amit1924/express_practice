const express = require("express");
const path = require("path");

const app = express();
const port = 3000;
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Enable CORS for all origins
app.use(cors({ origin: "http://127.0.0.1:5500" }));
app.use(cookieParser());

app.use(express.json());

// Serve static files from the 'public' folder
app.use(express.static("public"));

// Serve the 'login.html' file from the 'client' folder
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "login.html"));
});

app.post("/login", (req, res) => {
  const { username } = req.body;

  if (username && username.toLowerCase() === "amit") {
    // Set cookie
    if (username) {
      res.cookie("username", username);

      console.log(" set cookie", username);
    } else {
      console.log("cant set cookie");
    }

    res.redirect("/dashboard");
  } else {
    res.sendStatus(401); // Unauthorized status code
  }
});

app.get("/dashboard", (req, res) => {
  res.send(`Welcome to the dashboard`);
});

app.listen(port, () => {
  console.log(`server listening on ${port}`);
});
