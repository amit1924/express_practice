import express from "express";
import { allStudents, newStudent } from "../controllers/student.js";

const router = express.Router();

router.get("/all", allStudents);
router.post("/create", newStudent);

export default router;
