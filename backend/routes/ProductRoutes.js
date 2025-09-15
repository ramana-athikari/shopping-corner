import express from "express";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct
} from "../controllers/ProductController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// create product with image upload
router.post("/", upload.single("image"), createProduct);   // Create Product
router.get("/", getProducts);                           // Get All or Seller Products
router.put("/:id", updateProduct);                      // Update Product
router.delete("/:id", deleteProduct);                   // Delete Product

export default router;
