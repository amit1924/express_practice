import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
// Load environment variables
dotenv.config();
import Stripe from "stripe";

// Initialize Stripe with your secret key
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Initialize express app
const app = express();
app.use(express.json());
const PORT = 3000;

// Resolve __filename and __dirname since they are not available in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Route for the root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// POST route to create a checkout session
app.post("/checkout", async (req, res) => {
  const cartItems = req.body.cartItems;

  // Create line items for Stripe checkout
  const lineItems = cartItems.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.name,
      },
      unit_amount: item.price * 100, // Stripe expects amount in cents
    },
    quantity: 1,
  }));
  console.log(`lineItems: ${lineItems}`);

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      // shipping_address_collection: {
      //   allowed_countries: ["US", "BR"],
      // },
      success_url: `http://localhost:3000/complete?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: "http://localhost:3000/cancel",
    });
    console.log(session);

    res.json({ url: session.url });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/complete", async (req, res) => {
  const sessionId = req.query.session_id;

  try {
    // Retrieve the session with expanded payment intent and payment method details
    const sessionPromise = stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent.payment_method"],
    });

    // Fetch line items associated with the session
    const lineItemsPromise = stripe.checkout.sessions.listLineItems(sessionId);

    // Execute both promises concurrently using Promise.all
    const result = await Promise.all([sessionPromise, lineItemsPromise]);

    console.log(JSON.stringify(result));

    res.sendFile(path.join(__dirname, "public", "index.html"));
  } catch (error) {
    console.error("Error retrieving Stripe session:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/cancel", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "cart.html"));
});

// Start the server and listen on PORT
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
