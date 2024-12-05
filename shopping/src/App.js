
import SellerModule from "./seller/sellerapp";
import UserModule from "./user/userapp";


function App() {

  if(localStorage.getItem("sellerId") == null){
    return(<UserModule/>);
  }
  else{
    return(<SellerModule/>);
  }
}

export default App;
