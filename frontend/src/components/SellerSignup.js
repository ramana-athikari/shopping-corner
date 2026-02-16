import { useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_URL;

const CreateSellerAccount = () => {
    let [fullName, setFullName] = useState("");
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let [mobile, setMobile] = useState("");

    let [fullNameError, setFullNameError] = useState("");
    let [emailError, setEmailError] = useState("");
    let [passwordError, setPasswordError] = useState("");
    let [mobileError, setMobileError] = useState("");

    let [isLoading, setIsLoading] = useState("");
    let [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    let formStatus = true;

    const registerVendor = async (obj) => {

        obj.preventDefault();

        // Fullname Validation
        if (fullName === "") {
            setFullNameError("Enter Full Name !");
            formStatus = false;
        } else {
            setFullNameError("");
        }

        // email validation
        let epattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        //      mohit.mca209@gmail.com
        //      username + @ + domainname + . + extension

        if (!epattern.test(email)) {
            setEmailError("Enter Valid Email Id !");
            formStatus = false;
        } else {
            setEmailError("");
        }

        // password validation
        if (password === "") {
            setPasswordError("Enter Password !");
            formStatus = false;
        } else {
            setPasswordError("");
        }

        // mobileno validation
        if (mobile === "") {
            setMobileError("Enter Mobile No !");
            formStatus = false;
        } else {
            setMobileError("");
        }

        // formstatus validation
        if (formStatus === false) {
            setMessage("Enter the Details !");
        }

        // saving the details in "http://localhost:1234/sellerapi"
        if (formStatus === true) {
            const newVendor = {
                fullName: fullName,
                email: email,
                password: password,
                mobile: mobile,
            };

            const url = `${API_BASE}/api/seller/signup`;
            const postData = {
                headers: { "Content-Type": "application/json" },
                method: "POST",
                body: JSON.stringify(newVendor),
            };

            try {
                setIsLoading(true); // optional: if using a loading spinner
                setMessage("Please Wait Processing...");

                const res = await fetch(url, postData);

                if (!res.ok) {
                    throw new Error("Server error while creating account");
                }

                await res.json();

                // Clear form fields
                obj.target.reset(); // clear form

                toast.success("Account Created Successfully!", { autoClose: 1500 });
                
                setTimeout(() => {
                    const query = window.location.search; // Preserves ?viewMode=seller
                    window.location.href = `${window.location.origin}${query}#/SellerLogin`;
                }, 1500);

            } catch (error) {
                // console.error("Registration failed:", error);
                toast.error("Something went wrong. Please try again.");
            } finally {
                setIsLoading(false); // stop loading spinner
            }
        }

    }

    return (
        <div className="container mt-5">
            <form onSubmit={registerVendor}>
                <div className="row">
                    <div className="col-lg-4"></div>
                    <div className="col-lg-4">
                        <div className="card shadow-lg card_bg">
                            <div className="card-body">
                                <h4 className="text-center mb-2"> <i className="fa fa-user-plus"> </i> Seller Registration </h4>
                                <p className="text-center text-danger"> {message} </p>
                                <div className="mb-1">
                                    <label> Full Name </label>
                                    <input onChange={obj => setFullName(obj.target.value)} type="text" className="form-control" value={fullName} placeholder="Enter fullname" />
                                    <small className="text-danger"> {fullNameError} </small>
                                </div>
                                <div className="mb-1">
                                    <label> Email Id </label>
                                    <input onChange={obj => setEmail(obj.target.value)} type="email" className="form-control" value={email} placeholder="Enter Email" />
                                    <small className="text-danger"> {emailError} </small>
                                </div>
                                <div className="mb-1">
                                    <label>Password</label>
                                    <div className="input-group">
                                        <input
                                            onChange={(e) => setPassword(e.target.value)}
                                            type={showPassword ? "text" : "password"}
                                            className="form-control"
                                            value={password}
                                            placeholder="Enter  password"
                                        />
                                        <span className="input-group-text" style={{ cursor: "pointer" }} onClick={() => setShowPassword(!showPassword)}>
                                            <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                                        </span>
                                    </div>
                                    {passwordError && (
                                        <small className="text-danger">{passwordError}</small>
                                    )}
                                </div>
                                <div className="mb-3">
                                    <label> Mobile Number </label>
                                    <input onChange={obj => setMobile(obj.target.value)} type="number" className="form-control" value={mobile} placeholder="Enter mobile" size={10} maxLength={10} />
                                    <small className="text-danger"> {mobileError} </small>
                                </div>
                                <div className="text-center mb-2">
                                    {/* <button disabled={isLoading} onClick={registerVendor} className="btn btn-sm w-50 btn-primary mb-2"> Register <i className="fa fa-user-plus"> </i> </button> */}
                                    <button className="btn btn-primary w-50" type="submit" disabled={isLoading}>
                                        {isLoading ? "Loading..." : "Register"}
                                    </button>
                                </div>
                                <div className="text-center">
                                    Existing Seller? <Link to="/seller-login" className="text-decoration-none text-primary fw-bold"> Login </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4"></div>
                </div>
            </form>
        </div>
    )
}

export default CreateSellerAccount;