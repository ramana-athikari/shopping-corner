import { HashRouter, Routes, Route } from "react-router-dom";
import SellerDashboard from "./SellerDashboard";
import ManageProduct from "./SellerProductList";
import NewProduct from "./NewProduct";
import ManageOrder from "./ManageOrder";
import SellerLogin from "../components/SellerLogin";
import CreateSellerAccount from "../components/SellerSignup";
import SellerNavbar from "./SellerNavbar";
import MyFooter from "./SellerFooter";

const SellerModule = () => {

    return (
        <HashRouter>

            <SellerNavbar/>

            <Routes>
                <Route exact path="/" element={<SellerDashboard />} />
                <Route exact path="/SellerLogin" element={<SellerLogin />} />
                <Route exact path="/SellerSignup" element={<CreateSellerAccount />} />
                <Route exact path="/inventary" element={<ManageProduct />} />
                <Route exact path="/new-inventary" element={<NewProduct />} />
                <Route exact path="/order" element={<ManageOrder />} />
            </Routes>

            <MyFooter/>

        </HashRouter>
    )
}

export default SellerModule;