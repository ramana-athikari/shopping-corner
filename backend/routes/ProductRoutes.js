
import express from "express";
import {
  createProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct
} from "../controllers/ProductController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Create Product
router.post("/", upload.single("image"), createProduct);

// Get all products or seller products
router.get("/", getProducts);

// Get single product by ID
router.get("/:id", getSingleProduct);

// Update Product
router.put("/:id", updateProduct);

// Delete Product
router.delete("/:id", deleteProduct);

export default router;