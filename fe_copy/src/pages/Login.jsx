import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./css/login.css";
import OutHeader from "../components/OutHeader";
import Footer from "../components/Footer";

function Login() {
  const navigate = useNavigate();

  function handleLoginClick(event) {
    event.preventDefault();
    navigate("/ShopMainPage");
  }

  return (
    <body>
      <OutHeader />
      <div className="container">
        <h2>Sign In</h2>
        <form>
          <input className="UserName" type="text" placeholder="UserName" />
          <input className="Password" type="password" placeholder="Password" />
          <NavLink to="/ForgotPassword" className="menuItem_forgotPassword" end>
            Forgot Password?
          </NavLink>
          <button className="menuItem_login" onClick={handleLoginClick}>
            Login
          </button>
          <NavLink
            to="/UserTypeSelection"
            className="menuItem_createAccount"
            end
          >
            Create Account
          </NavLink>
        </form>
      </div>
      <Footer/>
    </body>
  );
}

export default Login;
