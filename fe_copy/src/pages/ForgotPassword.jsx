import React, { useState } from "react";
import "./css/login.css";
import { useNavigate } from "react-router-dom";
import OutHeader from "../components/OutHeader";
import Footer from "../components/Footer";
import "./css/forgotPassword.css"

function ForgotPassword() {
  const [userName, setUseName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    // Add code to submit the form data to the backend or perform validation

    navigate("/Login");
  };
  return (
    <body>
      <OutHeader />
      <div className="container">
        <h1>All4U</h1>
        <h2>Password Recovery</h2>
        <h3>To restore your your password you need to verify your personal details:</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="User Name"
            value={userName}
            onChange={(e) => setUseName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            required
          />
          <button type="submit">Recovery Password</button>
        </form>
      </div>
      <Footer />
    </body>
  );
}

export default ForgotPassword;
