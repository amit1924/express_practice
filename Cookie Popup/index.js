import express from "express";
import cookieParser from "cookie-parser";

const app = express();
const PORT = 3000;

// Use cookie-parser middleware
app.use(cookieParser());

// Set EJS as the view engine
app.set("view engine", "ejs");

app.use(express.static("public"));

// Cookie Consent Route
app.get("/accept-cookies", (req, res) => {
  res.cookie("cookieConsent", "accepted", {
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });
  res.redirect("/");
});

// Route to render the page
app.get("/", (req, res) => {
  const hasConsented = req.cookies.cookieConsent === "accepted";
  res.render("index", { hasConsented });
});

app.listen(PORT, () => {
  console.log("Server listening on port " + PORT);
});
