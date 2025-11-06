// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

// const SellerNavbar = () => {
//     const sellerName = localStorage.getItem("sellerName");

//     const navigate = useNavigate();

//     const logout = () => {
//         toast.info("Logged out successfully", { autoClose: 1500 });
//         localStorage.removeItem("sellerName");
//         localStorage.removeItem("sellerId");
//         navigate("/"); // Redirect to the dashboard page
//     };


//     return (
//         <nav className="navbar navbar-expand-md mybg sticky-top">
//             <div className="container">
//                 {/* <Link className="navbar-brand" href="/"> <i className="fa fa-wallet fa-2x me-2">  </i> Shopping <br/> Seller Hub </Link> */}
//                 <Link className="navbar-brand d-flex align-items-center text-white" to="/" style={{ fontSize: "1.2rem" }}>
//                     <i className="fa fa-shop me-2" style={{ fontSize: "1.5rem" }}> </i>
//                     <div className="d-flex flex-column lh-1">
//                         <span className="fw-semibold mb-1">Shopping Corner</span>
//                         <small style={{ fontSize: "0.8rem" }}>Seller Hub</small>
//                     </div>
//                 </Link>

//                 <button className="navbar-toggler text-light" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
//                     <span className="navbar-toggler-icon"></span>
//                 </button>

//                 <div className="collapse navbar-collapse" id="navbarTogglerDemo03">
//                     <ul className="navbar-nav ms-auto">
//                         <li className="nav-item me-4">
//                             <Link className="nav-link text-white hover" to="/"> <i className="fa fa-cogs"> </i> DashBoard </Link>
//                         </li>
//                         <li className="nav-item me-4">
//                             <Link className="nav-link text-white hover" to="/inventary"> <i className="fa fa-database"> </i> Inventary </Link>
//                         </li>
//                         <li className="nav-item me-4">
//                             <Link className="nav-link text-white hover" to="/new-inventary"> <i className="fa fa-plus"> </i> New Inventary </Link>
//                         </li>
//                         <li className="nav-item me-4">
//                             <Link className="nav-link text-white hover" to="/order"> <i className="fa fa-headset"> </i> Manage Order </Link>
//                         </li>
//                         {sellerName ? (
//                             <li className="nav-item dropdown">
//                                 <a
//                                     to="#"
//                                     className="nav-link dropdown-toggle text-white hover"
//                                     role="button"
//                                     data-bs-toggle="dropdown"
//                                     aria-expanded="false"
//                                 >
//                                     <i className="fa fa-user-circle me-1"></i> {sellerName}
//                                 </a>

//                                 <ul className="dropdown-menu  dropdown-menu-start" aria-labelledby="profileDropdown">
//                                     {/* <li>
//                                             <Link className="dropdown-item" to="/seller-profile">
//                                                 <i className="fa fa-id-badge me-2" /> View Profile
//                                             </Link>
//                                         </li> */}
//                                     <li>
//                                         <Link className="dropdown-item" to="/edit-profile">
//                                             <i className="fa fa-edit me-2" /> Edit Profile
//                                         </Link>
//                                     </li>
//                                     <li>
//                                         <Link className="dropdown-item" to="/change-password">
//                                             <i className="fa fa-key me-2" /> Change Password
//                                         </Link>
//                                     </li>
//                                     <li><hr className="dropdown-divider" /></li>
//                                     <li>
//                                         <button onClick={logout} className="dropdown-item">
//                                             <i className="fa fa-power-off me-2" /> Logout
//                                         </button>
//                                     </li>
//                                 </ul>
//                             </li>
//                         ) : (
//                             <li className="nav-item me-3">
//                                 <Link to="/SellerLogin" className="nav-link text-white fw-semibold">
//                                     <i className="fa fa-user-circle"> </i> Login / Signup
//                                 </Link>
//                             </li>
//                         )}
//                     {/* <button onClick={backToShop} className="btn btn-secondary mt-3">
//                                 ⬅ Back to Shop
//                             </button> */}
//                 </ul>
//             </div>
//         </div>
//         </nav>
//     );
// };

