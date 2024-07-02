import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/login.css";
import Footer from "../components/Footer";
import OutHeader from "../components/OutHeader";


function ShopOwnerSignUp() {
  const [name, setName] = useState("");
  const [userName, setUseName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    // Add code to submit the form data to the backend or perform validation

    // Navigate to ShopMainPage after form submission
    navigate("/ShopMainPage");
  };

  return (
    <body>
      <OutHeader/>
      <div className="container">
        <h1>All4U</h1>
        <h2>Shop Owner Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Shop Name"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Shop Address"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit">Continue</button>
        </form>
      </div>
      <Footer/>
    </body>
    
  );
}

export default ShopOwnerSignUp;
