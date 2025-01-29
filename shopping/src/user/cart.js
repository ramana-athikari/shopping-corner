import { useState, useEffect } from "react";

const MyCart = () =>{
    let [allProduct, setProduct] = useState( [] );

    const getProduct = () =>{
        fetch("http://localhost:1234/cartapi")
        .then(res=>res.json())
        .then(productArray=>{
            setProduct(productArray);
        })    
    }

    useEffect(()=>{
        getProduct();
    },[])

    const delProduct = (id) =>{
        let url = "http://localhost:1234/cartapi/"+id;
        let postData = {method:"delete"};
        fetch(url, postData)
        .then(res=>res.json())
        .then(pArray=>{
            alert(pArray.pname + " - Deleted Successfully !")
            getProduct();
        })
    }

    const updateQty = (product, action) =>{
        if(action === "Y"){
            product["qty"] = product.qty + 1;
        }else{
            product["qty"] = product.qty - 1;
        }

        if(product.qty <=0 ){
            delProduct(product.id);
        }

        let url = "http://localhost:1234/cartapi/"+product.id;
        let postData = {
            headers:{"content-type":"applicatiob/json"},
            method:"put",
            body:JSON.stringify(product)
        }

        fetch(url,postData)
        .then(res=>res.json)
        .then(info=>{
            getProduct(); // reload the cart item list after update
        })
    }

    let [customer, setCustomer] = useState({});

    const pickValue = (obj) =>{
        customer[obj.target.name] = obj.target.value;
        setCustomer(customer);
    }
    
    const save = (obj) =>{
        obj.preventDefault();
        customer["myProduct"] = allProduct;
        const date = new Date();
        customer["orderDate"] = date.toLocaleString();
        
        let url = "http://localhost:1234/orderapi";
        let postData = {
            headers:{"content-type":"applicatiob/json"},
            method:"post",
            body:JSON.stringify(customer)
        }

        fetch(url,postData)
        .then(res=>res.json)
        .then(info=>{
            setCustomer({});
            getProduct(); // reload the cart item list after update
            obj.target.reset();
        })  
        
        alert("Hi, " + customer.cname + " \n Your Order is Placed Successfully !");
        
    }

    let [keyword, setKeyword] = useState("");
    let totalcost = 0;

    return(
        <div className="container">
            
            <div className="row">
                    <div className="col-lg-4 mt-3">  
                <form onSubmit={save}>
                        <div className="p-3 shadow">
                            <h3 className="mb-3"> Customer Details </h3>
                            <div className="mb-4">
                                <label> Customer Name </label>
                                <input type="text" className="form-control" name="cname" onChange={pickValue}/>
                            </div>
                            <div className="mb-4">
                                <label> Mobile No </label>
                                <input type="number" className="form-control" name="mobile" onChange={pickValue}/>
                            </div>
                            <div className="mb-4">
                                <label> Email Id </label>
                                <input type="email" className="form-control" name="email" onChange={pickValue}/>
                            </div>
                            <div className="mb-4">
                                <label> Delivery Address </label>
                                <textarea type="text" className="form-control" rows={3} name="address" onChange={pickValue}></textarea>
                            </div>
                            <div className="mb-4 text-center">
                                <button type="submit" className="btn btn-warning"> Place Order </button>
                            </div>
                        </div>
                </form>
                    </div>
                <div className="col-lg-8 mt-3 text-success"> 
                    <div className="row mb-3">
                        <h3 className="text-center col-lg-8"> {allProduct.length} - Item in My Cart </h3>
                        <div className="col-lg-4">
                            <input type="text" 
                                className="form-control" 
                                placeholder="Search..." 
                                onChange={obj=>setKeyword(obj.target.value)}
                            />
                        </div>
                    </div>  
                    <table className="table table-bordered text-center">
                        <thead className="table-warning">
                            <tr>
                                <th> Item Name </th>
                                <th> Photo </th>
                                <th> Price </th>
                                <th> Quantity </th>
                                <th> Total </th>
                                <th> Action </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                allProduct.map((product,index)=>{
                                    totalcost = totalcost + (product.pprice * product.qty);
                                    if( product.pname.toLowerCase().match(keyword.toLowerCase()) || product.pprice.toString().match(keyword) )
                                    return(
                                        <tr key={index}>
                                            <td> {product.pname} </td>
                                            <td> <img src={product.photo} height="50px" width="70px" /> </td>
                                            <td> {product.pprice} </td>
                                            <td> 
                                                <button onClick={obj=>updateQty(product, "N")} className="btn btn-warning btn-sm me-2"> - </button>
                                                {product.qty}
                                                <button onClick={obj=>updateQty(product, "Y")} className="btn btn-primary btn-sm ms-2"> + </button> 
                                            </td>
                                            <td> {product.pprice * product.qty} </td>
                                            <td> <button onClick={obj=>delProduct(product.id)} className="btn btn-danger"> <i className="fa fa-trash"> </i> </button> </td>
                                        </tr>
                                    )
                                })
                            }
                            <tr>
                                <td colSpan={6} className="text-end pe-5">
                                    <b> Total Price : Rs. {totalcost} /- </b>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default MyCart;