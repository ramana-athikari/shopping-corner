import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import Swal from "sweetalert2";

const ManageOrder = () => {
    const [allOrder, setOrder] = useState([]);
    const PER_PAGE = 3;
    const [currentPage, setCurrentPage] = useState(0);

    const sellerId = localStorage.getItem("sellerId");

    // Fetch orders
    const getOrder = async () => {
        if (!sellerId) return;

        try {
            const res = await fetch(`http://localhost:1234/api/order?sellerId=${sellerId}`);
            let orders = await res.json();

            // Filter products per seller
            orders = orders
                .map(order => ({
                    ...order,
                    products: order.products.filter(
                        p => p.productId.sellerId === sellerId // compare string IDs
                    )
                }))
                .filter(order => order.products.length > 0); // remove orders with no products for this seller

            setOrder(orders.reverse());
        } catch (err) {
            console.error("Failed to fetch orders:", err);
        }
    };

    useEffect(() => {
        getOrder();
    }, []);

    // Delete order
    const delOrder = (orderId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await fetch(`http://localhost:1234/api/order/${orderId}`, { method: 'DELETE' });
                    const data = await res.json();
                    if (res.ok) {
                        Swal.fire("Deleted!", "Your order has been deleted.", "success");
                        getOrder();
                    } else {
                        Swal.fire("Error!", data.error || "Failed to delete order.", "error");
                    }
                } catch (err) {
                    console.error(err);
                    Swal.fire("Error!", "Failed to delete order.", "error");
                }
            }
        });
    };

    // Pagination
    const offset = currentPage * PER_PAGE;
    const pageCount = Math.ceil(allOrder.length / PER_PAGE);
    const handlePageClick = ({ selected: selectedPage }) => setCurrentPage(selectedPage);

    return (
        <div className="container mt-4 container-body-seller">
            {allOrder.length === 0 ? (
                <div className="text-center text-muted">
                    <h4>No Orders available</h4>
                    <img src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png" alt="No Orders" height="120" />
                </div>
            ) : (
                <>
                    <h2 className="text-center text-success mb-4">Manage Orders: {allOrder.length}</h2>

                    {allOrder.slice(offset, offset + PER_PAGE).map(order => (
                        <div key={order._id} className="mb-5 border border-2 border-info rounded-2 p-3 shadow-sm">
                            {/* Customer info */}
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <div>
                                    <h5>Order ID: {order._id}</h5>
                                    <p>
                                        Customer: <strong>{order.userId.fullName}</strong> | Email: <strong>{order.userId.email}</strong> | Mobile: <strong> {order.userId.mobile || "N/A"}</strong>
                                    </p>
                                    <p>Address: {order.address}</p>
                                    <p>Date: {new Date(order.orderDate).toLocaleString()}</p>
                                </div>
                                <button onClick={() => delOrder(order._id)} className="btn btn-danger">
                                    Delete Order
                                </button>
                            </div>

                            {/* Products Table */}
                            <table className="table table-bordered text-center">
                                <thead className="table-warning">
                                    <tr>
                                        <th>Item Name</th>
                                        <th>Photo</th>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.products.map(p => (
                                        <tr key={p._id}>
                                            <td>{p.productId.name}</td>
                                            <td>
                                                <img
                                                    src={`http://localhost:1234${p.productId.image}`}  // add backend host
                                                    alt={p.productId.name}
                                                    height="50"
                                                    width="70"
                                                />

                                            </td>
                                            <td>{p.productId.price}</td>
                                            <td>{p.qty}</td>
                                            <td>{p.productId.price * p.qty}</td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td colSpan={4} className="text-end"><b>Order Total:</b></td>
                                        <td><b>{order.totalPrice}</b></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    ))}

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
