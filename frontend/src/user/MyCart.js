import { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";

const API_BASE = process.env.REACT_APP_API_URL;

const MyCart = () => {
    const [allproduct, setproduct] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [upiQRCode, setUpiQRCode] = useState("");
    const [customer, setcustomer] = useState({});
    const formRef = useRef();
    const [loading, setLoading] = useState(false);

    const imageUrl = (img) => (img?.startsWith("http") ? img : `${API_BASE}${img}`);

    const calculateTotalCost = (products) => {
        return products.reduce((total, p) => {
            const price = Number(p.productId?.price || p.price || 0);
            const qty = Number(p.qty) || 0;
            return total + price * qty;
        }, 0);
    };

    const getproduct = async () => {
        setLoading(true); // start loading
        try {
            const userId = localStorage.getItem("userId");
            // if (!userId) {
            //     toast.error("User not logged in!", { autoClose: 1500 });
            //     setLoading(false);
            //     return;
            // }
            const res = await fetch(`${API_BASE}/api/cart?userId=${userId}`);
            const cartItems = await res.json();

            const merged = [];
            cartItems.forEach((item) => {
                const i = merged.findIndex(
                    (p) =>
                        p.name === item.name &&
                        p.price === item.price &&
                        p.image === item.image &&
                        p.sellerId === item.sellerId
                );
                if (i >= 0) {
                    merged[i].qty += Number(item.qty) || 1;
                    merged[i].mergedIds.push(item._id);
                } else {
                    merged.push({
                        ...item,
                        price: Number(item.productId?.price) || 0,
                        qty: Number(item.qty) || 1,
                        name: item.productId?.name || item.name || "No Name",
                        image: item.productId?.image || item.image || "",
                        sellerId: item.productId?.sellerId || item.sellerId || "",
                        mergedIds: [item._id],
                    });
                }
            });

            setproduct(merged);
        } catch (e) {
            console.error(e);
            // toast.error("Failed to load cart.", {autoClose:1500});
        } finally {
            setLoading(false); // stop loading
        }
    };

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (userId) {
            getproduct(); // ✅ load only once at page load
        }
    }, []);

    const removeFromCart = async (productId) => {
        try {
            const userId = localStorage.getItem("userId");

            // ✅ Delete in backend
            await fetch(`${API_BASE}/api/cart/${productId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });

            // ✅ Remove locally
            setproduct((prev) =>
                prev.filter((item) => item.productId?._id !== productId && item._id !== productId)
            );

            toast.info("Removed from cart!", { autoClose: 1500 });
        } catch (error) {
            console.error("Error removing item:", error);
            toast.error("Failed to remove item.");
        }
    };

    const updateQty = async (item, action) => {
        const newQty = Number(item.qty) + (action === "Y" ? 1 : -1);

        if (newQty <= 0) {
            return removeFromCart(item.productId?._id || item._id);
        }

        const userId = localStorage.getItem("userId");
        const productId = item.productId?._id || item._id;

        try {
            // ✅ Update backend
            await fetch(`${API_BASE}/api/cart/${productId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, qty: newQty }),
            });

            // ✅ Update frontend immediately (without refetch)
            setproduct((prev) =>
                prev.map((p) =>
                    (p.productId?._id || p._id) === productId
                        ? { ...p, qty: newQty }
                        : p
                )
            );
        } catch (err) {
            console.error("Error updating quantity:", err);
            toast.error("Failed to update quantity");
        }
    };

    const pickValue = (e) => {
        setcustomer({ ...customer, [e.target.name]: e.target.value });
    };

    const handlePaymentMethodChange = (e) => {
        const method = e.target.value;
        setPaymentMethod(method);

        if (method === "UPI") {
            const upiId = "";
            const merchantName = "";
            const amount = calculateTotalCost(allproduct).toFixed(2);
            const upiLink = `upi://pay?pa=${upiId}&pn=${merchantName}&mc=0000&tid=${Date.now()}&tn=Payment%20for%20order&am=${amount}&cu=INR`;
            const qr = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
                upiLink
            )}&size=200x200`;
            setUpiQRCode(qr);
        } else {
            setUpiQRCode("");
        }
    };

    const clearCart = async () => {
        const userId = localStorage.getItem("userId");
        const res = await fetch(`${API_BASE}/api/cart?userId=${userId}`);
        const items = await res.json();

        await Promise.all(
            items.map((it) =>
                fetch(`${API_BASE}/api/cart/${it._id}`, { method: "DELETE" })
            )
        );
    };

    const save = async () => {
        const userId = localStorage.getItem("userId");

        if (!customer?.address) {
            toast.error("Please enter shipping address.");
            return;
        }

        const subtotal = calculateTotalCost(allproduct);

        const payload = {
            userId,
            customer,
            items: allproduct.map((p) => ({
                productId: p.productId?._id || p._id,
                name: p.name || "No Name",
                price: p.price || 0,
                qty: Number(p.qty) || 1,
                image: p.image || "",
                sellerId: p.sellerId || "",
            })),
            totals: { grandTotal: subtotal },
            payment: { method: paymentMethod || "COD" },
            orderDate: new Date(),
        };

        try {
            const res = await fetch(`${API_BASE}/api/order`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed to place order");

            toast.success("Order placed successfully!", { autoClose: 1500 });
        } catch (err) {
            console.error("Order Error:", err);
            toast.error("Order failed. Try again.");
        }
    };

    const handlePaymentConfirmation = async (e) => {
        e.preventDefault();

        try {
            await save();
            formRef.current?.reset();
            await clearCart();
            setproduct([]);
            setcustomer({});
            setPaymentMethod("");
            setUpiQRCode("");
            getproduct();
        } catch (err) {
            console.error("Order placement failed:", err);
            toast.error("Failed to confirm payment. Please try again.");
        }
    };

    const totalCost = calculateTotalCost(allproduct);

    return (
        <div className="container mt-4 container-body-user">
            <ToastContainer />
            {
                loading ? (
                    <div className="col-12 text-center mt-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2 text-muted">Loading Cart...</p>
                    </div>
                ) :
                    allproduct.length === 0 ? (
                        <div className="text-center text-muted">
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
                                alt="Empty Cart"
                                width="100"
                                className="d-block mx-auto mt-4"
                            />
                            <p className="text-center text-muted mt-2">Your cart is empty.</p>
                        </div>
                    ) : (
                        <div className="row">
                            <div className="col-lg-8 text-center">
                                <h3>{allproduct.length} - Items in My Cart</h3>
                                <div className="table-responsive overflow-auto scroll-table">
                                    <table className="table table-bordered">
                                        <thead className="table-warning">
                                            <tr>
                                                <th>Item</th>
                                                <th>Photo</th>
                                                <th>Price</th>
                                                <th>Qty</th>
                                                <th>Total</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {allproduct.map((item) => {
                                                const product = item.productId || {};
                                                return (
                                                    <tr key={item._id}>
                                                        <td>{product.name || item.name || "No Name"}</td>
                                                        <td>
                                                            <img
                                                                src={imageUrl(product.image || item.image)}
                                                                alt={product.name || item.name || "No Image"}
                                                                height="30"
                                                                width="40"
                                                            />
                                                        </td>
                                                        <td>₹{Number(product.price || item.price || 0).toFixed(2)}</td>
                                                        <td>
                                                            <div className="d-flex justify-content-center align-items-center">
                                                                <button
                                                                    className="btn btn-warning btn-sm me-2"
                                                                    onClick={() => updateQty(item, "N")}
                                                                >
                                                                    -
                                                                </button>
                                                                {item.qty}
                                                                <button
                                                                    className="btn btn-info btn-sm ms-2"
                                                                    onClick={() => updateQty(item, "Y")}
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            ₹{(Number(product.price || item.price || 0) * Number(item.qty)).toFixed(2)}
                                                        </td>
                                                        <td>
                                                            <button
                                                                className="btn btn-danger btn-sm"
                                                                onClick={() => removeFromCart(product._id || item._id)}
                                                            >
                                                                <i className="fa fa-trash"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                            <tr>
                                                <td colSpan={6} className="text-end pe-4 text-primary">
                                                    <b>Final Price ₹ {totalCost.toFixed(2)}</b>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="col-lg-4">
                                <form ref={formRef} onSubmit={handlePaymentConfirmation}>
                                    <div className="p-3 shadow">
                                        <h3>Customer Details</h3>

                                        <div className="mb-2">
                                            <label>Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="cname"
                                                onChange={pickValue}
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <label>Mobile</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="mobile"
                                                onChange={pickValue}
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <label>Email</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                name="email"
                                                onChange={pickValue}
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <label>Address</label>
                                            <textarea
                                                className="form-control"
                                                name="address"
                                                onChange={pickValue}
                                            />
                                        </div>

                                        <div className="mb-2 row">
                                            <label>Payment Method:</label>
                                            {["UPI", "Cash"].map((m) => (
                                                <div key={m} className="form-check col-lg-6 mt-1">
                                                    <input
                                                        type="radio"
                                                        id={m}
                                                        className="form-check-input ms-1 me-1"
                                                        name="paymentMethod"
                                                        value={m}
                                                        checked={paymentMethod === m}
                                                        onChange={handlePaymentMethodChange}
                                                    />
                                                    <label className="form-check-label" htmlFor={m}>
                                                        {m}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>

                                        {paymentMethod === "UPI" && upiQRCode && (
                                            <div className="mt-3 text-center">
                                                <h6>Scan to Pay</h6>
                                                <img src={upiQRCode} alt="UPI QR" />
                                            </div>
                                        )}

                                        <div className="text-center mt-3">
                                            <button
                                                type="submit"
                                                className="btn btn-success"
                                                disabled={allproduct.length === 0}
                                            >
                                                Complete Payment
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )
            }
        </div>
    );
};

export default MyCart;
