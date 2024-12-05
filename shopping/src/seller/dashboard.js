import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

const MyDashboard = () =>{
    let [allProduct,setProduct] = useState([]);
    let [allOrder, setOrder] = useState([]);

    const getProduct = () =>{
        fetch("http://localhost:1234/productapi")
        .then(res=>res.json())
        .then(pArray=>{
            setProduct(pArray);
        })
    }

    const getOrder = () =>{
        fetch("http://localhost:1234/orderapi")
        .then(res=>res.json())
        .then(orderArray=>{
            setOrder(orderArray);
        })
    }

    useEffect(()=>{
        getProduct();
        getOrder();
    },[])

    return(
        <div className="Container mt-4">
            <div className="row mb-5"> 
                <div className="col-lg-12">
                    <h1 className="text-center text-info"> Seller Dashboard </h1>
                </div>
            </div>

            <div className="row text-center">
                <div className="col-lg-4">
                    <Link to="/inventary" className="text-decoration-none text-primary">
                    <i className="fa fa-suitcase fa-3x"> </i>
                    <h4> Total Product - {allProduct.length} </h4>
                    </Link>
                </div>
                <div className="col-lg-4">
                    <Link to="/order" className="text-decoration-none text-warning">
                    <i className="fa fa-headset fa-3x"> </i>
                    <h4> Order Received - {allOrder.length} </h4>
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
    )
}

export default MyDashboard;