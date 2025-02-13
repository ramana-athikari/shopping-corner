import { useState } from "react";
import { Link } from "react-router-dom";

const SignUp = () =>{
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
    let [myBtn, handleBtn] = useState("");

    let newUser = {"fullname":userName, "email":userEmail, "password":userPassword, "mobile":userMobile};
    
    const registerUser = (obj) =>{
        obj.preventDefault();
        
        // Form Validation Check
        
        let formStatus = true;
        // let userEmail =  ? setEmailError("Enter Email Id") : setEmailError("");

        let epattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        //      mohit.mca209@gmail.com
        //      username + @ + domainname + . + extension

        if(!epattern.test(userEmail)){
            setEmailError("Enter Email Id");
            formStatus = false;
        }else{
            setEmailError("");
        };

        if(userName == ""){
            setFullNameError("Enter Full Name");
            formStatus = false;
        }else{
            setFullNameError("");
        };

        if(userPassword == ""){
            setPasswordError("Enter Password");
            formStatus = false;
        }else{
            setPasswordError("");
        };

        if(userMobile == ""){
            setMobileError("Enter Mobile");
            formStatus = false;
        }else{
            setMobileError("");
        };

        // formstatus validation
        if(formStatus==false){
            setMessage("Enter the Details !");
        }else{
            handleBtn("disabled")
            setMessage("Account Created Successfully !");
        }

        if(formStatus == true){
            let url = "http://localhost:1234/customerapi";
            let postdata = {
                headers: { "content-type": "application/json" },
                method: "post",
                body: JSON.stringify(newUser)
            }

            fetch(url, postdata)
            .then(res => res.json())
            .then(info => {
                alert(newUser.fullname + " - Saved Successfully !");
                obj.target.reset(); // it will clear the form
                window.location.href="/#/";
            })
        }
    };

    return(
        <div className="container mt-3">
            <form onSubmit={registerUser}>
                <div className="row">
                    <div className="col-lg-4"></div>
                    <div className="col-lg-4">
                        <div className="card">
                            <div className="card-header fs-5 text-center">
                                Register New User
                            </div>
                            <div className="card-body">
                                <p className="text-center text-danger"> {message} </p>
                                <div className="mb-3">
                                    <label> Full Name </label>
                                    <input type="text" placeholder="enter full name" onChange={obj=>setuserName(obj.target.value)} name={userName} className="form-control"/>
                                    <small className="text-danger"> {fError} </small>
                                </div>
                                <div className="mb-3">
                                    <label> Email Id </label>
                                    <input type="email" placeholder="enter email id" onChange={obj=>setuserEmail(obj.target.value)} name={userEmail} className="form-control"/>
                                    <small className="text-danger"> {eError} </small>
                                </div>
                                <div className="mb-3">
                                    <label> Create Password </label>
                                    <input type="password" placeholder="enter password" onChange={obj=>setuserPassword(obj.target.value)} name={userPassword} className="form-control"/>
                                    <small className="text-danger"> {pError} </small>
                                </div>
                                <div className="mb-3">
                                    <label> Mobile No </label>
                                    <input type="mobile" placeholder="enter mobile no" onChange={obj=>setuserMobile(obj.target.value)}name={userMobile} className="form-control"/>
                                    <small className="text-danger"> {mError} </small>
                                </div>
                            </div>
                            <div className="card-footer text-center">
                                <button disabled={myBtn} type="submit" className="btn btn-primary mb-2"> Register <i className="fa fa-user-plus"> </i> </button>
                                <p className="text-center"> <Link to="/" className="text-decoration-none  text-danger"> <i className="fa fa-arrow-left"> </i> login page </Link> </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4"></div>
                </div>
            </form>
        </div>
    )
}

export default SignUp;