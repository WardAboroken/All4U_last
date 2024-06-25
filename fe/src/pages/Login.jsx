import React from "react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./css/login.css";

function Login() {
  const [page, setPage] = useState("");

  function handleClick(className) {
    if (className === "menuItem_forgotPassword") {
      setPage("/ForgotPassword");
    }
    
  }

  return (
    <div className="container">
      <h2>Sign In</h2>
      <form>
        <input className="UserName" type="text" placeholder="UserName" />
        <input className="Password" type="password" placeholder="Password" />
        <NavLink      className="menuItem_forgotPassword"
          onClick={handleClick()}
          to={page}
          
          end
        >
          Forgot Password?
        </NavLink>
        <button className="menuItem_login" onClick={handleClick}>
          Login
        </button>
        <NavLink to="/UserTypeSelection" className="menuItem_createAccount" end>
          Create Account
        </NavLink>
      </form>
    </div>
  );
}

export default Login;
