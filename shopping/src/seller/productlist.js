import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";

const MyProduct = () =>{
    let [allProduct, setProduct] = useState( [] );
    let [orderIcon, setIcon] = useState("fa fa-arrow-up");
    let [order, setOrder] = useState("asc");

    const getProduct = () =>{
        fetch("http://localhost:1234/productapi")
        .then(res=>res.json())
        .then(productArray=>{
            if(order=="asc"){
                productArray.sort((a, b)=> a.pprice - b.pprice);
                setProduct(productArray);
                setOrder("desc");
                setIcon("fa fa-arrow-up");
            }else{
                productArray.sort((a,b)=> b.pprice - a.pprice);
                setProduct(productArray);
                setOrder("asc");
                setIcon("fa fa-arrow-down");
            }
        })
    }

    const delPro = (pid) =>{
        let url = "http://localhost:1234/productapi/"+pid;
        let postdata = {method:"delete"};
        fetch(url, postdata)
        .then(res=>res.json())
        .then(pinfo=>{
            alert(pinfo.pname + " Deleted Successfully !");
            getProduct(); // reload the list after delete
        })
    }

    useEffect(()=>{
        getProduct();
    },[])

    let [keyword, setKeyword] = useState("");

    const PER_PAGE = 5; //displays 5 items/records per page
    const [currentPage, setCurrentPage] = useState(0);
    function handlePageClick({ selected: selectedPage }) {
      setCurrentPage(selectedPage)
    }
    const offset = currentPage * PER_PAGE;
    const pageCount = Math.ceil(allProduct.length / PER_PAGE);
    
    return(
        <div className="container mt-4">
            <div className="row mb-5">
                <div className="col-lg-9">
                    <h3 className="text-center text-info"> {allProduct.length} : Product in Inventory </h3>
                </div>
                <div className="col-lg-3 text-center">
                    <input type="text" 
                        className="form-control" 
                        placeholder="Search..." 
                        onChange={obj=>setKeyword(obj.target.value)}
                    />
                </div>
            </div>

            <div className="row">
                <div className="col-lg-12 text-center">
                    <table className="table table-bordered shadow-lg">
                        <thead className="table-info">
                            <tr>
                                <th> #ID </th>
                                <th> Product Name </th>
                                <th className="bg-warning mypointer" onClick={getProduct}> <i className={orderIcon}> </i> Product Price </th>
                                <th> Product Details </th>
                                <th> Product Photo </th>
                                <th> Action </th>
                            </tr>
                        </thead>
                        <tbody className="table table-light shadow-lg">
                            {
                                allProduct.slice(offset, offset + PER_PAGE).map((product,index)=>{
                                    if( product.pname.toLowerCase().match(keyword.toLowerCase()) || product.pprice.toString().match(keyword) )
                                    return(
                                        <tr key={index}>
                                            <td> {product.id} </td>
                                            <td> {product.pname} </td>
                                            <td> Rs. {product.pprice} </td>
                                            <td> {product.pdetails} </td>
                                            <td> <img src={product.photo} height="50px" width="70px" /> </td>
                                            <td> <button onClick={delPro.bind(this, product.id)} className="btn btn-danger btn-sm"> <i className="fa fa-trash"> </i> </button> </td>
                                        </tr>
                                    )
                                })
                            }
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
            </div>
        </div>
    )
}

export default MyProduct;