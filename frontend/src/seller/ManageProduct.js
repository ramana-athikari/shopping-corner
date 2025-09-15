import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";

const ManageProduct = () => {
    let [allProduct, setProduct] = useState([]);
    let [orderIcon, setIcon] = useState("fa fa-arrow-up");
    let [order, setOrder] = useState("asc");

    const getProduct = async () => {
        try {
            const sellerId = localStorage.getItem("sellerId"); // Get logged-in sellerId
            // console.log("Fetching products for sellerId:", sellerId);

            const response = await fetch(`http://localhost:1234/api/product?sellerId=${sellerId}`);
            const productArray = await response.json();

            let sortedProducts = [...productArray];

            if (order === "asc") {
                sortedProducts.sort((a, b) => a.pprice - b.pprice);
                setOrder("desc");
                setIcon("fa fa-arrow-up");
            } else {
                sortedProducts.sort((a, b) => b.pprice - a.pprice);
                setOrder("asc");
                setIcon("fa fa-arrow-down");
            }

            setProduct(sortedProducts); // Show only this user's sorted products
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };


    const delPro = (_id) => {
        let url = "http://localhost:1234/api/product/" + _id;
        let postdata = { method: "delete" };
        fetch(url, postdata)
            .then(res => res.json())
            .then(pinfo => {
                toast.success("Product deleted successfully !", {autoClose:1500});
                getProduct(); // reload the list after delete
            })
    }

    useEffect(() => {
        getProduct();
    }, [])

    let [keyword, setKeyword] = useState("");

    const PER_PAGE = 6; //displays 5 items/records per page
    const [currentPage, setCurrentPage] = useState(0);
    function handlePageClick({ selected: selectedPage }) {
        setCurrentPage(selectedPage)
    }
    const offset = currentPage * PER_PAGE;
    const pageCount = Math.ceil(allProduct.length / PER_PAGE);

    return (
        <div className="container mt-4 container-body-seller">
            {
                allProduct.length === 0 ? (
                    <div className="text-center text-muted">
                        <h4> No products available </h4>
                        <img src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png" alt="No Products" height="120" />
                    </div>
                ) : (
                    <>
                        <div className="row mb-5">
                            <div className="col-lg-9 mb-3">
                                <h4 className="text-primary">Total Products in Inventory : {allProduct.length} </h4>
                            </div>
                            <div className="col-lg-3 mb-3 text-center">
                                <input type="text"
                                    className="form-control"
                                    placeholder="Search..."
                                    onChange={obj => setKeyword(obj.target.value)}
                                />
                            </div>
                            <div className="col-lg-12 text-center"></div>
                            <table className="table table-bordered shadow-lg">
                                <thead className="table-info">
                                    <tr>
                                        <th> #ID </th>
                                        <th> Product Name </th>
                                        <th className="bg-warning mypointer" onClick={getProduct}> <i className={orderIcon}> </i> Product Price </th>
                                        <th> Product Stock </th>
                                        <th> Product Details </th>
                                        <th> Product Photo </th>
                                        <th> Action </th>
                                    </tr>
                                </thead>
                                <tbody className="table table-light shadow-lg">
                                    {allProduct
                                        .filter((product) => {
                                            const name = product?.name?.toLowerCase() || ""; // ✅ use "name" (not pname)
                                            const searchKey = keyword?.toLowerCase() || "";

                                            return (
                                                name.includes(searchKey) ||
                                                product?.price?.toString().includes(keyword) // ✅ check price too
                                            );
                                        })
                                        .slice(offset, offset + PER_PAGE) // ✅ filter first, then paginate
                                        .map((product, index) => (
                                            <tr key={index}>
                                                <td>{product._id}</td>
                                                <td>{product.name}</td>
                                                <td>Rs. {product.price}</td>
                                                <td>{product.stock}</td>
                                                <td>{product.description}</td>
                                                <td>
                                                    <img
                                                        src={`http://localhost:1234${product.image}`}
                                                        alt={product.name}
                                                        height="50"
                                                        width="70"
                                                    />
                                                </td>
                                                <td>
                                                    <button
                                                        onClick={() => delPro(product._id)} // ✅ use _id, not id
                                                        className="btn btn-danger btn-sm"
                                                    >
                                                        <i className="fa fa-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}

                                </tbody>
                            </table>
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
                    </>
                )
            }
        </div >
    )
}

export default ManageProduct;