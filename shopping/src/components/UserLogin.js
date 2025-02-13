import { useState } from "react";
import { Link } from "react-router-dom";

const UserLogin = () =>{

    // login credetials 

    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");

    // email and password validation 

    let [emailError, setEmailError] = useState("");
    let [passwordError, setPasswordError] = useState("");

    let [message,setMessage] = useState("Enter Login Details !");


    const LoginCheck = (obj) =>{

        obj.preventDefault();

        let formStatus = true;

        let epattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        //      mohit.mca209@gmail.com
        //      username + @ + domainname + . + extension

        if(!epattern.test(email)){
            setEmailError("Enter Email Id");
            formStatus = false;
        }else{
            setEmailError("");
        };
    
        if(password === ""){
            setPasswordError("Enter Password Id");
            formStatus = false;
        }else{
            setPasswordError("");
        };

        if(formStatus == false){
            setMessage("Enter Login Details !");
        }else{
            try {
                setMessage("Please Wait Processing...");
                fetch("http://localhost:1234/customerapi")
                .then(res => res.json())
                .then(userInfo=>{
                    let loginStatus = false;
                    for (let i=0; i<userInfo.length; i++ ){
                        let user = userInfo[i];
                        if(user.email == email && user.password == password){
                            loginStatus = true;
                            localStorage.setItem("userId", user.id);
                            localStorage.setItem("userName", user.fullname);
                            window.location.href="/#/";
                            window.location.reload();
                        }
                    }

                    if(loginStatus == false){
                        setMessage("Invalid Login Credentials !");
                    }
                });
            } catch (error) {
                console.error();
            }
        }
    }

    return(
        <div className="container mt-3">
            <marquee className="text-center text-danger fs-5 mb-5" direction="left"> 
                Welcome to the Shopping Portal, Please Login to buy the Products 
            </marquee>
            <form onSubmit={LoginCheck}>
                <div className="row">
                    <div className="col-lg-4"></div>
                    <div className="col-lg-4">
                        <div className="card">
                            <div className="card-header text-center fs-5">
                                User Login
                            </div>
                            <div className="card-body">
                                <div className="text-center mb-4"> <i className="fa-regular fa-user fa-3x"> </i> </div>
                                <div className="text-center text-danger"> {message} </div>
                                <div> 
                                    <label> Email </label>
                                    <input type="email" placeholder="enter email id" onChange={obj=>setEmail(obj.target.value)} name={email} className="form-control mb-2"/>
                                    <em className="text-danger"> {emailError} </em> 
                                </div>
                                <div>
                                    <label> Password </label>
                                    <input type="password" placeholder="enter password" onChange={obj=>setPassword(obj.target.value)} name={password} className="form-control"/> 
                                    <em className="text-danger"> {passwordError} </em> 
                                </div>
                            </div>
                            <div className="card-footer text-center">
                                <button className="btn btn-success mb-2" type="submit"> Submit </button>
                                <p> New Customer ? <Link to="/signup" className="text-decoration-none text-primary"> Sign Up </Link> </p>
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