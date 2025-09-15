import Product from "../models/ProductSchema.js";
// Add Product
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
      image: req.file ? `/uploads/${req.file.filename}` : null // save image path
    });

    await product.save();
    res.status(201).json({ message: "Product created", product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get Products (all or by seller)
export const getProducts = async (req, res) => {
  try {
    const { sellerId } = req.query;
    let products;

    if (sellerId) {
      products = await Product.find({ sellerId }).populate("sellerId", "fullname email");
    } else {
      products = await Product.find().populate("sellerId", "fullname email");
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products", details: error.message });
  }
};

// Update Product
export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: "Failed to update product", details: error.message });
  }
};

// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product", details: error.message });
  }
};
