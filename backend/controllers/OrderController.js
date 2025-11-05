import Order from "../models/OrderSchema.js";
import Cart from "../models/CartSchema.js"; // if you want to clear cart after placing order
import mongoose from "mongoose";

// --- Place a new order ---
export const placeOrder = async (req, res) => {
    try {
        // console.log("Incoming Order Payload:", req.body); // 👈 Debug

        const { userId, customer, items, totals, payment, orderDate } = req.body;

        // Validate required fields
        if (!userId) {
            return res.status(400).json({ error: "userId is required" });
        }

        if (!customer || !customer.address) {
            return res.status(400).json({ error: "Customer address is required" });
        }

        if (!items || items.length === 0) {
            return res.status(400).json({ error: "No items in order" });
        }

        // Map payment method to enum
        let method = payment?.method || "COD";
        if (method === "Cash") method = "COD"; // map legacy 'Cash' to 'COD'

        // Create new order
        const order = new Order({
            userId,
            customer,
            address: customer.address, // required by schema
            products: items.map((i) => ({
                productId: i.productId,
                name: i.name,
                price: i.price,
                qty: i.qty,
                image: i.image,
                sellerId: i.sellerId,
            })),
            totalPrice: totals?.grandTotal || 0,
            paymentMethod: method, // must match enum
            status: "Pending",
            paymentStatus: method === "COD" ? "Pending" : "Paid",
            orderDate: orderDate || new Date(),
        });

        // Save order
        await order.save();

        // Clear user's cart
        await Cart.deleteMany({ userId });

        res.status(201).json({ message: "Order placed successfully", order });
    } catch (err) {
        console.error("Order error:", err);
        // Send detailed Mongoose validation errors if available
        if (err.name === "ValidationError") {
            const errors = Object.values(err.errors).map((e) => e.message);
            return res.status(400).json({ error: errors.join(", ") });
        }
        res.status(500).json({ error: err.message });
    }
};

// // --- Get all orders of a user ---
// export const getUserOrders = async (req, res) => {
//     try {
//         const { userId } = req.params;

//         const orders = await Order.find({ userId })
//             .populate("products.productId") // to show product details
//             .sort({ createdAt: -1 });

//         res.json(orders);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

// --- Get all orders of a user ---
export const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.params;

        const orders = await Order.find({ userId })
            .populate("userId", "fullName email mobile") // ✅ populate customer details
            .populate("products.productId")              // ✅ include product details
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Get all orders for seller
export const getOrders = async (req, res) => {
  try {
    const { sellerId } = req.query;
    const sellerObjectId = sellerId ? new mongoose.Types.ObjectId(sellerId) : null;

    const orders = await Order.find()
      .populate("userId", "fullName email mobile") // populate user info
      .populate({
        path: "products.productId",
        select: "name price image sellerId" // populate the fields you need
      })
      .sort({ createdAt: -1 });

    let filteredOrders = orders;

    if (sellerObjectId) {
      filteredOrders = orders
        .map(order => {
          const filteredProducts = order.products.filter(
            p => p.productId?.sellerId._id.toString() === sellerId
          );
          return { ...order.toObject(), products: filteredProducts };
        })
        .filter(order => order.products.length > 0);
    }

    res.json(filteredOrders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// --- Update order status (Admin only) ---
export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params; // orderId
        const { status, paymentStatus } = req.body;

        const order = await Order.findById(id);
        if (!order) return res.status(404).json({ error: "Order not found" });

        if (status) order.status = status;
        if (paymentStatus) order.paymentStatus = paymentStatus;

        await order.save();

        res.json({ message: "Order updated successfully", order });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// --- Get single order details ---
export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findById(id)
            .populate("userId", "name email")
            .populate("products.productId");

        if (!order) return res.status(404).json({ error: "Order not found" });

        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE /api/order/:id
export const delOrder = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid order ID" });
    }

    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ message: "Order deleted successfully", order: deletedOrder });
  } catch (err) {
    console.error("Error deleting order:", err);
    res.status(500).json({ error: "Server error" });
  }
};