import { useState } from "react";

const CreateAccount = () =>{
    let [fullName, setFullName] = useState("");
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let [mobile, setMobile] = useState("");

    let [fullNameError, setFullNameError] = useState("");
    let [emailError, setEmailError] = useState("");
    let [passwordError, setPasswordError] = useState("");
    let [mobileError, setMobileError] = useState("");

    let [myBtn, handleBtn] = useState("");
    let [message, setMessage] = useState("Fill the Registration Details");

    let formStatus = true;

    const registerVendor = () =>{

        // Fullname Validation
        if(fullName == ""){
            setFullNameError("Enter Full Name !");
            formStatus = false;
        }else{
            setFullNameError("");
        }

        // email validation
        let epattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        //      mohit.mca209@gmail.com
        //      username + @ + domainname + . + extension

        if(! epattern.test(email)){
            setEmailError("Enter Valid Email Id !");
            formStatus = false;
        }else{
            setEmailError("");
        }

        // password validation
        if(password == ""){
            setPasswordError("Enter Password !");
            formStatus = false;
        }else{
            setPasswordError("");
        }

        // mobileno validation
        if(mobile == ""){
            setMobileError("Enter Mobile No !");
            formStatus = false;
        }else{
            setMobileError("");
        }

        // formstatus validation
        if(formStatus==false){
            setMessage("Enter the Details !");
        }else{
            handleBtn("disabled")
            setMessage("Account Created Successfully !");
        }

        // saving the details in "http://localhost:1234/sellerapi"
        if(formStatus == true){
            let newVendor = {"fullName":fullName, "email":email, "password":password, "mobile":mobile}
            let url = "http://localhost:1234/sellerapi";
            let postData = {
                headers:{"content-type":"application/json"},
                method:"post",
                body:JSON.stringify(newVendor)
            }

            fetch(url, postData)
            .then(res=>res.json())
            .then(info=>{
                setFullName("");
                setEmail("");
                setPassword("");
                setMobile("");
                // alert("Account Created Successfully !");
            })
            // window.location.href="/#/login";
        }
    }

    return(
        <div className="container mt-3">
            <div className="row">
                <div className="col-lg-4"></div>
                <div className="col-lg-4">
                    <p className="text-center text-primary"> {message} </p>
                    <div className="card border-0 shadow-lg">
                        <div className="card-header bg-danger">
                            <h5 className="text-center text-white"> <i className="fa fa-user-plus"> </i> Vendor Create Account </h5>
                        </div>
                        <div className="card-body border-0">
                            <div className="mb-3">
                                <label> Your Full Name </label>
                                <input onChange={obj=>setFullName(obj.target.value)} type="text" className="form-control" value={fullName}/>
                                <small className="text-danger"> {fullNameError} </small>
                            </div>
                            <div className="mb-3">
                                <label> Your Email Id </label>
                                <input onChange={obj=>setEmail(obj.target.value)} type="email" className="form-control" value={email}/>
                                <small className="text-danger"> {emailError} </small>
                            </div>
                            <div className="mb-3">
                                <label> Your Password </label>
                                <input onChange={obj=>setPassword(obj.target.value)} type="password" className="form-control" value={password}/>
                                <small className="text-danger"> {passwordError} </small>
                            </div>
                            <div className="mb-3">
                                <label> Your Mobile No </label>
                                <input onChange={obj=>setMobile(obj.target.value)} type="number" className="form-control" value={mobile}/>
                                <small className="text-danger"> {mobileError} </small>
                            </div>
                        </div>
                        <div className="card-footer text-center">
                            <button disabled={myBtn} onClick={registerVendor}className="btn btn-danger"> Register <i className="fa fa-user-plus"> </i> </button>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4"></div>
            </div>
        </div>
    )
}

export default CreateAccount;