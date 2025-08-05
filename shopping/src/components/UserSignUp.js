import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";

const UserSignUp = () => {
    // "userName": "A. RAMANA",
    // "userEmail": "a@gmail.com",
    // "userPassword": "1234",
    // "userMobile": "08297190831"

    let [userName, setuserName] = useState("");
    let [userEmail, setuserEmail] = useState("");
    let [userPassword, setuserPassword] = useState("");
    let [userMobile, setuserMobile] = useState("");

    let [fError, setFullNameError] = useState("");
    let [eError, setEmailError] = useState("");
    let [pError, setPasswordError] = useState("");
    let [mError, setMobileError] = useState("");
    let [message, setMessage] = useState("");
    let [isLoading, setIsLoading] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    let newUser = { "fullname": userName, "email": userEmail, "password": userPassword, "mobile": userMobile };

    const registerUser = async (obj) => {
        obj.preventDefault();

        // Form Validation Check

        let formStatus = true;
        // let userEmail =  ? setEmailError("Enter Email Id") : setEmailError("");

        let epattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        //      mohit.mca209@gmail.com
        //      username + @ + domainname + . + extension

        if (!epattern.test(userEmail)) {
            setEmailError("Enter Email Id");
            formStatus = false;
        } else {
            setEmailError("");
        };

        if (userName === "") {
            setFullNameError("Enter Full Name");
            formStatus = false;
        } else {
            setFullNameError("");
        };

        if (userPassword === "") {
            setPasswordError("Enter Password");
            formStatus = false;
        } else {
            setPasswordError("");
        };

        if (userMobile.length !== 10) {
            setMobileError("Mobile number must be exactly 10 digits.");
            formStatus = false;
        } else {
            setMobileError("");
        };

        // formstatus validation
        if (formStatus === false) {
            setMessage("Enter the Details !");
        }

        if (formStatus === true) {
            const url = "http://localhost:1234/customerapi";
            const postData = {
                headers: { "Content-Type": "application/json" },
                method: "POST",
                body: JSON.stringify(newUser),
            };

            try {
                setIsLoading(true); // optional: if you're using a loading state
                setMessage("Please Wait Processing...");

                const response = await fetch(url, postData);

                if (!response.ok) {
                    throw new Error("Failed to create account");
                }

                const info = await response.json();

                obj.target.reset(); // clear form

                // alert(`${newUser.fullname} - Saved Successfully!`);
                toast.success(`Created Successfully!`, { autoClose: 1500 });

                // window.location.href = "/#/"; // redirect
                setTimeout(() => {
                    window.location.href = "/#/";
                    // or use navigate("/"); if using useNavigate
                }, 1500);

            } catch (error) {
                // console.error("Error saving user:", error);
                // setMessage("Something went wrong. Please try again.");
                toast.error("Something went wrong. Please try again.");
            } finally {
                setIsLoading(false); // optional
            }
        }
    };

    return (
        <div className="container mt-5">
        <ToastContainer/>
            <form onSubmit={registerUser}>
                <div className="row">
                    <div className="col-lg-4"></div>
                    <div className="col-lg-4">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="text-center">
                                    Create Account
                                </h4>
                                <p className="text-center text-danger"> {message} </p>
                                <div className="mb-3">
                                    <label> Full Name </label>
                                    <input type="text" placeholder="enter full name" onChange={obj => setuserName(obj.target.value)} name={userName} className="form-control" />
                                    <small className="text-danger"> {fError} </small>
                                </div>
                                <div className="mb-3">
                                    <label> Email Id </label>
                                    <input type="email" placeholder="enter email id" onChange={obj => setuserEmail(obj.target.value)} name={userEmail} className="form-control" />
                                    <small className="text-danger"> {eError} </small>
                                </div>
                                <div className="mb-3 position-relative">
                                    <label>Create Password</label>
                                    <div className="input-group">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            className="form-control"
                                            placeholder="enter password"
                                            onChange={(e) => setuserPassword(e.target.value)}
                                            name="userPassword"
                                        />
                                        <span
                                            className="input-group-text border border-start-0"
                                            style={{ cursor: "pointer" }}
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            <i className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                                        </span>
                                    </div>
                                    <small className="text-danger">{pError}</small>
                                </div>
                                <div className="mb-3">
                                    <label> Mobile No </label>
                                    <input type="number" placeholder="enter mobile no" onChange={obj => setuserMobile(obj.target.value)} name={userMobile} className="form-control" size={10} maxLength={10} />
                                    <small className="text-danger"> {mError} </small>
                                </div>
                                <div className="text-center">
                                    {/* <button disabled={isLoading} type="submit" className="btn btn-primary mb-3 w-50"> Register <i className="fa fa-user-plus"> </i> </button> */}
                                    <button className="btn btn-primary mb-3 w-50" type="submit" disabled={isLoading}>
                                        {isLoading ? "Loading..." : "Create"}
                                    </button>
                                    <p>  Existing User? <Link to="/UserLogin" className="text-decoration-none fw-bold"> Log In </Link> </p>
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

export default UserSignUp;