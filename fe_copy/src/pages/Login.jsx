import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./css/login.css";
import OutHeader from "../components/OutHeader";
import Footer from "../components/Footer";

function Login() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const handleLoginClick = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const userData = {
      userName: formData.get("UserName"),
      password: formData.get("psw"),
    };

    try {
      const response = await fetch("/login/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.success);
        navigate("/ShopMainPage");
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      console.error("Error checking user: ", error.message);
      setMessage("Invalid userName or password");
    }
  };

  return (
    <div>
      <OutHeader />
      <div className="container">
        <h2>Sign In</h2>
        <form onSubmit={handleLoginClick}>
          <input
            className="UserName"
            type="text"
            name="UserName"
            placeholder="UserName"
          />
          <input
            className="psw"
            type="password"
            name="psw"
            placeholder="Password"
          />
          <NavLink to="/ForgotPassword" className="menuItem_forgotPassword" end>
            Forgot Password?
          </NavLink>
          <button className="menuItem_login" type="submit">
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
        {message && <p>{message}</p>}
      </div>
      <Footer />
    </div>
  );
}

export default Login;
