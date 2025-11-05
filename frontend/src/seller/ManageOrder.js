

import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import Swal from "sweetalert2";

const API_BASE = process.env.REACT_APP_API_URL;

const ManageOrder = () => {
    const [allOrder, setOrder] = useState([]);
    const PER_PAGE = 3;
    const [currentPage, setCurrentPage] = useState(0);
    const sellerId = localStorage.getItem("sellerId");

    // --- Fetch Orders ---
    const getOrder = async () => {
        if (!sellerId) return;
        try {
            const res = await fetch(`${API_BASE}/api/order?sellerId=${sellerId}`);
            let orders = await res.json();

            // Filter products belonging to this seller
            orders = orders
                .map(order => ({
                    ...order,
                    products: order.products.filter(
                        p => p.productId.sellerId === sellerId
                    )
                }))
                .filter(order => order.products.length > 0);

            setOrder(orders.reverse());
        } catch (err) {
            console.error("Failed to fetch orders:", err);
        }
    };

    useEffect(() => {
        getOrder();
    }, []);

    // --- Delete Order ---
    const delOrder = (orderId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This order will be permanently deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await fetch(`${API_BASE}/api/order/${orderId}`, {
                        method: "DELETE",
                    });
                    const data = await res.json();
                    if (res.ok) {
                        Swal.fire("Deleted!", "Order deleted successfully.", "success");
                        getOrder();
                    } else {
                        Swal.fire("Error!", data.error || "Failed to delete order.", "error");
                    }
                } catch (err) {
                    console.error(err);
                    Swal.fire("Error!", "Something went wrong!", "error");
                }
            }
        });
    };

    // --- Update Order (status or payment) ---
    const updateOrder = async (orderId, updates) => {
        try {
            const res = await fetch(`${API_BASE}/api/order/${orderId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates),
            });

            const data = await res.json();
            if (res.ok) {
                Swal.fire("Updated!", "Order updated successfully!", "success");
                getOrder();
            } else {
                Swal.fire("Error!", data.error || "Failed to update order.", "error");
            }
        } catch (err) {
            console.error("Error updating order:", err);
            Swal.fire("Error!", "Something went wrong!", "error");
        }
    };

    // Pagination setup
    const offset = currentPage * PER_PAGE;
    const pageCount = Math.ceil(allOrder.length / PER_PAGE);
    const handlePageClick = ({ selected }) => setCurrentPage(selected);

    return (
        <div className="container mt-4">
            {allOrder.length === 0 ? (
                <div className="text-center text-muted">
                    <h4>No Orders available</h4>
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
                        alt="No Orders"
                        height="120"
                    />
                </div>
            ) : (
                <>
                    <h4 className="text-center text-success mb-4">
                        Manage Orders: {allOrder.length}
                    </h4>

                    {allOrder.slice(offset, offset + PER_PAGE).map(order => (
                        <div
                            key={order._id}
                            className="mb-5 border border-2 border-info rounded-2 p-3 shadow-sm"
                        >
                            {/* Customer info */}
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h5>Order ID: {order._id}</h5>
                                    <p>
                                        Customer: <strong>{order.userId.fullName}</strong> |
                                        Email: <strong>{order.userId.email}</strong> |
                                        Mobile: <strong>{order.userId.mobile || "N/A"}</strong>
                                    </p>
                                    <p>Payment Method: <b> {order.paymentMethod}-{order.paymentStatus} </b></p>
                                    <p>Address: {order.address}</p>
                                    <p>Date: {new Date(order.orderDate).toLocaleString()}</p>

                                    {/* --- Order Status --- */}
                                    <div className="row mt-2">
                                        <div className="col-md-6">
                                            <label className="fw-bold me-2">Status:</label>
                                            <select
                                                className="form-select form-select-sm"
                                                value={order.status}
                                                onChange={(e) =>
                                                    updateOrder(order._id, {
                                                        status: e.target.value,
                                                    })
                                                }
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Processing">Processing</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </div>

                                        <div className="col-md-6">
                                            <label className="fw-bold me-2">Payment:</label>
                                            <select
                                                className="form-select form-select-sm"
                                                value={order.paymentStatus}
                                                onChange={(e) =>
                                                    updateOrder(order._id, {
                                                        paymentStatus: e.target.value,
                                                    })
                                                }
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Paid">Paid</option>
                                                <option value="Failed">Failed</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => delOrder(order._id)}
                                    className="btn btn-danger"
                                >
                                    Delete Order
                                </button>
                            </div>

                            {/* --- Products Table --- */}
                            <table className="table table-sm table-bordered text-center mt-3">
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
                                    {order.products.map(p => (
                                        <tr key={p._id}>
                                            <td>{p.productId.name}</td>
                                            <td>
                                                <img
                                                    src={`${API_BASE}${p.productId.image}`}
                                                    alt={p.productId.name}
                                                    height="50"
                                                    width="70"
                                                />
                                            </td>
                                            <td>₹{p.productId.price}</td>
                                            <td>{p.qty}</td>
                                            <td>₹{p.productId.price * p.qty}</td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td colSpan={4} className="text-end fw-bold">
                                            Order Total:
                                        </td>
                                        <td className="fw-bold">
                                            ₹{order.totalPrice} /-
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    ))}

                    {/* Pagination */}
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

export default ManageOrder;
