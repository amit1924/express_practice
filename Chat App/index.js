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
const { error } = require("console");

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
  res.render("login", { error: null });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).render("login", { error: "Invalid email format." });
  }

  if (!password || password.length < 6) {
    return res.status(400).render("login", {
      error: "Password must be at least 6 characters long.",
    });
  }

  const user = await User.findOne({ email });
  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET
    );
    res.cookie("jwt", token, { httpOnly: true });
    res.redirect("/");
  } else {
    res.status(401).render("login", { error: "Invalid email or password." });
  }
});

app.get("/register", (req, res) => {
  res.render("register", { error: null });
});

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  // Validate username
  if (!username || username.trim().length === 0) {
    return res.status(400).render("register", { error: "Invalid username." });
  }

  // Validate email
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return res
      .status(400)
      .render("register", { error: "Invalid email format." });
  }

  // Validate password
  if (!password || password.length < 6) {
    return res.status(400).render("register", {
      error: "Password must be at least 6 characters long.",
    });
  }

  // Check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .status(400)
      .render("register", { error: "Email is already registered." });
  }

  // Hash the password and save the user
  const hashedPassword = bcrypt.hashSync(password, 8);
  const user = new User({ username, email, password: hashedPassword });
  await user.save();
  res.redirect("/login");
});

// Logout route
app.get("/logout", (req, res) => {
  res.clearCookie("jwt");
  res.redirect("/login");
});

// Generate a unique room ID based on user IDs
function generateRoomId(userId1, userId2) {
  return [userId1, userId2].sort().join("_");
}

////////////////////////////////////////////////////////////////
const onlineUsers = {}; // Store userId to username and socketId mapping

io.on("connection", (socket) => {
  console.log("A user connected");

  // Function to retrieve username for a given userId
  const getUsernameFromUserId = async (userId) => {
    try {
      const user = await User.findById(userId);
      return user ? user.username : null;
    } catch (err) {
      console.error("Error fetching username:", err);
      return null;
    }
  };

  socket.on("join-room", async (userId, otherUserId) => {
    const username = await getUsernameFromUserId(userId);
    if (username) {
      onlineUsers[userId] = { username, socketId: socket.id };
    }

    const roomId = generateRoomId(userId, otherUserId);
    socket.join(roomId);
    console.log(`User ${username} (${userId}) joined room ${roomId}`);

    io.emit("updateOnlineUsers", onlineUsers);
    console.log("Online users:", onlineUsers); // Debugging log

    // Load previous messages for the room
    Message.find({ roomId })
      .sort({ timestamp: 1 })
      .then((messages) => {
        socket.emit("loadMessages", messages);
      });

    socket.on("message", (message) => {
      const timestamp = new Date();
      Message.create({
        roomId,
        sender: userId,
        content: message,
        timestamp,
      }).then(() => {
        io.to(roomId).emit("createMessage", {
          sender: userId,
          content: message,
          timestamp,
        });
      });
    });

    socket.on("disconnect", () => {
      // Remove the user from the onlineUsers object
      for (const [userId, user] of Object.entries(onlineUsers)) {
        if (user.socketId === socket.id) {
          delete onlineUsers[userId];
          console.log(`User ${user.username} (${userId}) disconnected`);
          break; // Exit the loop once the user is found and removed
        }
      }

      io.emit("updateOnlineUsers", onlineUsers);
      console.log(`User with socket ID ${socket.id} disconnected`);
      console.log("Online users:", onlineUsers);
    });
  });
});

function generateRoomId(userId1, userId2) {
  return [userId1, userId2].sort().join("_");
}

// Start Server
server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
