import express from "express";
import { editProfile, getProfileDetails, Login, register } from "../Controllers/auth.controller.js";
import verifyToken from "../../middleware/middleware.js";


const router = express.Router();

router.post("/login", Login);
router.post("/register", register);

//profile edit and getDetails

router.get("/profile",verifyToken,getProfileDetails)
router.put("/profile/edit",verifyToken,editProfile)

export default router;
