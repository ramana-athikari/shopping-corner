import { useState, useEffect } from "react";
// Importing toastify module
import { ToastContainer, toast } from "react-toastify";

const MyCart = () => {
    let [allProduct, setProduct] = useState([]);

    const getProduct = () => {
        fetch("http://localhost:1234/cartapi")
            .then(res => res.json())
            .then(productArray => {
                setProduct(productArray);
            })
    }

    useEffect(() => {
        getProduct();
    }, [])

    const delProduct = (id) => {
        let url = "http://localhost:1234/cartapi/" + id;
        let postData = { method: "delete" };
        fetch(url, postData)
            .then(res => res.json())
            .then(pArray => {
                toast(pArray.pname + " - Deleted Successfully !")
                getProduct();
            })
    }

    const updateQty = (product, action) => {
        if (action === "Y") {
            product["qty"] = product.qty + 1;
        } else {
            product["qty"] = product.qty - 1;
        }

        if (product.qty <= 0) {
            delProduct(product.id);
        }

        let url = "http://localhost:1234/cartapi/" + product.id;
        let postData = {
            headers: { "content-type": "applicatiob/json" },
            method: "put",
            body: JSON.stringify(product)
        }

        fetch(url, postData)
            .then(res => res.json)
            .then(info => {
                getProduct(); // reload the cart item list after update
            })
    }

    let [customer, setCustomer] = useState({});

    const pickValue = (obj) => {
        customer[obj.target.name] = obj.target.value;
        setCustomer(customer);
    }

    const save = (obj) => {
        obj.preventDefault();
        customer["myProduct"] = allProduct;
        const date = new Date();
        customer["orderDate"] = date.toLocaleString();

        let url = "http://localhost:1234/orderapi";
        let postData = {
            headers: { "content-type": "application/json" },
            method: "post",
            body: JSON.stringify(customer)
        }

        fetch(url, postData)
            .then(res => res.json)
            .then(info => {
                setCustomer({});
                getProduct(); // reload the cart item list after update
                obj.target.reset();
            })

        alert("Hi, " + customer.cname + " \n Your Order is Placed Successfully !");

    }

    let [keyword, setKeyword] = useState("");
    let totalcost = 0;

    return (
        <div className="container">
            <ToastContainer />
            <div className="row">
                <div className="col-lg-4 mt-3">
                    <form onSubmit={save}>
                        <div className="p-3 shadow">
                            <h3 className="mb-3"> Customer Details </h3>
                            <div className="mb-4">
                                <label> Customer Name </label>
                                <input type="text" className="form-control" name="cname" onChange={pickValue} />
                            </div>
                            <div className="mb-4">
                                <label> Mobile No </label>
                                <input type="number" className="form-control" name="mobile" onChange={pickValue} />
                            </div>
                            <div className="mb-4">
                                <label> Email Id </label>
                                <input type="email" className="form-control" name="email" onChange={pickValue} />
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
                                onChange={obj => setKeyword(obj.target.value)}
                            />
                        </div>
                    </div>
                    {/* Bootstrap responsive table wrapper */}
                    <div className="table-responsive overflow-auto scroll-table">
                        <table className="table table-bordered text-center">
                            <thead>
                                <tr className="table-warning">
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
                                    allProduct.map((product, index) => {
                                        totalcost = totalcost + (product.pprice * product.qty);
                                        if (product.pname.toLowerCase().match(keyword.toLowerCase()) || product.pprice.toString().match(keyword))
                                            return (
                                                <tr key={index} className="table-info">
                                                    <td> {product.pname} </td>
                                                    <td> <img src={product.photo} height="50px" width="70px" /> </td>
                                                    <td> {product.pprice} </td>
                                                    <td>
                                                        <button onClick={obj => updateQty(product, "N")} className="btn btn-warning btn-sm me-2"> - </button>
                                                        {product.qty}
                                                        <button onClick={obj => updateQty(product, "Y")} className="btn btn-primary btn-sm ms-2"> + </button>
                                                    </td>
                                                    <td> {product.pprice * product.qty} </td>
                                                    <td> <button onClick={obj => delProduct(product.id)} className="btn btn-danger"> <i className="fa fa-trash"> </i> </button> </td>
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
        </div>
    )
}

export default MyCart;




// import { useState, useEffect } from "react";
// import { toast, ToastContainer } from "react-toastify";

// const MyCart = () => {
//     const [allproduct, setproduct] = useState([]);
//     const [couponCode, setCouponCode] = useState("");
//     const [discount, setDiscount] = useState(0);
//     const [validCoupons] = useState([
//         { code: "10OFF", discount: 0.1, minAmount: 999 },
//         { code: "15OFF", discount: 0.15, minAmount: 1999 },
//         { code: "20OFF", discount: 0.2, minAmount: 2999 }
//     ]);

//     const [paymentMethod, setPaymentMethod] = useState("");
//     const [cardDetails, setCardDetails] = useState({
//         cardNumber: "",
//         expiryDate: "",
//         cvv: ""
//     });
//     const [customer, setcustomer] = useState({});

//     // ✅ Calculate Total
//     const calculateTotalCost = (products) => {
//         return products.reduce((total, product) => total + (product.price * product.qty), 0);
//     };

//     // ✅ Fetch cart items
//     const getproduct = () => {
//         const userId = localStorage.getItem("userId");

//         fetch(`http://localhost:1234/api/cart?userId=${userId}`)
//             .then(response => response.json())
//             .then(cartItems => {
//                 const mergedItems = [];

//                 cartItems.forEach(item => {
//                     const existingIndex = mergedItems.findIndex(p =>
//                         p.name === item.name &&
//                         p.price === item.price &&
//                         p.image === item.image &&
//                         p.sellerId === item.sellerId
//                     );

//                     if (existingIndex >= 0) {
//                         mergedItems[existingIndex].qty += item.qty;
//                         mergedItems[existingIndex].mergedIds.push(item._id);
//                     } else {
//                         mergedItems.push({
//                             ...item,
//                             mergedIds: [item._id]
//                         });
//                     }
//                 });

//                 setproduct(mergedItems);
//             });
//     };

//     useEffect(() => {
//         getproduct();
//     }, []);

//     // ✅ Delete item
//     const delitem = (id) => {
//         fetch(`http://localhost:1234/api/cart/${id}`, { method: "DELETE" })
//             .then(() => {
//                 toast.info("Item removed from cart!");
//                 getproduct();
//             });
//     };

//     // ✅ Update qty
//     const updataQty = (product, action) => {
//         const updatedProduct = { ...product };

//         if (action === "Y") updatedProduct.qty += 1;
//         else updatedProduct.qty -= 1;

//         if (updatedProduct.qty <= 0) return delitem(updatedProduct._id);

//         fetch(`http://localhost:1234/api/cart/${updatedProduct._id}`, {
//             headers: { "Content-Type": "application/json" },
//             method: "PUT",
//             body: JSON.stringify(updatedProduct)
//         }).then(() => getproduct());
//     };

//     // ✅ Customer input
//     const pickValue = (e) => {
//         setcustomer({ ...customer, [e.target.name]: e.target.value });
//     };

//     // ✅ Place order
//     const save = async () => {
//         const sellerId = allproduct.length > 0 ? allproduct[0].sellerId : null;

//         if (!sellerId) {
//             toast.error("Seller ID not found in cart!");
//             return;
//         }

//         const customerData = {
//             ...customer,
//             myProduct: allproduct,
//             payment: paymentMethod,
//             cardDetails,
//             orderDate: new Date().toLocaleString(),
//             couponCode,
//             discount,
//             sellerId
//         };

//         await fetch("http://localhost:1234/api/order", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(customerData)
//         });

//         toast.success("Order placed successfully!");
//     };

//     const totalCost = calculateTotalCost(allproduct);
//     const finalPrice = (totalCost - totalCost * discount).toFixed(2);

//     return (
//         <div className="container mt-4 container-body-user">
//             <ToastContainer />
//             {
//                 allproduct.length === 0 ? (
//                     <div className="text-center text-muted">
//                         <img
//                             src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
//                             alt="Empty Cart"
//                             width="100"
//                             className="d-block mx-auto mt-4"
//                         />
//                         <p className="text-center text-muted mt-2">Your cart is empty.</p>
//                     </div>
//                 ) : (
//                     <div className="row">
//                         <div className="col-lg-8 text-center">
//                             <h3>{allproduct.length} - Items in My Cart</h3>
//                             <table className="table table-bordered">
//                                 <thead>
//                                     <tr>
//                                         <th>Item</th>
//                                         <th>Photo</th>
//                                         <th>Price</th>
//                                         <th>Qty</th>
//                                         <th>Total</th>
//                                         <th>Action</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {allproduct.map((product) => (
//                                         <tr key={product._id}>
//                                             <td>{product.name}</td>
//                                             <td>
//                                                 <img
//                                                     src={`http://localhost:1234${product.image}`}
//                                                     alt={product.name}
//                                                     height="30"
//                                                     width="40"
//                                                 />
//                                             </td>
//                                             <td>{product.price}</td>
//                                             <td>
//                                                 <div className="d-flex justify-content-center align-items-center">
//                                                     <button
//                                                         className="btn btn-warning btn-sm me-2"
//                                                         onClick={() => updataQty(product, "N")}
//                                                     >-</button>
//                                                     {product.qty}
//                                                     <button
//                                                         className="btn btn-info btn-sm ms-2"
//                                                         onClick={() => updataQty(product, "Y")}
//                                                     >+</button>
//                                                 </div>
//                                             </td>
//                                             <td>{product.price * product.qty}</td>
//                                             <td>
//                                                 <button
//                                                     className="btn btn-danger btn-sm"
//                                                     onClick={() => delitem(product._id)}
//                                                 >
//                                                     <i className="fa fa-trash"></i> Remove
//                                                 </button>
//                                             </td>
//                                         </tr>
//                                     ))}
//                                     <tr>
//                                         <td colSpan={6} className="text-end pe-4 text-primary">
//                                             <b>Final Price ₹ {finalPrice}</b>
//                                         </td>
//                                     </tr>
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                 )
//             }
//         </div>
//     );
// };

// export default MyCart;