import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";

const ManageOrder = () =>{
    let [allOrder, setOrder] = useState([]);
    
    const getOrder = () =>{
        fetch("http://localhost:1234/orderapi")
        .then(res=>res.json())
        .then(orderArray=>{
            setOrder(orderArray.reverse());
        })
    }

    useEffect(()=>{
        getOrder();
    },[]);

    // Pagination start

    const PER_PAGE = 3; //displays 5 items/records per page
    const [currentPage, setCurrentPage] = useState(0);
    function handlePageClick({ selected: selectedPage }) {
      setCurrentPage(selectedPage)
    }
    const offset = currentPage * PER_PAGE;
    const pageCount = Math.ceil(allOrder.length / PER_PAGE);

    // Pagination end

    return(
        <div className="container mt-4">
            <div className="row mb-5"> 
                <div className="col-lg-12">
                    <h1 className="text-center text-success"> Manage Order : {allOrder.length} </h1>
                </div>
            </div>

            {
                allOrder.slice(offset, offset + PER_PAGE).map((product,index)=>{
                    return(
                        <div className="row mb-4 shadow-lg rounded p-3" key={index}>
                            <div className="col-lg-3 card shadow p-3">
                                <p className="text-danger"> <b> {product.cname} </b> </p>
                                <p> Mobile No : {product.mobile} </p>
                                <p> Email Id : {product.email} </p>
                                <p> Address : {product.address} </p>
                            </div>
                            <div className="col-lg-9">
                                <h5 className="text-center text-danger mb-3">
                                    Order Id : {product.id} , Date : {product.orderDate}
                                </h5>

                                <table className="table table-bordered text-center">
                                    <thead className="table-warning">
                                        <tr>
                                            <th> Item Name </th>
                                            <th> Photo </th>
                                            <th> Price </th>
                                            <th> Quantity </th>
                                            <th> Total </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            product.myProduct.map((product,index)=>{
                                                return(
                                                    <tr key={index}>
                                                        <td> {product.pname} </td>
                                                        <td> <img src={product.photo} height="50px" width="70px" /> </td>
                                                        <td> {product.pprice} </td>
                                                        <td> {product.qty} </td>
                                                        <td> {product.pprice * product.qty} </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )
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
    )
}

export default ManageOrder;