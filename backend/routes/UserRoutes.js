
import express from "express";
import { signup, login, getUser, updateUser, updatePassword } from "../controllers/AuthController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/:id", getUser);
router.patch("/:id", updateUser);
router.patch("/:id/password", updatePassword);

export default router;
