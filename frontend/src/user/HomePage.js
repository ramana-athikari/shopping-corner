import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import CarouselPage from "./AdvertisementPage";
import { ToastContainer, toast } from "react-toastify";

const API_BASE = process.env.REACT_APP_API_URL;

// const API_BASE = "http://localhost:1234";

const ProductList = () => {
    const [allProduct, setProduct] = useState([]);
    const [order, setOrder] = useState("asc");
    const [keyword, setKeyword] = useState("");
    const [loading, setLoading] = useState(false);

    const [currentPage, setCurrentPage] = useState(0);
    const PER_PAGE = 8;

    const offset = currentPage * PER_PAGE;

    // Recalculate page count after filtering
    const pageCount = Math.ceil(
        allProduct.filter(product =>
            product.name.toLowerCase().includes(keyword.toLowerCase()) ||
            product.price.toString().includes(keyword)
        ).length / PER_PAGE
    );

    // // Fetch products
    // const getProduct = () => {
    //     setLoading(true); // start loading
    //     fetch(`${API_BASE}/api/product`)
    //         .then(res => res.json())
    //         .then(productArray => {
    //             const sortedProducts = [...productArray].sort((a, b) =>
    //                 order === "asc" ? a.price - b.price : b.price - a.price
    //             );
    //             setProduct(sortedProducts);
    //         })
    //         .catch(() => {
    //             toast.error("Failed to fetch products!", { autoClose: 1500 });
    //         })
    //         .finally(() => {
    //             setLoading(false); // stop loading
    //         });
    // };

    // useEffect(() => {
    //     getProduct();
    // }, [order]);

    useEffect(() => {
        const getProducts = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${API_BASE}/api/product`);
                const productArray = await res.json();
                const sortedProducts = [...productArray].sort((a, b) =>
                    order === "asc" ? a.price - b.price : b.price - a.price
                );
                setProduct(sortedProducts);
            } catch (err) {
                toast.error("Failed to fetch products!", { autoClose: 1500 });
            } finally {
                setLoading(false);
            }
        };

        getProducts();
    }, [order]); // ✅ runs only when order changes



    const handleSortChange = () => {
        setOrder(prev => (prev === "asc" ? "desc" : "asc"));
    };

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const addInCart = (product) => {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            toast.error("Please login first!", { autoClose: 1500 });
            return;
        }

        const cartItem = {
            productId: product._id,   // ✅ send productId only
            userId: userId,
            qty: 1
        };

        fetch(`${API_BASE}/api/cart`, {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify(cartItem)
        })
            .then(res => res.json())
            .then(pInfo => {
                toast.success(product.name + " - added to your cart!", { autoClose: 1000 });
            })
            .catch(() => {
                toast.error("Technical Error, Try again later!", { autoClose: 1500 });
            });
    };

    // 🔍 Correct filter with new schema fields
    const filteredProducts = allProduct.filter(product =>
        product.name.toLowerCase().includes(keyword.toLowerCase()) ||
        product.price.toString().includes(keyword)
    );

    return (
        <div className="container mt-4">
            <CarouselPage />
            <ToastContainer />
            <div className="row mb-5">
                <div className="col-lg-5 mb-2 text-center">
                    <div className="input-group">
                        <span className="input-group-text" id="basic-addon1">
                            <i className="fa fa-search"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search..."
                            onChange={e => setKeyword(e.target.value)}
                        />
                    </div>
                </div>
                <div className="col-lg-4"></div>
                <div className="col-lg-3">
                    <select className="form-select" onChange={handleSortChange}>
                        <option>Price Low to High</option>
                        <option>Price High to Low</option>
                    </select>
                </div>
            </div>

            {/* Product cards */}
            <div className="row mt-5">
                {loading ? (
                    <div className="col-12 text-center mt-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2 text-muted">Loading products...</p>
                    </div>
                ) : filteredProducts.length > 0 ? (
                    filteredProducts.slice(offset, offset + PER_PAGE).map((product, index) => (
                        <div key={product._id || index} className="col-lg-3 mb-4">
                            <div className="p-3 shadow-lg rounded-semi-circle homebg">
                                <h4 className="text-primary mb-3">{product.name}</h4>
                                <p className="mt-3 text-center">
                                    <img
                                        src={`${API_BASE}${product.image}`}
                                        alt={product.name}
                                        height="100px"
                                        width="150px"
                                        className="rounded"
                                    />
                                </p>
                                <p className="mt-3 text-danger fs-5">
                                    <i className="fa fa-rupee text-primary"></i> {product.price} /-
                                </p>
                                <p className="mt-3">{product.description?.slice(0, 30)}...</p>
                                <p className="text-center mb-3">
                                    <button
                                        className="me-3 btn btn-warning btn-sm"
                                        onClick={() => addInCart(product)}
                                    >
                                        <i className="fa fa-shopping-cart"></i> Add to Cart
                                    </button>
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12 text-center mt-5">
                        <h4 className="text-muted">No products found</h4>
                    </div>
                )}
            </div>

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
                    containerClassName={"pagination  justify-content-center"}
                    pageClassName={"page-item "}
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
        </div>
    );
};

export default ProductList;
