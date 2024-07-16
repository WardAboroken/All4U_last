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

    // Extract username and password from form data
    const formData = new FormData(event.target);
    const userData = {
      userName: formData.get("UserName"),
      psw: formData.get("psw"),
    };

    try {
      // Send login request to backend
      const response = await fetch("/login/loginController", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      // Parse response JSON data
      const data = await response.json();
      console.log("Login response:", data); // Log response for debugging

      // Handle response based on server's success or failure
      if (response.ok) {
        setMessage(data.message);
        navigate(data.redirectUrl); // Redirect to the specified URL after successful login
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error("Error checking user:", error.message);
      setMessage("Invalid username or password");
    }
  };

  return (
    <body>
      <OutHeader />
      <div className="container">
        <h2>Sign In</h2>
        <form onSubmit={handleLoginClick}>
          <input
            className="UserName"
            type="text"
            name="UserName"
            placeholder="Username"
          />
          <input
            className="psw"
            type="password"
            name="psw"
            placeholder="Password"
          />
          <button className="menuItem_login" type="submit">
            Login
          </button>
          <NavLink to="/ForgotPassword" className="menuItem_forgotPassword" end>
            Forgot Password?
          </NavLink>
        </form>
        {message && <p>{message}</p>}
      </div>
      <Footer />
    </body>
  );
}

export default Login;
