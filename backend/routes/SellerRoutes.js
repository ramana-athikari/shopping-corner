import express from "express";
import { signup, login, getSeller, updateSeller, updatePassword } from "../controllers/SellerController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/:id", getSeller);
router.patch("/:id", updateSeller);
router.patch("/:id/password", updatePassword);

export default router;