import express from "express";
import nodemailer from "nodemailer";
import bodyParser from "body-parser";
import dotenv from "dotenv";

const app = express();
const port = 3000;
dotenv.config();

// Set up Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// The below line of code will work when data send through x-www-form-urlencoded

// app.use(bodyParser.urlencoded({ extended: true }));

// The below line of code will work when data send from body as a json string
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Home page");
});

// User data
const users = [];

// Route for user signup
app.post("/signup", (req, res) => {
  const { username, email, password } = req.body;

  // Check if user is already existing
  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    return res.status(400).send("User already exists");
  }

  // Generate Verification token
  const verificationToken = Math.random().toString(36).substring(7);

  // Save User data
  const newUser = {
    username,
    email,
    password,
    verificationToken,
    verified: false,
  };
  users.push(newUser);
  console.log(newUser);

  // Send verification email
  const verificationLink = `http://localhost:${port}/verify-email?token=${verificationToken}`;

  // send verification link
  const mailOptions = {
    from: "rocks.amit@gmail.com",
    to: email,
    subject: "Email verification",
    text: `Please click the verification link below to verify your email address ${verificationLink}`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending verification email", error);
      res.status(500).send("Error sending verification email");
    } else {
      console.log("Verification email sent", info.response);
      res.send("User registered successfully, Verification email sent");
    }
  });
});

// Route for email verification
app.get("/verify-email", (req, res) => {
  const { token } = req.query;

  // Find User by verification token
  const user = users.find((user) => user.verificationToken === token);

  if (!user) {
    return res.status(400).send("Invalid response token");
  }

  // Update user's verified status
  user.verified = true;
  user.verificationToken = undefined;

  res.send("Email Verified Successfully, You can now login");
});

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
