import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserLogin from "./UserLogin";
import SignUp from "./SignUp";

const Authentication = () =>{
    return(
        <BrowserRouter>
            <Routes>
                <Route exact path="/" element={<UserLogin/>}/>
                <Route exact path="/signup" element={<SignUp/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default Authentication;