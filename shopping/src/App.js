import { useEffect, useState } from "react";
import UserModule from "./user/UserApp";
import SellerModule from "./seller/SellerApp";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [activeModule, setActiveModule] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const viewModeFromURL = urlParams.get("viewMode");

    if (viewModeFromURL) {
      setActiveModule(viewModeFromURL); // Don't write to localStorage
    } else {
      const storedMode = localStorage.getItem("viewMode") || "user";
      setActiveModule(storedMode);
    }
  }, []);

  return (
    <>
      {activeModule === "user" && <UserModule />}
      {activeModule === "seller" && <SellerModule />}
      <ToastContainer />
    </>
  );
}

export default App;



// import Authentication from "./components/Authentication";
// import SellerModule from "./seller/sellerapp";
// import UserModule from "./user/userapp";
// import { ToastContainer } from "react-toastify";

// function App() {

//   if(localStorage.getItem("userId") == null){
//     return(<Authentication/>);
//   }
//   else if(localStorage.getItem("sellerId") == null){
//     return(<UserModule/>);
    
//   }
//   else{
//     return(<SellerModule/>);
//   }

//   <ToastContainer/>
  
// }

// export default App;