// export default SellerNavbar;

import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const SellerHeader = () => {
    const [sellerName, setSellerName] = useState(localStorage.getItem("sellerName") || "");
    const navigate = useNavigate();
    const location = useLocation();

    // Highlight active nav link
    const isActive = (path) => (location.pathname === path ? "text-warning fw-semibold" : "text-white");

    // Logout Seller
    const logoutSeller = () => {
        toast.info("Seller logged out successfully", { autoClose: 1500 });
        localStorage.removeItem("sellerId");
        localStorage.removeItem("sellerName");
        navigate("/?viewMode=seller");
    };

    // Switch to buyer view
    const switchToBuyer = () => {
        const buyerUrl = `${window.location.origin}/`;
        window.open(buyerUrl, "_blank", "noopener,noreferrer");
    };

    useEffect(() => {
        const seller = localStorage.getItem("sellerName") || "";
        setSellerName(seller);
    }, [location]);

    return (
        <nav className="navbar navbar-expand-md sticky-top" style={{ backgroundColor: "#b5128f" }}>
            <div className="container">
                <Link className="navbar-brand text-white fs-4 d-flex align-items-center" to="/">
                    <img
                        src="/shopping-icon.png"
                        alt="Seller Hub Icon"
                        style={{
                            width: "40px",
                            height: "40px",
                            marginRight: "10px",
                            borderRadius: "50%",
                        }}
                    />
                    <div>
                        <span>Shopping Corner</span>
                        <div style={{ fontSize: "13px", marginTop: "-5px" }}>Seller Hub</div>
                    </div>
                </Link>

                {/* Toggler for mobile */}
                <button
                    className="navbar-toggler text-white"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#sellerNavbar"
                    aria-controls="sellerNavbar"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Navbar Links */}
                <div className="collapse navbar-collapse" id="sellerNavbar">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item me-4">
                            <Link className={`nav-link ${isActive("/")}`} to="/">
                                <i className="fa fa-chart-line me-1"></i> Dashboard
                            </Link>
                        </li>

                        <li className="nav-item me-4">
                            <Link className={`nav-link ${isActive("/seller-inventory")}`} to="/seller-inventory">
                                <i className="fa fa-boxes me-1"></i> Inventory
                            </Link>
                        </li>

                        <li className="nav-item me-4">
                            <Link className={`nav-link ${isActive("/seller-add-product")}`} to="/seller-add-product">
                                <i className="fa fa-plus me-1"></i> New Inventory
                            </Link>
                        </li>

                        <li className="nav-item me-4">
                            <Link className={`nav-link ${isActive("/seller-orders")}`} to="/seller-orders">
                                <i className="fa fa-list-check me-1"></i> Manage Orders
                            </Link>
                        </li>

                        <li className="nav-item me-4">
                            <Link onClick={switchToBuyer} className="nav-link text-white hover">
                                <i className="fa fa-user me-1"></i> Switch to Buyer
                            </Link>
                        </li>

                        {/* Dropdown for Seller */}
                        {sellerName ? (
                            <li className="nav-item dropdown">
                                <a
                                    href="#"
                                    className="nav-link dropdown-toggle text-white"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <i className="fa fa-user-circle me-1"></i> {sellerName}
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end">
                                    <li>
                                        <Link className="dropdown-item" to="/seller-profile">
                                            <i className="fa fa-user me-2"></i> Profile
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item" to="/change-password">
                                            <i className="fa fa-key me-2"></i> Change Password
                                        </Link>
                                    </li>
                                    <li>
                                        <hr className="dropdown-divider" />
                                    </li>
                                    <li>
                                        <button className="dropdown-item" onClick={logoutSeller}>
                                            <i className="fa fa-sign-out-alt me-2"></i> Logout
                                        </button>
                                    </li>
                                </ul>
                            </li>
                        ) : (
                            <li className="nav-item">
                                <Link to="/seller-login" className="nav-link text-white fw-semibold">
                                    <i className="fa fa-sign-in-alt"></i> Login/Signup
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default SellerHeader;
