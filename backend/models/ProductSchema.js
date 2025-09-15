
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    default: 0,
  },
  image: {
    type: String, // store image URL or file path
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seller", // Reference Seller model
    required: true,
  },
}, {
  timestamps: true, // createdAt & updatedAt automatically
});

const Product = mongoose.model("Product", productSchema);

export default Product;
