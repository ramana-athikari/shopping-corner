import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import CarouselPage from "./AdvertisementPage";
import { ToastContainer, toast } from "react-toastify";

const ProductList = () => {
    const [allProduct, setProduct] = useState([]);
    const [order, setOrder] = useState("asc");
    const [keyword, setKeyword] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const PER_PAGE = 8;

    const offset = currentPage * PER_PAGE;
    const pageCount = Math.ceil(
        allProduct.filter(product =>
            product.pname.toLowerCase().includes(keyword.toLowerCase()) ||
            product.pprice.toString().includes(keyword)
        ).length / PER_PAGE
    );

    const getProduct = () => {
        fetch("http://localhost:1234/productapi")
            .then(res => res.json())
            .then(productArray => {
                const sortedProducts = [...productArray].sort((a, b) =>
                    order === "asc" ? a.pprice - b.pprice : b.pprice - a.pprice
                );
                setProduct(sortedProducts);
            });
    };

    useEffect(() => {
        getProduct();
    }, [order]);

    const handleSortChange = (e) => {
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
            ...product,
            qty: 1,
            userId: userId
        };

        fetch("http://localhost:1234/cartapi", {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify(cartItem)
        })
            .then(res => res.json())
            .then(pInfo => {
                toast.success(pInfo.pname + " - added to your cart!", { autoClose: 1000 });
            })
            .catch(() => {
                toast.error("Technical Error, Try again later!", { autoClose: 1500 });
            });
    };


    const filteredProducts = allProduct.filter(product =>
        product.pname.toLowerCase().includes(keyword.toLowerCase()) ||
        product.pprice.toString().includes(keyword)
    );

    return (
        <div className="container mt-4">
            <CarouselPage />
            <ToastContainer />
            <div className="row mb-5">
                {/* <div className="col-lg-2"> </div> */}
                <div className="col-lg-5 mb-2 text-center">
                    <div className="input-group">
                        <span class="input-group-text" id="basic-addon1"> <i className="fa fa-search"></i> </span>
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

            <div className="row mt-5">
                {
                    filteredProducts.slice(offset, offset + PER_PAGE).map((product, index) => (
                        <div key={index} className="col-lg-3 mb-4">
                            <div className="p-3 shadow-lg rounded-semi-circle homebg">
                                <h4 className="text-primary mb-3">{product.pname}</h4>
                                <p className="mt-3 text-center">
                                    <img src={product.photo} alt="product" height="100px" width="150px" className="rounded" />
                                </p>
                                <p className="mt-3 text-danger fs-5">
                                    <i className="fa fa-rupee text-primary"> . </i> {product.pprice} /-
                                </p>
                                <p className="mt-3">{product.pdetails.slice(0, 30)}</p>
                                <p className="text-center mb-3">
                                    <button className="me-3 btn btn-warning btn-sm" onClick={() => addInCart(product)}>
                                        <i className="fa fa-shopping-cart"> </i> Add to Cart
                                    </button>
                                </p>
                            </div>
                        </div>
                    ))
                }
            </div>

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
