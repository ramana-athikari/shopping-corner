import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const UserHeader = () => {
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "");

  const navigate = useNavigate();
  const location = useLocation();

  const logoutMe = () => {
    toast.info("Logged out successfully", { autoClose: 1500 });
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    navigate("/");
  };

  const switchToSeller = () => {
    const sellerUrl = `${window.location.origin}/?viewMode=seller`;
    window.open(sellerUrl, "_blank");
  };

  useEffect(() => {
    const userName = localStorage.getItem("userName") || ""
    setUserName(userName);
  }, [location]);

  return (
    <nav className="navbar navbar-expand-md mybg sticky-top">
      <div className="container">
        <Link className="navbar-brand text-white fs-4" to="/">
          <img
            src="/shopping-icon.png"
            alt="Icon"
            style={{
              width: "40px",
              height: "40px",
              marginRight: "10px",
              borderRadius: "50%",
              backgroundColor: "transparent"
            }}
          />
          Shopping Corner
        </Link>

        {/* 🌐 Navbar Toggle Button */}
        <button
          className="navbar-toggler text-white"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarTogglerDemo03"
          aria-controls="navbarTogglerDemo03"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse text-white" id="navbarTogglerDemo03">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item me-4">
              <Link className="nav-link text-white hover" to="/">
                <i className="fa fa-home"></i> Home
              </Link>
            </li>
            <li className="nav-item me-4">
              <Link className="nav-link text-white hover" to="/MyCart">
                <i className="fa fa-shopping-cart"></i> Cart
              </Link>
            </li>
            <li className="nav-item me-4">
              <Link onClick={switchToSeller} className="nav-link text-white hover">
                <i className="fa fa-shop"></i> Become a Seller
              </Link>
            </li>

            {userName ? (
              <li className="nav-item dropdown me-3">
                <a
                  href="#"
                  className="nav-link dropdown-toggle text-white hover"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="fa fa-user-circle me-1"></i> {userName}
                </a>
                <ul className="dropdown-menu dropdown-menu-start">
                  {/* <li>
                    <Link className="dropdown-item" to="/user-profile">
                      <i className="fa fa-user me-2"></i> View Profile
                    </Link>
                  </li> */}
                  <li>
                    <Link className="dropdown-item" to="/myOrders">
                      <i className="fa fa-box-archive me-2"></i> Orders
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/edit-profile">
                      <i className="fa fa-edit me-2"></i> Edit Profile
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
                    <button className="dropdown-item" onClick={logoutMe}>
                      <i className="fa fa-sign-out-alt me-2"></i> Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <li className="nav-item me-3">
                <Link to="/UserLogin" className="nav-link text-white fw-semibold">
                  <i className="fa fa-sign-in-alt"></i> Login / Signup
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default UserHeader;
