const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const http = require("http");
const path = require("path");
require("dotenv").config();

const User = require("./models/User.ejs");
const Message = require("./models/message.ejs");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// Middleware to check authentication
function authenticateToken(req, res, next) {
  const token = req.cookies.jwt;
  if (!token) return res.redirect("/login");
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.redirect("/login");
    req.user = user;
    next();
  });
}

// Routes
app.get("/", authenticateToken, async (req, res) => {
  const users = await User.find({ _id: { $ne: req.user.id } }, "username _id");
  res.render("chat", { user: req.user, users });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET
    );
    res.cookie("jwt", token, { httpOnly: true });
    res.redirect("/");
  } else {
    res.redirect("/login");
  }
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);
  const user = new User({ username, email, password: hashedPassword });
  await user.save();
  res.redirect("/login");
});

// Generate a unique room ID based on user IDs
function generateRoomId(userId1, userId2) {
  return [userId1, userId2].sort().join("_");
}

// Socket.io
// io.on("connection", (socket) => {
//   console.log("A user connected");

//   socket.on("join-room", (userId, otherUserId) => {
//     const roomId = generateRoomId(userId, otherUserId);
//     socket.join(roomId);
//     console.log(`User ${userId} joined room ${roomId}`);

//     socket.on("message", (message) => {
//       console.log(`Message in room ${roomId}: ${message}`);
//       io.to(roomId).emit("createMessage", message);
//     });

//     socket.on("disconnect", () => {
//       console.log(`User ${userId} disconnected from room ${roomId}`);
//     });
//   });
// });

////////////////////////////////////////////////////////////////
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("join-room", async (userId, otherUserId) => {
    const roomId = generateRoomId(userId, otherUserId);
    socket.join(roomId);
    console.log(`User ${userId} joined room ${roomId}`);

    // Retrieve message history
    const messages = await Message.find({ roomId }).sort({ timestamp: 1 });
    socket.emit("loadMessages", messages);

    // Create a new message
    socket.on("message", (message) => {
      const timestamp = new Date(); // Create a Date object
      Message.create({
        roomId,
        sender: userId,
        content: message,
        timestamp,
      });
      io.to(roomId).emit("createMessage", {
        sender: userId,
        content: message,
        timestamp,
      });
    });

    socket.on("disconnect", () => {
      console.log(`User ${userId} disconnected from room ${roomId}`);
    });
  });
});

// Start Server
server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
