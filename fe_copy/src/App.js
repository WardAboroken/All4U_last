import { Route, Routes } from "react-router-dom";
import CustomerSignUp from "./pages/CustomerSignUp";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import MainPage from "./pages/MainPage";
import UserTypeSelection from "./pages/UserTypeSelection";
import ShopOwnerSignUp from "./pages/ShopOwnerSignUp";
import ShopMainPage from "./pages/ShopMainPage";
import CustomerOrdersHistory from "./pages/CustomerOrdersHistory";
import EditProfile from "./pages/EditProfile";
import ShopOwnerMainPage from "./pages/ShopOwnerMainPage";
import ResetPass from "./pages/ResetPass";
import CategoryPage from "./pages/CategoryPage";
import ProductPage from "./pages/ProductPage";
import BasketCart from "./pages/BasketCart";
import AdminMainPage from "./pages/AdminMainPage";
import ShopOwnerOrdersPage from "./pages/ShopOwnerOrdersPage.jsx"
import ShopOwnerProductsPage from "./pages/ShopOwnerProductsPage.jsx";

function App() {
  const projectName = "Test Project";
  return (
    <div className="App">
      <Routes>
        <Route path="/CustomerSignUp" element={<CustomerSignUp />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/UserTypeSelection" element={<UserTypeSelection />} />
        <Route path="/ShopOwnerSignUp" element={<ShopOwnerSignUp />} />
        <Route path="/" element={<MainPage data={projectName} />} />
        <Route path="/ShopMainPage" element={<ShopMainPage />} />
        <Route path="/ResetPass" element={<ResetPass />} />
        <Route path="/ShopOwnerMainPage" element={<ShopOwnerMainPage />} />
        <Route path="/ShopOwnerOrdersPage" element={<ShopOwnerOrdersPage />} />
        <Route
          path="/ShopOwnerProductsPage"
          element={<ShopOwnerProductsPage />}
        />
        <Route path="/ShopMainPage/:categoryName" element={<CategoryPage />} />
        <Route path="/AdminMainPage" element={<AdminMainPage />} />
        <Route
          path="/CustomerOrdersHistory"
          element={<CustomerOrdersHistory />}
        />
        <Route path="/EditProfile" element={<EditProfile />} />
        <Route path="/Product/:catalogNumber" element={<ProductPage />} />
        <Route path="/BasketCart" element={<BasketCart />} />
      </Routes>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
      />
      ;
    </div>
  );
}

export default App;
