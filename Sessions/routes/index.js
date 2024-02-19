import express from "express";
import authenticate from "../middleware/authenticate.js";
import authController from "../controllers/auth.js";
import profileController from "../controllers/profile.js";
export const router = express.Router();

router.post("/login", authController);

router.use(authenticate);
//5. plug in all routes that the user has access to if user is logged in
router.get("/profile", profileController);
