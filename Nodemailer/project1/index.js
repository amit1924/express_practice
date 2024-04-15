import express from "express";
import sendEmail from "./utils/sendEmail.js"; // Move import statement here

const app = express();

// Set engine
app.set("view engine", "ejs");
// serve static files
app.use(express.static("public"));

// pass the data from
app.use(express.urlencoded({ extended: false }));

// route to render email form
app.get("/", (req, res) => {
  res.render("email");
});

// route to send email
app.post("/send-email", async (req, res) => {
  const { email, message } = req.body;
  try {
    // Call sendEmail function with email and message separately
    sendEmail(email, message);
    res.render("email", {
      status: "success", // Provide a status variable here
      message: "Email sent successfully",
    });
  } catch (e) {
    console.log("Error sending email:", e);
    res.status(500).send("Error sending email");
  }
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
