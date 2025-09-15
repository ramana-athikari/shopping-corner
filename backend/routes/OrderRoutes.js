import express from "express";
import {
  placeOrder,
  getUserOrders,
  updateOrderStatus,
  getOrderById,
  getOrders,
  delOrder,
} from "../controllers/OrderController.js";

const router = express.Router();

// Place new order
router.post("/", placeOrder);

// Get all orders of a specific user
router.get("/user/:userId", getUserOrders);

// Get all orders (Admin)
router.get("/", getOrders);

// Get single order by ID
router.get("/:id", getOrderById);

// Update order status (Admin)
router.put("/:id", updateOrderStatus);

router.delete("/:id", delOrder) 

export default router;
