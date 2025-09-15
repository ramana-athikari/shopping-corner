import express from "express";
import { addToCart, getCart, removeFromCart, updateCartQuantity, clearCart} from "../controllers/CartController.js";

const router = express.Router();

router.post("/", addToCart);       // Add or update cart
router.get("/", getCart);          // Get cart items
router.delete("/:id", removeFromCart); // Remove/decrement cart item
router.put("/:id", updateCartQuantity); // update the quantity
router.delete("/", clearCart); // Clear all items by userId

export default router;
