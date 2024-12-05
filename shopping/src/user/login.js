import { useState } from "react";

const MyLogin = () => {
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");

    let [emailError, setEmailError] = useState("");
    let [passwordError, setPasswordError] = useState("");

    let [message, setMessage] = useState("Enter Login Details");
    let [myBtn, handleBtn] = useState(false);

    const loginCheck = () => {
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

        if (password == "") {
            setPasswordError("Enter Password !");
            formStatus = false;
        } else {
            setEmailError("");
        }

        if (formStatus == false) {
            setMessage("Enter Login Details !");
        } else {
            handleBtn(true);
            setMessage("Please Wait Proccessing...");
            fetch("http://localhost:1234/sellerapi")
            .then(res => res.json())
            .then(accountArray => {
                let loginStatus = false;
                for (let i = 0; i < accountArray.length; i++) {
                    let seller = accountArray[i];
                    if (seller.email == email && seller.password == password) {
                        loginStatus = true;
                        localStorage.setItem("sellerId", seller.id);
                        localStorage.setItem("sellerName", seller.fullName);
                        window.location.reload();
                    }
                } // for loop end

                if(loginStatus == false){
                    setMessage("Invalid Login Credentials !");
                    handleBtn(false);
                }
            })
        }
    }

    return (
        <div className="container mt-3">
            <div className="row">
                <div className="col-lg-4"></div>
                <div className="col-lg-4">
                    <p className="text-primary text-center"> {message} </p>
                    <div className="card border-0 shadow-lg">
                        <div className="card-header border-0 bg-danger">
                            <h5 className="text-white text-center"> <i className="fa fa-lock"> </i> Vendor Login </h5>
                        </div>
                        <div className="card-body border-0">
                            <div className="mb-3">
                                <label> Your Email Id </label>
                                <input type="email" onChange={obj => setEmail(obj.target.value)} className="form-control" />
                                <small className="text-danger"> {emailError} </small>
                            </div>
                            <div className="mb-3">
                                <label> Your Password </label>
                                <input type="password" onChange={obj => setPassword(obj.target.value)} className="form-control" />
                                <small className="text-danger"> {passwordError} </small>
                            </div>
                        </div>
                        <div className="card-footer text-center">
                            <button disabled={myBtn} className="btn btn-danger" onClick={loginCheck}> Login <i className="fa fa-arrow-right"> </i></button>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4"></div>
            </div>
        </div>
    )
}

export default MyLogin;