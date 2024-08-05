import express, { response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import path from "path";

const app = express();

// Connect database
const connectDb = async () => {
  const connect = mongoose.connect("mongodb+srv://amish198:Amit1988@cluster0.gos2qpp.mongodb.net/protected-page");
};

// User Schema  Database
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cart: {
    type: Array,
    default: [],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

const User = mongoose.model("User", userSchema);

connectDb();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");

const PORT = 3000;
const SECRET_KEY = "secret123456";

// function to create JWT token
const createToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    SECRET_KEY,
    {
      expiresIn: "1h",
    }
  );
};

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) return res.redirect("/login");

  // Verify token
  jwt.verify(token, SECRET_KEY, (err, decodedToken) => {
    if (err) {
      console.error("JWT verification error:", err);
      return res.redirect("/login");
    }
    console.log("Decoded token:", decodedToken);
    req.user = decodedToken;
    next();
  });
};

// Register routes
app.get("/", (re, res) => {
  res.render("register");
});

// Register post
app.post("/register", async (req, res) => {
  const { email, password, role } = req.body;

  // Basic input validation
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const userExisted = await User.findOne({ email });
    if (userExisted) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    console.log("User registered successfully");

    res
      .status(201)
      .json({ message: "Registered Successfully", redirect: "/login" }); // 201 Created status code for successful registration
  } catch (err) {
    res.status(500).send(err.message);
  }
});
////////////////////////////////////////////////////////////////////////
// Admin Middleware
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }
  next();
};

// Admin Routes
app.get("/admin", authenticateToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find({});
    res.render("admin", { users: users });
  } catch (err) {
    res.status(500).render("error", { message: err.message });
  }
});

// Delete user Routes
app.post("/admin/delete-user", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { userId } = req.body;

    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update user routes
app.post("/admin/update-user", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { userId, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(userId, {
      email,
      password: hashedPassword,
      role,
    });
    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////
// Upadte cart
app.post(
  "/admin/update-cart-item",
  authenticateToken,
  isAdmin,
  async (req, res) => {
    try {
      const { userId, itemIndex, itemName, itemPrice } = req.body;

      // Parse itemIndex to integer
      const index = parseInt(itemIndex);
      console.log(`index:${index}`);

      // Find and update the user document
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            [`cart.${index}.name`]: itemName,
            [`cart.${index}.price`]: parseFloat(itemPrice),
          },
        },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Log and respond with success message
      console.log(`Updated user cart:`, updatedUser.cart);

      res.status(200).json({
        message: "Cart item updated successfully",
        updatedUser: updatedUser,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  }
);
//Delete the cart item

app.post(
  "/admin/delete-cart-item",
  authenticateToken,
  isAdmin,
  async (req, res) => {
    try {
      const { userId, itemIndex } = req.body;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Delete cart item by index
      const index = itemIndex.index;
      user.cart.splice(index, 1);
      await user.save();

      res.status(200).json({ message: "Cart item deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// Login POST
// app.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   const user = await User.findOne({ email });
//   if (!user) return res.status(400).send("User not found");

//   const isValidPassword = await bcrypt.compare(password, user.password);
//   if (!isValidPassword)
//     return res.status(401).json({ message: "Invalid credentials" });

//   const token = createToken(user);
//   res.cookie("jwt", token, { httpOnly: true });
//   res.redirect("/protected");
// });

// //////////////////////////////////////////////////////////////////
app.get("/login", async (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = createToken(user);
    res.cookie("jwt", token, { httpOnly: true });

    return res
      .status(200)
      .json({ message: "Login successful", redirect: "/protected" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////

// Protected route
app.get("/protected", authenticateToken, (req, res) => {
  console.log("User ID:", req.user.id);
  res.render("protectedpage", { user: req.user });
});

// Add item to cart routes

app.post("/add-to-cart", authenticateToken, async (req, res) => {
  const { itemName, itemPrice, itemImage } = req.body;
  try {
    const user = await User.findById(req.user.id);
    user.cart.push({ name: itemName, price: itemPrice, image: itemImage });
    await user.save();
    res
      .status(200)
      .json({ message: "Item added to cart", cartLength: user.cart.length });
  } catch (err) {
    console.error("Error adding item to cart:", err);
    res.status(500).json({ message: err.message });
  }
});

////////////////////////////////////////////////////////////////////////////

// cart
app.get("/cart", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const cart = user.cart;
    res.render("cart", { cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/clear-cart", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.cart = [];
    await user.save();
    res.status(200).json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/// //////////////////////////////////////////////////////////////////

app.get("/complete", authenticateToken, (req, res) => {
  res.render("complete");
});
//  ////////////////////////////////////////////////////////////////////
// Logout route
app.get("/logout", (req, res) => {
  res.clearCookie("jwt"); // Clear the jwt cookie
  res.redirect("/login"); // Redirect to login page or any other appropriate page
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
