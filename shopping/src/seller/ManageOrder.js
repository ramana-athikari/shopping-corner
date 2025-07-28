import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import Swal from "sweetalert2";

const ManageOrder = () => {
    let [allOrder, setOrder] = useState([]);

    const getOrder = () => {
        const sellerId = localStorage.getItem("sellerId")

        fetch(`http://localhost:1234/orderapi?sellerId=${sellerId}`)
            .then(res => res.json())
            .then(orderArray => {
                setOrder(orderArray.reverse());
            })
    }

    useEffect(() => {
        getOrder();
    }, []);

    const delOrder = (productId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                let url = `http://localhost:1234/orderapi/${productId}`;
                let postData = { method: 'delete' };
                try {
                    fetch(url, postData)
                        .then(res => res.json())
                        .then(pDetails => {
                            Swal.fire({
                                title: "Deleted!",
                                text: "Your Order has been deleted.",
                                icon: "success"
                            });
                            getOrder();
                        })
                } catch (error) {
                    console.error(error);
                    alert("Error while Deleting !")
                }
            }
        });
    }

    // Pagination start

    const PER_PAGE = 3; //displays 5 items/records per page
    const [currentPage, setCurrentPage] = useState(0);
    function handlePageClick({ selected: selectedPage }) {
        setCurrentPage(selectedPage)
    }
    const offset = currentPage * PER_PAGE;
    const pageCount = Math.ceil(allOrder.length / PER_PAGE);

    // Pagination end

    return (
        <div className="container mt-4 container-body-seller">

            {
                allOrder.length === 0 ? (
                    <div className="text-center text-muted">
                        <h4> No Orders available </h4>
                        <img src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png" alt="No Products" height="120" />
                    </div>
                ) : (
                    <>
                        <div className="row mb-5">
                            <div className="col-lg-12 mb-2">
                                <h1 className="text-center text-success"> Manage Order : {allOrder.length} </h1>
                            </div>
                            {
                                allOrder
                                    .slice() // clone array to avoid mutating state
                                    .reverse() // show most recent orders first
                                    .slice(offset, offset + PER_PAGE) // apply pagination
                                    .map((product, index) => {
                                        return (
                                            <div className="row mb-4 shadow-lg rounded p-3" key={index}>
                                                <div className="col-lg-3 card shadow p-3">
                                                    <p className="text-danger"> <b> {product.cname} </b> </p>
                                                    <p> Mobile No : {product.mobile} </p>
                                                    <p> Email Id : {product.email} </p>
                                                    <p> Address : {product.address} </p>
                                                    <p>
                                                        <button onClick={delOrder.bind(this, product.id)} className="btn btn-danger">
                                                            Delete
                                                        </button>
                                                    </p>
                                                </div>
                                                <div className="col-lg-9">
                                                    <h5 className="text-center text-danger mb-3">
                                                        Order Id : {product.id}, Date : {product.orderDate}
                                                    </h5>

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
                                                            {product.myProduct.map((product, index) => (
                                                                <tr key={index}>
                                                                    <td>{product.pname}</td>
                                                                    <td>
                                                                        <img src={product.photo} alt="product" height="50px" width="70px" />
                                                                    </td>
                                                                    <td>{product.pprice}</td>
                                                                    <td>{product.qty}</td>
                                                                    <td>{product.pprice * product.qty}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        );
                                    })
                            }

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
        </div>
    )
}

export default ManageOrder;