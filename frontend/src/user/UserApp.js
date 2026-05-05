import { HashRouter, Routes, Route } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import ProductList from "./HomePage";
import MyFooter from "./Footer";
import UserHeader from "./UserNavbar";
import MyCart from "./MyCart";
import UserLogin from "../components/UserLogin";
import UserSignUp from "../components/UserSignUp";
import ChangePassword from "./UserPasswordManager";
import EditUserProfile from "./EditUserProfile";
import MyOrders from "./MyOrders";
import ProductDetails from "./ProductDetails";
import { ToastContainer } from "react-toastify";

const UserModule = () => {

    return (
        <HashRouter>
            <UserHeader />

            <ToastContainer
                position="top-right"
                autoClose={1500}
                newestOnTop
                closeOnClick
                pauseOnHover
            />

            <Routes>
                <Route exact path="/product/:id" element={<ProductDetails />} />
                <Route exact path="/" element={<ProductList />} />
                <Route exact path="/MyCart" element={<MyCart />} />
                <Route exact path="/UserLogin" element={<UserLogin />} />
                <Route exact path="/UserSignUp" element={<UserSignUp />} />
                <Route exact path="/change-password" element={<ChangePassword />} />
                <Route exact path="/edit-profile" element={<EditUserProfile />} />
                <Route exact path="/myOrders" element={<MyOrders />} />
            </Routes>

            <MyFooter />
        </HashRouter>
    );
};

export default UserModule;
