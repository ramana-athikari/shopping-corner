import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_URL;

const ProductDetails = () => {
    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [cartLoading, setCartLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${API_BASE}/api/product/${id}`);
                const data = await res.json();

                if (!res.ok) throw new Error(data.error || "Error");

                setProduct(data);
            } catch (err) {
                toast.error("Failed to load product!");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    // ADD TO CART FUNCTION
    const addToCart = async () => {
        const userId = localStorage.getItem("userId");

        if (!userId) {
            toast.error("Please login first!", { autoClose: 1500 });
            return;
        }

        setCartLoading(true);

        const cartItem = {
            productId: product._id,
            userId: userId,
            qty: 1
        };

        try {
            const res = await fetch(`${API_BASE}/api/cart`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(cartItem)
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            toast.success(`${product.name} added to cart!`, {
                autoClose: 1200
            });

        } catch (err) {
            toast.error("Failed to add to cart!");
        } finally {
            setCartLoading(false);
        }
    };

    if (loading) {
        return <h3 className="text-center mt-5">Loading...</h3>;
    }

    if (!product) {
        return <h3 className="text-center mt-5">Product not found</h3>;
    }

    return (
        <div className="container mt-5">
            <button
                className="btn btn-sm btn-outline-secondary mb-3"
                onClick={() => navigate(-1)}
            >
                ← Back
            </button>
            <div className="row">

                {/* Image */}
                <div className="col-md-6 text-center">
                    <img
                        src={`${API_BASE}${product.image}`}
                        alt={product.name}
                        className="img-fluid rounded"
                        style={{ maxHeight: "400px" }}
                    />
                </div>

                {/* Details */}
                <div className="col-md-6">
                    <h2 className="text-primary">{product.name}</h2>

                    <h4 className="text-danger mt-3">
                        ₹ {product.price}
                    </h4>

                    <p className="mt-4">{product.description}</p>

                    <p><b>Category:</b> {product.category}</p>
                    <p>
                        <b>Stock:</b>{" "}
                        {product.stock > 0 ? (
                            <span className="text-success">In Stock</span>
                        ) : (
                            <span className="text-danger">Out of Stock</span>
                        )}
                    </p>

                    {/* ADD TO CART BUTTON */}
                    <button
                        className="btn btn-warning mt-3"
                        onClick={addToCart}
                        disabled={cartLoading || product.stock === 0}
                    >
                        {cartLoading ? "Adding..." : "Add to Cart"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;