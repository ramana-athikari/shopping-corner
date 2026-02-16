import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";

const API_BASE = process.env.REACT_APP_API_URL;

const ManageProduct = () => {
  const [allProduct, setProduct] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderIcon, setIcon] = useState("fa fa-arrow-up");
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  const PER_PAGE = 6;
  const offset = currentPage * PER_PAGE;

  // ✅ Fetch data once on mount
  useEffect(() => {
    const sellerId = localStorage.getItem("sellerId");
    if (sellerId) fetchProducts(sellerId);
  }, []);

  // ✅ Fetch all products of seller
  const fetchProducts = async (sellerId) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/product?sellerId=${sellerId}`);
      const data = await res.json();
      setProduct(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Sort only the already-fetched data
  const sortProducts = () => {
    const sorted = [...allProduct].sort((a, b) =>
      order === "asc" ? a.price - b.price : b.price - a.price
    );
    setProduct(sorted);
    setOrder(order === "asc" ? "desc" : "asc");
    setIcon(order === "asc" ? "fa fa-arrow-down" : "fa fa-arrow-up");
  };

  // ✅ Delete a product and refresh list
  const delPro = async (_id) => {
    try {
      await fetch(`${API_BASE}/api/product/${_id}`, { method: "DELETE" });
      toast.success("Product deleted successfully!", { autoClose: 1500 });

      // remove deleted product from current list without reloading
      setProduct((prev) => prev.filter((p) => p._id !== _id));
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const handlePageClick = ({ selected }) => setCurrentPage(selected);

  // ✅ Filter + Paginate results
  const filtered = allProduct.filter((p) =>
    p.name?.toLowerCase().includes(keyword.toLowerCase())
  );
  const pageCount = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice(offset, offset + PER_PAGE);

  return (
    <div className="container mt-4 container-body-seller">
      {loading ? (
        <div className="text-center mt-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading Products...</p>
        </div>
      ) : allProduct.length === 0 ? (
        <div className="text-center text-muted">
          <h4>No products available</h4>
          <img
            src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
            alt="No Products"
            height="120"
          />
        </div>
      ) : (
        <>
          <div className="row mb-5">
            <div className="col-lg-9 mb-3">
              <h4 className="text-primary">
                Total Products in Inventory: {allProduct.length}
              </h4>
            </div>
            <div className="col-lg-3 mb-3 text-center">
              {/* <input
                type="text"
                className="form-control"
                placeholder="Search..."
                onChange={(e) => setKeyword(e.target.value)}
              /> */}

              <input
                type="text"
                className="form-control"
                placeholder="Search..."
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value);
                  setCurrentPage(0); // ✅ Reset to first page when searching
                }}
              />

            </div>

            <table className="table table-bordered shadow-lg">
              <thead className="table-info">
                <tr>
                  <th>#ID</th>
                  <th>Product Name</th>
                  <th
                    className="bg-warning mypointer"
                    style={{ cursor: "pointer" }}
                    onClick={sortProducts}
                  >
                    <i className={orderIcon}></i> Product Price
                  </th>
                  <th>Stock</th>
                  <th>Details</th>
                  <th>Photo</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className="table table-light shadow-lg">
                {paginated.map((product, index) => (
                  <tr key={index}>
                    <td>{product._id}</td>
                    <td>{product.name}</td>
                    <td>Rs. {product.price}</td>
                    <td>{product.stock}</td>
                    <td>{product.description}</td>
                    <td>
                      <img
                        src={`${API_BASE}${product.image}`}
                        alt={product.name}
                        height="50"
                        width="70"
                      />
                    </td>
                    <td>
                      <button
                        onClick={() => delPro(product._id)}
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
          </div>
        </>
      )}
    </div>
  );
};

export default ManageProduct;



// import { useState, useEffect } from "react";
// import ReactPaginate from "react-paginate";
// import { toast } from "react-toastify";

// const API_BASE = process.env.REACT_APP_API_URL;

// const ManageProduct = () => {
//     let [allProduct, setProduct] = useState([]);
//     let [orderIcon, setIcon] = useState("fa fa-arrow-up");
//     let [order, setOrder] = useState("asc");
//     const [loading, setLoading] = useState(false);

//     const getProduct = async () => {
//         setLoading(true); // start loading
//         try {
//             const sellerId = localStorage.getItem("sellerId"); // Get logged-in sellerId
//             // console.log("Fetching products for sellerId:", sellerId);

//             const response = await fetch(`${API_BASE}/api/product?sellerId=${sellerId}`);
//             const productArray = await response.json();

//             let sortedProducts = [...productArray];

//             if (order === "asc") {
//                 sortedProducts.sort((a, b) => a.pprice - b.pprice);
//                 setOrder("desc");
//                 setIcon("fa fa-arrow-up");
//             } else {
//                 sortedProducts.sort((a, b) => b.pprice - a.pprice);
//                 setOrder("asc");
//                 setIcon("fa fa-arrow-down");
//             }

//             setProduct(sortedProducts); // Show only this user's sorted products
//         } catch (error) {
//             console.error("Error fetching products:", error);
//         } finally {
//             setLoading(false);
//         }
//     };


//     const delPro = (_id) => {
//         let url = `${API_BASE}/api/product/${_id}`;
//         let postdata = { method: "delete" };
//         fetch(url, postdata)
//             .then(res => res.json())
//             .then(pinfo => {
//                 toast.success("Product deleted successfully !", { autoClose: 1500 });
//                 getProduct(); // reload the list after delete
//             })
//     }

//     useEffect(() => {
//         const sellerId = localStorage.getItem("sellerId");
//         if (sellerId) {
//             getProduct(sellerId);
//         }
//     }, [])

//     let [keyword, setKeyword] = useState("");

//     const PER_PAGE = 6; //displays 5 items/records per page
//     const [currentPage, setCurrentPage] = useState(0);
//     function handlePageClick({ selected: selectedPage }) {
//         setCurrentPage(selectedPage)
//     }
//     const offset = currentPage * PER_PAGE;
//     const pageCount = Math.ceil(allProduct.length / PER_PAGE);

//     return (
//         <div className="container mt-4 container-body-seller">
//             {
//                 loading ? (
//                     <div className="text-center mt-5">
//                         <div className="spinner-border text-primary" role="status">
//                             <span className="visually-hidden">Loading...</span>
//                         </div>
//                         <p className="mt-2 text-muted">Loading Products...</p>
//                     </div>
//                 ) :
//                     allProduct.length === 0 ? (
//                         <div className="text-center text-muted">
//                             <h4> No products available </h4>
//                             <img src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png" alt="No Products" height="120" />
//                         </div>
//                     ) : (
//                         <>
//                             <div className="row mb-5">
//                                 <div className="col-lg-9 mb-3">
//                                     <h4 className="text-primary">Total Products in Inventory : {allProduct.length} </h4>
//                                 </div>
//                                 <div className="col-lg-3 mb-3 text-center">
//                                     <input type="text"
//                                         className="form-control"
//                                         placeholder="Search..."
//                                         onChange={obj => setKeyword(obj.target.value)}
//                                     />
//                                 </div>
//                                 <div className="col-lg-12 text-center"></div>
//                                 <table className="table table-bordered shadow-lg">
//                                     <thead className="table-info">
//                                         <tr>
//                                             <th> #ID </th>
//                                             <th> Product Name </th>
//                                             <th className="bg-warning mypointer" onClick={getProduct}> <i className={orderIcon}> </i> Product Price </th>
//                                             <th> Product Stock </th>
//                                             <th> Product Details </th>
//                                             <th> Product Photo </th>
//                                             <th> Action </th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="table table-light shadow-lg">
//                                         {allProduct
//                                             .filter((product) => {
//                                                 const name = product?.name?.toLowerCase() || ""; // ✅ use "name" (not pname)
//                                                 const searchKey = keyword?.toLowerCase() || "";

//                                                 return (
//                                                     name.includes(searchKey) ||
//                                                     product?.price?.toString().includes(keyword) // ✅ check price too
//                                                 );
//                                             })
//                                             .slice(offset, offset + PER_PAGE) // ✅ filter first, then paginate
//                                             .map((product, index) => (
//                                                 <tr key={index}>
//                                                     <td>{product._id}</td>
//                                                     <td>{product.name}</td>
//                                                     <td>Rs. {product.price}</td>
//                                                     <td>{product.stock}</td>
//                                                     <td>{product.description}</td>
//                                                     <td>
//                                                         <img
//                                                             src={`${API_BASE}${product.image}`}
//                                                             alt={product.name}
//                                                             height="50"
//                                                             width="70"
//                                                         />
//                                                     </td>
//                                                     <td>
//                                                         <button
//                                                             onClick={() => delPro(product._id)} // ✅ use _id, not id
//                                                             className="btn btn-danger btn-sm"
//                                                         >
//                                                             <i className="fa fa-trash"></i>
//                                                         </button>
//                                                     </td>
//                                                 </tr>
//                                             ))}

//                                     </tbody>
//                                 </table>
//                                 <div className="mt-4 text-center">
//                                     <ReactPaginate
//                                         previousLabel={"Previous"}
//                                         nextLabel={"Next"}
//                                         breakLabel={"..."}
//                                         pageCount={pageCount}
//                                         marginPagesDisplayed={2}
//                                         pageRangeDisplayed={3}
//                                         onPageChange={handlePageClick}
//                                         containerClassName={"pagination  justify-content-center"}
//                                         pageClassName={"page-item "}
//                                         pageLinkClassName={"page-link"}
//                                         previousClassName={"page-item"}
//                                         previousLinkClassName={"page-link"}
//                                         nextClassName={"page-item"}
//                                         nextLinkClassName={"page-link"}
//                                         breakClassName={"page-item"}
//                                         breakLinkClassName={"page-link"}
//                                         activeClassName={"active primary"}
//                                     />
//                                 </div>
//                             </div>
//                         </>
//                     )
//             }
//         </div >
//     )
// }

// export default ManageProduct;