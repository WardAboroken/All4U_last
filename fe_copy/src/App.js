import Footer from "./components/Footer";
import Header from "./components/Header";
import { Route, Routes } from "react-router-dom";
import CustomerSignUp from "./pages/CustomerSignUp";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword"
import MainPage from "./pages/MainPage";
import UserTypeSelection from "./pages/UserTypeSelection";
import ShopOwnerSignUp from "./pages/ShopOwnerSignUp"
// import ShopMainPage from "./pages/ShopMainPage"

function App() {
  const projectName = "Test Project";
  return (
    <body className="App">
      <Header />
      <div className="main">
        <Routes>
          <Route path="/CustomerSignUp" element={<CustomerSignUp />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/ForgotPassword" element={<ForgotPassword />} />
          <Route path="/UserTypeSelection" element={<UserTypeSelection />} />
          <Route path="/ShopOwnerSignUp" element={<ShopOwnerSignUp />} />
          <Route path="/" element={<MainPage data={projectName} />} />
          {/* <Route path="/ShopMainPage" element={<ShopMainPage/>}/> */}
        </Routes>
      </div>
      <Footer />
    </body>
  );
}
export default App;
