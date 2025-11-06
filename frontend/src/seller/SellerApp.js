import { HashRouter, Routes, Route } from "react-router-dom";
import SellerDashboard from "./SellerDashboard";
import ManageProduct from "./ManageProduct";
import NewProduct from "./NewProduct";
import ManageOrder from "./ManageOrder";
import SellerLogin from "../components/SellerLogin";
import CreateSellerAccount from "../components/SellerSignup";
import SellerNavbar from "./SellerNavbar";
import MyFooter from "./SellerFooter";
import EditSellerProfile from "./EditSellerProfile";
import ChangeSellerPassword from "./SellerPasswordManager";

const SellerModule = () => {

    return (
        <HashRouter>

            <SellerNavbar/>

            <Routes>
                <Route exact path="/" element={<SellerDashboard />} />
                <Route exact path="/Seller-login" element={<SellerLogin />} />
                <Route exact path="/Seller-signup" element={<CreateSellerAccount />} />
                <Route exact path="/seller-inventory" element={<ManageProduct />} />
                <Route exact path="/seller-add-product" element={<NewProduct />} />
                <Route exact path="/seller-orders" element={<ManageOrder />} />
                <Route exact path="/seller-profile" element={<EditSellerProfile />} />
                <Route exact path="/change-password" element={<ChangeSellerPassword />} />
            </Routes>

            <MyFooter/>

        </HashRouter>
    )
}

export default SellerModule;