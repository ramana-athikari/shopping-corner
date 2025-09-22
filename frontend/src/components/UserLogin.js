import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const API_BASE = process.env.REACT_APP_API_URL;

const UserLogin = () => {

    let navigate = useNavigate();

    // login credetials 

    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // email and password validation 

    let [emailError, setEmailError] = useState("");
    let [passwordError, setPasswordError] = useState("");

    let [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const LoginCheck = async (obj) => {
        obj.preventDefault();

        let formStatus = true;

        let epattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

        if (!epattern.test(email)) {
            setEmailError("Enter valid Email Id");
            formStatus = false;
        } else {
            setEmailError("");
        }

        if (password === "") {
            setPasswordError("Enter Password");
            formStatus = false;
        } else {
            setPasswordError("");
        }

        if (formStatus === false) {
            setMessage("Enter Login Details !");
            return; // exit early, no loading state set
        }

        // Validation passed — now start loading
        setIsLoading(true);

        try {
            const res = await fetch(`${API_BASE}/api/user/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                // ✅ Success
                localStorage.setItem("userId", data.user._id);
                localStorage.setItem("userName", data.user.fullName);

                toast.success(`Hi! ${data.user.fullName} 👋`, { autoClose: 1000 });
                navigate("/");
            } else {
                // ❌ Error from backend
                toast.error(data.message || "Invalid credentials");
                setMessage(data.message);
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }

    }

    return (
        <div className="container mt-5">
            {/* <marquee className="text-center text-danger fs-5 mb-5" direction="left">
                Welcome to the Shopping Portal, Please Login to buy the Products
            </marquee> */}
            <form onSubmit={LoginCheck}>
                <div className="row">
                    <div className="col-lg-4"></div>
                    <div className="col-lg-4">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="text-center fs-4 mb-2">
                                    User Login
                                </h4>
                                <div className="text-center mb-4"> <i className="fa-regular fa-user fa-3x"> </i> </div>
                                <p className="text-center text-danger"> {message} </p>
                                <div>
                                    <label> Email </label>
                                    <input type="email" placeholder="enter email id" onChange={obj => setEmail(obj.target.value)} name={email} className="form-control mb-2" />
                                    <small className="text-danger"> {emailError} </small>
                                </div>
                                <div>
                                    <label> Password </label>
                                    <div className="input-group">
                                        <input type={showPassword ? "text" : "password"} placeholder="enter password" onChange={obj => setPassword(obj.target.value)} name={password} className="form-control" />
                                        <span
                                            className="input-group-text"
                                            style={{ cursor: "pointer" }}
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            <i className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}> </i>
                                        </span>
                                    </div>
                                    <small className="text-danger"> {passwordError} </small>
                                </div>
                                <div className="text-center mt-4">
                                    {/* <button className="btn btn-success mb-2 w-50" type="submit"> Submit </button> */}
                                    <button
                                        className="btn btn-success mb-2 w-50"
                                        type="submit"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Loading..." : "Submit"}
                                    </button>
                                    <p> New Customer ? <Link to="/UserSignUp" className="text-decoration-none fw-bold"> Sign Up </Link> </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4"></div>
                </div>
            </form>
        </div>
    )
};

export default UserLogin;