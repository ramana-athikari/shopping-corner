import Cart from "../models/CartSchema.js";

// --- Add to cart ---
export const addToCart = async (req, res) => {
  try {
    const { userId, productId, qty } = req.body;

    let cartItem = await Cart.findOne({ userId, productId });

    if (cartItem) {
      cartItem.qty += qty || 1;
      await cartItem.save();
    } else {
      cartItem = new Cart({ userId, productId, qty: qty || 1 });
      await cartItem.save();
    }

    res.json(cartItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- Get cart ---
export const getCart = async (req, res) => {
  try {
    const { userId } = req.query;
    const cartItems = await Cart.find({ userId }).populate("productId");
    res.json(cartItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- Update qty ---
export const updateCartQuantity = async (req, res) => {
  try {
    const { id } = req.params; // this is productId
    const { userId, qty } = req.body;

    const cartItem = await Cart.findOne({ userId, productId: id });

    if (!cartItem) return res.status(404).json({ error: "Cart item not found" });

    cartItem.qty = qty;
    await cartItem.save();

    res.json(cartItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// // --- Remove from cart ---
// export const removeFromCart = async (req, res) => {
//   try {
//     const { id } = req.params; // productId comes here
//     const { userId } = req.body;

//     await Cart.findOneAndDelete({ userId, productId: id });

//     res.json({ message: "Item removed from cart" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

export const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const deletedItem = await Cart.findOneAndDelete({ userId, productId:id });

    if (!deletedItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    res.json({ message: "Item removed from cart" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- Clear entire cart ---
export const clearCart = async (req, res) => {
  try {
    const { userId } = req.query; // frontend will send ?userId=123
    if (!userId) return res.status(400).json({ error: "userId required" });

    await Cart.deleteMany({ userId });
    res.json({ message: "Cart cleared successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};