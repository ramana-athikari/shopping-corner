import { HashRouter, Routes, Route } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';

import ProductList from "./ProductList";
import MyFooter from "./Footer";
import UserHeader from "./UserNavbar";
import MyCart from "./cart1";
import UserLogin from "../components/UserLogin";
import UserSignUp from "../components/UserSignUp";

const UserModule = () => {

    return (
        <HashRouter>
            <UserHeader />

            <Routes>
                <Route exact path="/" element={<ProductList />} />
                <Route exact path="/cart1" element={<MyCart />} />
                <Route exact path="/UserLogin" element={<UserLogin/>}/>
                <Route exact path="/UserSignUp" element={<UserSignUp/>}/>
            </Routes>

            <MyFooter />
        </HashRouter>
    );
};

export default UserModule;
