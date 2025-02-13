
import Authentication from "./components/Authentication";
import SellerModule from "./seller/sellerapp";
import UserModule from "./user/userapp";
import { ToastContainer,toast } from "react-toastify";

function App() {
  
  if(localStorage.getItem("userId") == null){
    return(<Authentication/>);
  }
  else if(localStorage.getItem("sellerId") == null){
    return(<UserModule/>);
  }
  else{
    return(<SellerModule/>);
  }
  
}

export default App;