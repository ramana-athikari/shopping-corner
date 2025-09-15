import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SellerNavbar = () => {
    const sellerName = localStorage.getItem("sellerName");
    
    const navigate = useNavigate();

    const logout = () => {
        toast.info("Logged out successfully", { autoClose: 1500 });
        localStorage.removeItem("sellerName");
        localStorage.removeItem("sellerId");
        navigate("/"); // Redirect to the dashboard page
    };


    return (
        <nav className="navbar navbar-expand-md mybg sticky-top">
            <div className="container">
                {/* <Link className="navbar-brand" href="/"> <i className="fa fa-wallet fa-2x me-2">  </i> Shopping <br/> Seller Hub </Link> */}
                <Link className="navbar-brand d-flex align-items-center text-white" to="/" style={{ fontSize: "1.2rem" }}>
                    <i className="fa fa-shop me-2" style={{ fontSize: "1.5rem" }}> </i>
                    <div className="d-flex flex-column lh-1">
                        <span className="fw-semibold mb-1">Shopping Corner</span>
                        <small style={{ fontSize: "0.8rem" }}>Seller Hub</small>
                    </div>
                </Link>

                <button className="navbar-toggler text-light" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarTogglerDemo03">
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li className="nav-item me-4">
                            <Link className="nav-link text-white hover" to="/"> <i className="fa fa-cogs"> </i> DashBoard </Link>
                        </li>
                        <li className="nav-item me-4">
                            <Link className="nav-link text-white hover" to="/inventary"> <i className="fa fa-database"> </i> Inventary </Link>
                        </li>
                        <li className="nav-item me-4">
                            <Link className="nav-link text-white hover" to="/new-inventary"> <i className="fa fa-plus"> </i> New Inventary </Link>
                        </li>
                        <li className="nav-item me-4">
                            <Link className="nav-link text-white hover" to="/order"> <i className="fa fa-headset"> </i> Manage Order </Link>
                        </li>
                        <li className="nav-item dropdown">
                            {sellerName ? (
                                <>
                                    <Link
                                        to="#"
                                        className="nav-link dropdown-toggle text-white hover"
                                        role="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        <i className="fa fa-user-circle me-1"></i> {sellerName}
                                    </Link>

                                    <ul className="dropdown-menu  dropdown-menu-start" aria-labelledby="profileDropdown">
                                        {/* <li>
                                            <Link className="dropdown-item" to="/seller-profile">
                                                <i className="fa fa-id-badge me-2" /> View Profile
                                            </Link>
                                        </li> */}
                                        <li>
                                            <Link className="dropdown-item" to="/edit-profile">
                                                <i className="fa fa-edit me-2" /> Edit Profile
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="dropdown-item" to="/change-password">
                                                <i className="fa fa-key me-2" /> Change Password
                                            </Link>
                                        </li>
                                        <li><hr className="dropdown-divider" /></li>
                                        <li>
                                            <button onClick={logout} className="dropdown-item">
                                                <i className="fa fa-power-off me-2" /> Logout
                                            </button>
                                        </li>
                                    </ul>
                                </>
                            ) : (
                                <Link to="/SellerLogin" className="nav-link text-white fw-semibold">
                                    <i className="fa fa-user-circle"> </i> Login / Signup
                                </Link>
                            )}
                        </li>


                        {/* <button onClick={backToShop} className="btn btn-secondary mt-3">
                                ⬅ Back to Shop
                            </button> */}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default SellerNavbar;