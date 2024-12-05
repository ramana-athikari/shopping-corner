import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";

const MyHome = () =>{
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

    useEffect(()=>{
        getProduct();
    },[])

    let [keyword, setKeyword] = useState("");

    const PER_PAGE = 8; //displays 8 items/records per page
    const [currentPage, setCurrentPage] = useState(0);
    function handlePageClick({ selected: selectedPage }) {
      setCurrentPage(selectedPage)
    }
    const offset = currentPage * PER_PAGE;
    const pageCount = Math.ceil(allProduct.length / PER_PAGE);
    
    const addInCart = (product) =>{
        product["qty"] = 1;

        let url = "http://localhost:1234/cartapi";
        let postData = {
            Headers:{"content-type":"application/json"},
            method:"post",
            body:JSON.stringify(product)
        }

        try{
            fetch(url,postData)
            .then(res=>res.json())
            .then(pInfo=>{
                alert(pInfo.pname + " - added in your cart !")
            })
        }catch(error){
            alert("Technical Error, Try after Sometime")
        }
    }

    return(
        <div className="container mt-4">
            <div className="row mb-5">
                <div className="col-lg-2"> </div>
                <div className="col-lg-5 mb-2 text-center">
                    <input type="text" 
                        className="form-control" 
                        placeholder="Search..." 
                        onChange={obj=>setKeyword(obj.target.value)}
                    />
                </div>
                <div className="col-lg-2"></div>
                <div className="col-lg-3">
                    <select className="form-select" onChange={getProduct}>
                        <option> Price Low to High </option>
                        <option> Price High to Low </option>
                    </select>
                </div>
            </div>

            <div className="row mt-5">
                
                {
                    allProduct.slice(offset, offset + PER_PAGE).map((product,index)=>{
                        if( product.pname.toLowerCase().includes(keyword.toLowerCase()) || product.pprice.toString().includes(keyword) )
                        return(
                            <div key={index} className="col-xl-3 mb-4">
                                <div className="p-3 shadow">
                                    <h4 className="text-primary mb-3"> {product.pname} </h4>
                                    
                                    <p className="mt-3"> <img src={product.photo} height="180px" width="100%" className="rounded"/> </p>
                                    
                                    <p className="mt-3 text-danger fs-5"> <i className="fa fa-rupee text-primary"> . </i> {product.pprice} /- </p>
                                    
                                    <p className="mt-3"> {product.pdetails.slice(0,30)} </p>
                                    
                                    <p className="text-center mb-3"> 
                                        <button className="me-3 btn btn-warning btn-sm" onClick={addInCart.bind(this, product)}> 
                                            <i className="fa fa-shopping-cart"> </i> Add to Cart 
                                        </button> 
                                        {/* <div className="btn-group">
                                            <button className="btn btn-success">-1</button>
                                            <button className="btn btn-danger">+1</button>
                                        </div>  */}
                                    </p>
                                </div>
                            </div>
                        )
                    })
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
    )
}

export default MyHome;