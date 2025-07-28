import { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";

const MyCart = () => {
    const [allproduct, setproduct] = useState([]);
    const [msg, setmsg] = useState();
    const [couponCode, setCouponCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [validCoupons] = useState([
        { code: "10OFF", discount: 0.1, minAmount: 999 },
        { code: "15OFF", discount: 0.15, minAmount: 1999 },
        { code: "20OFF", discount: 0.2, minAmount: 2999 }
    ]);

    const [paymentMethod, setPaymentMethod] = useState("");
    const [upiQRCode, setUpiQRCode] = useState("");
    const [cardDetails, setCardDetails] = useState({
        cardNumber: "",
        expiryDate: "",
        cvv: ""
    });
    const [paymentStatus, setPaymentStatus] = useState("");
    const [customer, setcustomer] = useState({});

    const calculateTotalCost = (products) => {
        return products.reduce((total, product) => total + (product.pprice * product.qty), 0);
    };

    const getproduct = () => {
        const userId = localStorage.getItem("userId");

        fetch(`http://localhost:1234/cartapi?userId=${userId}`)
            .then(response => response.json())
            .then(cartItems => {
                setproduct(cartItems); // No reduce, just show all items in cart
            });
    };

    useEffect(() => {
        getproduct();
    }, []);

    const clearCart = async () => {
        const userId = localStorage.getItem("userId");

        const response = await fetch(`http://localhost:1234/cartapi?userId=${userId}`);
        const cartItems = await response.json();

        await Promise.all(
            cartItems.map(async item => {
                await fetch(`http://localhost:1234/cartapi/${item.id}`, {
                    method: "DELETE",
                });
            })
        );
    };

    const delitem = (id) => {
        fetch(`http://localhost:1234/cartapi/${id}`, { method: "delete" })
            .then(response => response.json())
            .then(delinfo => {
                setmsg((delinfo?.pname || "Product") + " deleted Successfully!");
                getproduct();
            });
    };

    const updataQty = (product, action) => {
        // Create a shallow copy to avoid mutating directly
        const updatedProduct = { ...product };

        if (action === "Y") {
            updatedProduct.qty += 1;
        } else {
            updatedProduct.qty -= 1;
        }

        if (updatedProduct.qty <= 0) {
            return delitem(updatedProduct.id);
        }

        fetch(`http://localhost:1234/cartapi/${updatedProduct.id}`, {
            headers: { "Content-Type": "application/json" },
            method: "put",
            body: JSON.stringify(updatedProduct)
        }).then(() => getproduct());
    };

    const pickValue = (e) => {
        setcustomer({ ...customer, [e.target.name]: e.target.value });
    };

    const save = async () => {
        // ✅ Extract sellerId from the first product in the cart
        const sellerId = allproduct.length > 0 ? allproduct[0].sellerId : null;

        const customerData = {
            ...customer,
            myProduct: allproduct,
            payment: paymentMethod,
            cardDetails,
            orderDate: new Date().toLocaleString(),
            couponCode,
            discount,
            sellerId // ✅ attach sellerId from cart product
        };

        if (!sellerId) {
            console.error("Seller ID not found in cart items!");
            return;
        }

        await fetch("http://localhost:1234/orderapi", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(customerData)
        });
    };


    const handleCouponChange = (e) => {
        const coupon = validCoupons.find(c => c.code === e.target.value);
        setCouponCode(e.target.value);
        setDiscount(coupon ? coupon.discount : 0);
    };

    const handlePaymentMethodChange = (e) => {
        const selectedMethod = e.target.value;
        setPaymentMethod(selectedMethod);

        if (selectedMethod === "UPI") {
            const upiId = "prasadbatari@oksbi";
            const merchantName = "Batari";
            const amount = (calculateTotalCost(allproduct) * (1 - discount)).toFixed(2);
            const transactionNote = "Payment for order";
            const upiLink = `upi://pay?pa=${upiId}&pn=${merchantName}&mc=0000&tid=${Date.now()}&tn=${transactionNote}&am=${amount}&cu=INR`;

            const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(upiLink)}&size=200x200`;
            setUpiQRCode(qrCodeUrl);
        } else {
            setUpiQRCode("");
        }
    };

    const handleCardDetailsChange = (e) => {
        setCardDetails({
            ...cardDetails,
            [e.target.name]: e.target.value
        });
    };

    const formRef = useRef();

    const handlePaymentConfirmation = async (e) => {
        e.preventDefault();

        await save();
        toast.success("Payment Confirmed!");

        toast.success(`Hi ${customer.cname}, your order will be received soon.`);
        sendConfirmationMessage(customer.email);

        // Reset native form fields
        formRef.current.reset();

        // Clear cart
        await clearCart();
        setproduct([]);
        getproduct();

        // Also reset state if needed
        setcustomer({});
        setCardDetails({ cardNumber: "", expiryDate: "", cvv: "" });
        setPaymentMethod("");
        setCouponCode("");
        setDiscount(0);
        setUpiQRCode("");
    };


    const sendConfirmationMessage = (email) => {
        fetch("http://localhost:1234/sendMessage", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                to: email,
                message: "Your payment has been successfully completed. Thank you!"
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) console.log("Message sent successfully!");
                else console.error("Message sending failed!");
            });
    };

    const totalCost = calculateTotalCost(allproduct);
    const finalPrice = (totalCost - totalCost * discount).toFixed(2);

    return (
        <div className="container mt-4 container-body-user">
            <ToastContainer />
            {
                allproduct.length === 0 ? (
                    <div className="text-center text-muted">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
                            alt="Empty Cart"
                            width="100"
                            className="d-block mx-auto mt-4"
                        />
                        <p className="text-center text-muted mt-2">Your cart is empty.</p>
                    </div>
                ) : (
                    <div className="row">
                        <div className="col-lg-4">
                            <form ref={formRef} onSubmit={handlePaymentConfirmation}>
                                <div className="p-3 shadow">
                                    <h3>Customer Details</h3>
                                    <div className="mb-2">
                                        <label>Name</label>
                                        <input type="text" className="form-control" name="cname" onChange={pickValue} />
                                    </div>
                                    <div className="mb-2">
                                        <label>Mobile</label>
                                        <input type="text" className="form-control" name="mobile" onChange={pickValue} />
                                    </div>
                                    <div className="mb-2">
                                        <label>Email</label>
                                        <input type="email" className="form-control" name="email" onChange={pickValue} />
                                    </div>
                                    <div className="mb-2">
                                        <label>Address</label>
                                        <textarea className="form-control" name="address" onChange={pickValue}></textarea>
                                    </div>

                                    <div className="mb-2">
                                        <label>Coupon Code:</label>
                                        {validCoupons.map((coupon, index) => {
                                            const isEligible = totalCost >= coupon.minAmount;

                                            return (
                                                <div key={index} className="form-check">
                                                    <input
                                                        type="radio"
                                                        className="form-check-input"
                                                        name="coupon"
                                                        value={coupon.code}
                                                        checked={couponCode === coupon.code}
                                                        onChange={handleCouponChange}
                                                        disabled={!isEligible}
                                                    />
                                                    <label className={`form-check-label ${!isEligible ? 'text-muted' : ''}`}>
                                                        {coupon.code} - {coupon.discount * 100}% off
                                                        {!isEligible && ` (Available on ₹${coupon.minAmount}+ orders)`}
                                                    </label>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="mb-2 row">
                                        <label>Payment Method:</label>
                                        {["UPI", "Cash", "Debit Card", "Credit Card"].map((method) => (
                                            <div key={method} className="form-check col-lg-6">
                                                <input
                                                    type="radio"
                                                    id={method}
                                                    className="form-check-input"
                                                    name="paymentMethod"
                                                    value={method}
                                                    checked={paymentMethod === method}
                                                    onChange={handlePaymentMethodChange}
                                                />
                                                <label className="form-check-label" htmlFor={method}>
                                                    {method}
                                                </label>
                                            </div>
                                        ))}
                                    </div>

                                    {(paymentMethod === "Debit Card" || paymentMethod === "Credit Card") && (
                                        <>
                                            <div className="mb-2">
                                                <label>Card Number</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="cardNumber"
                                                    value={cardDetails.cardNumber}
                                                    onChange={handleCardDetailsChange}
                                                />
                                            </div>
                                            <div className="mb-2">
                                                <label>Expiry Date</label>
                                                <input
                                                    type="month"
                                                    className="form-control"
                                                    name="expiryDate"
                                                    value={cardDetails.expiryDate}
                                                    onChange={handleCardDetailsChange}
                                                />
                                            </div>
                                            <div className="mb-2">
                                                <label>CVV</label>
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    name="cvv"
                                                    value={cardDetails.cvv}
                                                    onChange={handleCardDetailsChange}
                                                />
                                            </div>
                                        </>
                                    )}
                                    {allproduct.length === 0 && (
                                        <p className="text-danger">Your cart is empty. Please add items to proceed.</p>
                                    )}
                                    <div className="text-center">
                                        <button
                                            onClick={handlePaymentConfirmation}
                                            className="btn btn-success"
                                            disabled={allproduct.length === 0}
                                        >
                                            Complete Payment
                                        </button>

                                    </div>

                                    {paymentMethod === "UPI" && upiQRCode && (
                                        <div className="mt-4 text-center">
                                            <h5>Scan to Pay</h5>
                                            <img src={upiQRCode} alt="UPI QR Code" />
                                        </div>
                                    )}

                                    {paymentStatus && (
                                        <div className="mt-3 text-success text-center">
                                            <b>{paymentStatus}</b>
                                        </div>
                                    )}
                                </div>
                            </form>
                        </div>
                        <div className="col-lg-8 text-center">
                            <h3>{allproduct.length} - Items in My Cart</h3>
                            <small className="text-danger">{msg}</small>
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Item</th>
                                        <th>Photo</th>
                                        <th>Price</th>
                                        <th>Qty</th>
                                        <th>Total</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allproduct.map((product) => (
                                        <tr key={product.id}>
                                            <td>{product.pname}</td>
                                            <td><img src={product.photo} alt={product.pname} height="30" width="40" /></td>
                                            <td>{product.pprice}</td>
                                            <td>
                                                <div className="d-flex justify-content-center align-items-center">
                                                    <button
                                                        className="btn btn-warning btn-sm me-2"
                                                        onClick={() => updataQty(product, "N")}
                                                    >-</button>
                                                    {product.qty}
                                                    <button
                                                        className="btn btn-info btn-sm ms-2"
                                                        onClick={() => updataQty(product, "Y")}
                                                    >+</button>
                                                </div>
                                            </td>
                                            <td>{product.pprice * product.qty}</td>
                                            <td>
                                                <button className="btn btn-danger btn-sm" onClick={() => delitem(product.id)}>
                                                    <i className="fa fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td colSpan={6} className="text-end pe-4 text-primary">
                                            <b>Final Price ₹ {finalPrice}</b>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default MyCart;