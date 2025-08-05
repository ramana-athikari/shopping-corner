import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SellerLogin = () => {
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");

    let [emailError, setEmailError] = useState("");
    let [passwordError, setPasswordError] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    let [message, setMessage] = useState("");
    let [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const loginCheck = async (obj) => {

        obj.preventDefault();

        let formStatus = true;

        let epattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        //      mohit.mca209@gmail.com
        //      username + @ + domainname + . + extension

        if (!epattern.test(email)) {
            setEmailError("Enter Email Id !");
            formStatus = false;
        } else {
            setEmailError("");
        }

        if (password === "") {
            setPasswordError("Enter Password !");
            formStatus = false;
        } else {
            setPasswordError("");
        }

        if (formStatus === false) {
            setMessage("Enter Login Details !");
            return;
        }
        setIsLoading(true);
        setMessage("Please Wait Processing...");

        try {
            const res = await fetch("http://localhost:1234/sellerapi");
            const accountArray = await res.json();

            let loginStatus = false;
            for (let seller of accountArray) {
                if (seller.email === email && seller.password === password) {
                    loginStatus = true;
                    localStorage.setItem("sellerId", seller.id);
                    localStorage.setItem("sellerName", seller.fullName);

                    // Redirect and reload page
                    // window.location.href = "#/";
                    // window.location.reload();

                    toast.success(`Hi! ${seller.fullName}`, { autoClose: 1000 });

                    navigate("/");

                    setTimeout(() => {
                        window.location.reload(); // gives time for toast to show
                    }, 1600);

                    break;
                }
            }

            if (!loginStatus) {
                setMessage("Invalid Login Credentials !");
            }

        } catch (error) {
            setMessage("An error occurred, please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="container mt-5">
            <form onSubmit={loginCheck}>
                <div className="row">
                    <div className="col-lg-4"></div>
                    <div className="col-lg-4">
                        <div className="card card-body shadow-lg">
                            <h4 className="text-center mb-4"> <i className="fa fa-lock"> </i> Seller Login </h4>
                            <p className="text-center text-danger"> {message} </p>
                            <div className="mb-3">
                                <label> Email Id </label>
                                <input type="email" onChange={obj => setEmail(obj.target.value)} className="form-control" placeholder="Enter Email" />
                                <small className="text-danger"> {emailError} </small>
                            </div>
                            <div className="mb-3">
                                <label> Password </label>
                                <div className="input-group">
                                    <input type={showPassword ? "text" : "password"} onChange={obj => setPassword(obj.target.value)} className="form-control" placeholder="Enter password" />
                                    <span
                                        className="input-group-text"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}> </i>
                                    </span>
                                </div>
                                <small className="text-danger"> {passwordError} </small>
                            </div>
                            <div className="text-center mb-2">
                                {/* <button disabled={isLoading} className="btn btn-sm w-50 btn-success mb-2" type="submit"> Login <i className="fa fa-arrow-right"> </i></button> */}
                                <button
                                    className="btn btn-success mb-2 w-50"
                                    type="submit"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Loading..." : "Login"}
                                </button>
                            </div>
                            <div className="text-center mb-2">
                                New Seller? <Link to="/SellerSignUp" className="text-decoration-none text-Primary fw-bold">  Create Account </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4"></div>
                </div>
            </form >
        </div >
    )
}

export default SellerLogin;