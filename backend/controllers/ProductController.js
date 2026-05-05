
import Product from "../models/ProductSchema.js";

// CREATE PRODUCT
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, sellerId } = req.body;

    const product = new Product({
      name,
      description,
      price,
      category,
      stock,
      sellerId,
      image: req.file ? `/uploads/${req.file.filename}` : null
    });

    await product.save();

    res.status(201).json({
      message: "Product created successfully",
      product
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to create product",
      details: error.message
    });
  }
};



// GET ALL PRODUCTS / SELLER PRODUCTS
export const getProducts = async (req, res) => {
  try {
    const { sellerId } = req.query;

    const query = sellerId ? { sellerId } : {};

    const products = await Product.find(query)
      .populate("sellerId", "fullname email")
      .sort({ createdAt: -1 }); // latest first

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch products",
      details: error.message
    });
  }
};



// GET SINGLE PRODUCT (IMPORTANT FOR DETAILS PAGE)
export const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id)
      .populate("sellerId", "fullname email");

    if (!product) {
      return res.status(404).json({
        error: "Product not found"
      });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch product",
      details: error.message
    });
  }
};



// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        error: "Product not found"
      });
    }

    res.status(200).json({
      message: "Product updated successfully",
      updatedProduct
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to update product",
      details: error.message
    });
  }
};



// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        error: "Product not found"
      });
    }

    res.status(200).json({
      message: "Product deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete product",
      details: error.message
    });
  }
};