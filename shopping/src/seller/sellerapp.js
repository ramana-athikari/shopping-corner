import { HashRouter, Routes, Route, Link } from "react-router-dom";
import SellerHome from "./dashboard";
import ManageProduct from "./productlist";
import NewProduct from "./newproduct";
import ManageOrder from "./order";

const SellerModule = () => {
    return (
        <HashRouter>
            <nav className="navbar navbar-expand-lg bg-body-tertiary sticky-top" data-bs-theme="dark">
                <div className="container">
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <Link className="navbar-brand" href="#"> <i className="fa fa-bag-shopping me-2">  </i> Shopping </Link>
                    <div className="collapse navbar-collapse" id="navbarTogglerDemo03">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li className="nav-item me-4">
                                <Link className="nav-link active" to="/dashboard"> <i className="fa fa-cogs"> </i> DashBoard </Link>
                            </li>
                            <li className="nav-item me-4">
                                <Link className="nav-link active" to="/inventary"> <i className="fa fa-database"> </i> Inventary </Link>
                            </li>
                            <li className="nav-item me-4">
                                <Link className="nav-link active" to="/new-inventary"> <i className="fa fa-plus"> </i> New Inventary </Link>
                            </li>
                            <li className="nav-item me-4">
                                <Link className="nav-link active" to="/order"> <i className="fa fa-headset"> </i> Manage Order </Link>
                            </li>
                            <li className="nav-item text-white">
                                Welcome - {localStorage.getItem("sellerName")} - <button onClick={logout} className="btn btn-warning"> <i className="fa fa-power-off"> </i> Logout </button> 
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        
            <Routes>
                <Route exact path="/dashboard" element={<SellerHome/>} />
                <Route exact path="/inventary" element={<ManageProduct/>} />
                <Route exact path="/new-inventary" element={<NewProduct/>} />
                <Route exact path="/order" element={<ManageOrder/>} />
            </Routes>
        </HashRouter>

    )
}

export default SellerModule;

const logout = () => {
    localStorage.removeItem("sellerId");
    localStorage.removeItem("sellerName");
    window.location.href="/#/";
    window.location.reload();
} 

// Component Name Not neccessary we can change the name also