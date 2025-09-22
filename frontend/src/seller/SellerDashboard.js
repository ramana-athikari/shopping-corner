import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_URL;

const MyDashboard = () => {
    const [allProduct, setProduct] = useState([]);
    const [allOrder, setOrder] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [error, setError] = useState("");

    const getProduct = async (sellerId) => {
        try {
            setLoadingProducts(true);
            const res = await fetch(`${API_BASE}/api/product?sellerId=${sellerId}`);
            if (!res.ok) throw new Error("Failed to fetch products");
            const pArray = await res.json();
            setProduct(pArray);
        } catch (err) {
            console.error("Product fetch error:", err);
            setError("Failed to load products.");
        } finally {
            setLoadingProducts(false);
        }
    };

    const getOrder = async (sellerId) => {
        try {
            setLoadingOrders(true);
            const res = await fetch(`${API_BASE}/api/order?sellerId=${sellerId}`);
            if (!res.ok) throw new Error("Failed to fetch orders");
            const orderArray = await res.json();
            setOrder(orderArray);
        } catch (err) {
            console.error("Order fetch error:", err);
            setError("Failed to load orders.");
        } finally {
            setLoadingOrders(false);
        }
    };

    useEffect(() => {
        const sellerId = localStorage.getItem("sellerId");
        if (sellerId) {
            getProduct(sellerId);
            getOrder(sellerId);
        }
    }, []);

    return (
        <div className="container mt-4 container-body-seller">
            <div className="row mb-5">
                <div className="col-lg-12 mb-4">
                    <h1 className="text-center text-dark"> Seller Dashboard </h1>
                    {error && <p className="text-danger text-center">{error}</p>}
                </div>

                <div className="row text-center">
                    <div className="col-lg-4">
                        <Link to="/inventary" className="text-decoration-none text-primary">
                            <i className="fa fa-suitcase fa-3x"> </i>
                            <h4>
                                Total Product - {loadingProducts ? "Loading..." : allProduct.length || 0}
                            </h4>
                        </Link>
                    </div>
                    <div className="col-lg-4">
                        <Link to="/order" className="text-decoration-none text-warning">
                            <i className="fa fa-headset fa-3x"> </i>
                            <h4>
                                Order Received - {loadingOrders ? "Loading..." : allOrder.length || 0}
                            </h4>
                        </Link>
                    </div>
                    <div className="col-lg-4">
                        <Link to="/new-inventary" className="text-decoration-none text-success">
                            <i className="fa fa-plus fa-3x"> </i>
                            <h4> Add Product </h4>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyDashboard;
