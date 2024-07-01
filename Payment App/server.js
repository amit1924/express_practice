import express from "express";
import dotenv from "dotenv";
import Stripe from "stripe";

const app = express();
const port = 3000;
dotenv.config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

app.use(express.json());
app.use(express.static("public"));

app.post("/payment", async (req, res) => {
  const { amount, currency } = req.body;

  try {
    console.log(
      "Creating payment intent with amount:",
      amount,
      "currency:",
      currency
    );
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    });
    console.log("Payment intent created:", paymentIntent);
    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).send({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
