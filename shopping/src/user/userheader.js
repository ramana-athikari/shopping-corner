import { Link } from "react-router-dom";
import { ToastContainer,toast } from "react-toastify";

const MyHeader = () =>{

    const Notification = () => toast(`Welcome - ${localStorage.getItem("userName")}`);

    return(
        <nav className="navbar navbar-expand-lg mybg sticky-top">
            <div className="container">
                <Link onClick={Notification} className="navbar-brand text-white fs-4" to="/"> <i className="fa fa-bag-shopping me-2">  </i> Shop Online </Link>
                <button className="navbar-toggler bg-white" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse text-white" id="navbarTogglerDemo03">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item me-4">
                            <Link className="nav-link hover text-white active" to="/"> <i className="fa fa-home"> </i> Home </Link>
                        </li>
                        <li className="nav-item me-4">
                            <Link className="nav-link hover text-white active" to="/cart"> <i className="fa fa-shopping-cart"> </i> My Cart </Link>
                        </li>
                        <li className="nav-item me-4">
                            <Link className="nav-link hover text-white active" to="/login"> <i className="fa fa-lock"> </i> Vendor Login </Link>
                        </li>
                        <li className="nav-item me-4">
                            <Link className="nav-link hover text-white active" to="/signup"> <i className="fa fa-user-plus"> </i> New Vendor </Link>
                        </li>
                        <li className="nav-item me-4">
                            Welcome - {localStorage.getItem("userName")} - <button onClick={Logout} className="btn btn-primary"> <i className="fa fa-power-off"> </i> Logout </button>
                            {/* {localStorage.getItem("userName")} <button onClick={Logout} className="btn btn-primary"> Logout </button> */}
                        </li>
                    </ul>
                </div>
                <ToastContainer/>
            </div>
        </nav>
    )
};

const Logout = () =>{
    localStorage.clear();
    window.location.href="/#/";
    window.location.reload();
}

export default MyHeader;