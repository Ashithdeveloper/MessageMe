import express from "express";
import { Login, register } from "../Controllers/auth.controller.js";

const router = express.Router();

router.post("/login", Login);
router.post("/register", register);

export default router;
