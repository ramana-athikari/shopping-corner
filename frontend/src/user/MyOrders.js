
import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE = process.env.REACT_APP_API_URL;

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const PER_PAGE = 3; // Number of orders per page

    const getOrders = async () => {
        setLoading(true);
        try {
            const userId = localStorage.getItem("userId");
            if (!userId) {
                toast.error("User not logged in!", { autoClose: 1500 });
                setLoading(false);
                return;
            }

            const res = await fetch(`${API_BASE}/api/order/${userId}`);
            if (!res.ok) throw new Error("Failed to fetch orders");

            const data = await res.json();
            setOrders(data.reverse());
        } catch (err) {
            console.error("Failed to load orders:", err);
            toast.error("Error fetching orders!", { autoClose: 1500 });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getOrders();
    }, []);

    // Pagination logic
    const offset = currentPage * PER_PAGE;
    const pageCount = Math.ceil(orders.length / PER_PAGE);
    const handlePageClick = ({ selected }) => setCurrentPage(selected);

    return (
        <div className="container mt-4">
            <ToastContainer />
            <h4 className="text-success">
                Total Orders: {orders.length}
            </h4>

            {loading ? (
                <div className="text-center mt-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2 text-muted">Loading your orders...</p>
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center text-muted">
                    <h4>No Orders Found</h4>
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
                        alt="No Orders"
                        height="120"
                    />
                </div>
            ) : (
                <>
                    {orders.slice(offset, offset + PER_PAGE).map((order) => (
                        <div
                            key={order._id}
                            className="mb-5 border border-2 border-info rounded-3 p-3 shadow-sm"
                        >
                            {/* --- Order Info --- */}
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div>
                                    <h5>Order ID: {order._id}</h5>

                                    {/* ✅ Customer Info */}
                                    {order.userId ? (
                                        <p className="mb-0">
                                            Customer: <strong>{order.userId.fullName}</strong> | Email: <strong>{order.userId.email}</strong> | Mobile: <strong> {order.userId.mobile || "N/A"}</strong>
                                        </p>
                                    ) : (
                                        <p className="text-muted">Customer info not available</p>
                                    )}

                                    <p>
                                        <b>Placed On:</b>{" "}
                                        {new Date(order.createdAt).toLocaleString("en-IN", {
                                            dateStyle: "medium",
                                            timeStyle: "short",
                                        })}<br />
                                        <b>Payment:</b>{" "}
                                        {order.paymentMethod} - {order.paymentStatus}
                                        <br />
                                        <b>Address:</b> {order.address || "Not provided"}
                                    </p>
                                </div>
                                <div className="text-end">
                                    <span
                                        className={`badge rounded-pill px-3 py-2 ${order.status === "Delivered"
                                                ? "bg-success"
                                                : order.status === "Shipped"
                                                    ? "bg-info text-dark"
                                                    : order.status === "Cancelled"
                                                        ? "bg-danger"
                                                        : "bg-warning text-dark"
                                            }`}
                                    >
                                        {order.status}
                                    </span>
                                </div>
                            </div>

                            {/* --- Product Table --- */}
                            <table className="table table-sm table-bordered text-center">
                                <thead className="table-warning">
                                    <tr>
                                        <th>Item</th>
                                        <th>Photo</th>
                                        <th>Price</th>
                                        <th>Qty</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.products.map((item) => (
                                        <tr key={item._id}>
                                            <td>{item.productId?.name}</td>
                                            <td>
                                                <img
                                                    src={`${API_BASE}${item.productId?.image}`}
                                                    alt={item.productId?.name}
                                                    height="50"
                                                    width="70"
                                                    className="rounded"
                                                />
                                            </td>
                                            <td>₹{item.productId?.price}</td>
                                            <td>{item.qty}</td>
                                            <td>₹{item.productId?.price * item.qty} /-</td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td colSpan={4} className="text-end fw-bold">
                                            Order Total:
                                        </td>
                                        <td className="fw-bold">₹{order.totalPrice} /-</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    ))}

                    {/* --- Pagination --- */}
                    <div className="mt-4 text-center">
                        <ReactPaginate
                            previousLabel={"Previous"}
                            nextLabel={"Next"}
                            breakLabel={"..."}
                            pageCount={pageCount}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={3}
                            onPageChange={handlePageClick}
                            containerClassName={"pagination justify-content-center"}
                            pageClassName={"page-item"}
                            pageLinkClassName={"page-link"}
                            previousClassName={"page-item"}
                            previousLinkClassName={"page-link"}
                            nextClassName={"page-item"}
                            nextLinkClassName={"page-link"}
                            breakClassName={"page-item"}
                            breakLinkClassName={"page-link"}
                            activeClassName={"active primary"}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default MyOrders;
