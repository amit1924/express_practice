import express from "express";

const router = express.Router();

router.get("/all", (req, res) => {
  res.send("All Student");
});

router.post("/create", (req, res) => {
  res.send("Created Student");
});

export default router;
