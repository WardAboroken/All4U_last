import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./css/login.css";
import Footer from "../components/Footer";
import OutHeader from "../components/OutHeader";

function ShopOwnerSignUp() {
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(""); // Change 'number' to 'phoneNumber'
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [subscriptionType, setSubscriptionType] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [address, setAddress] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // New state for success message
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if all required fields are filled
    if (
      !name ||
      !userName ||
      !email ||
      !phoneNumber || // Check 'phoneNumber' instead of 'number'
      !password ||
      !confirmPassword ||
      !subscriptionType ||
      !businessName ||
      !address
    ) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      // Form data to be sent to the backend
      const formData = {
        name,
        userName,
        email,
        phoneNumber, // Use 'phoneNumber' instead of 'number'
        password,
        subscriptionType,
        businessName,
        address,
        typeOfUser: "businessowner", // Default value for typeOfUser
      };

      // Log formData to verify it's correct
      console.log("Form data being sent:", formData);

      // Send POST request to backend endpoint
      const response = await axios.post(
        "/addNewUser/addUserShopOwner",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      // Check if response is successful
      if (response.status === 200) {
        // Display success message to the user
        setSuccessMessage("User added successfully!");

        // Navigate to another page upon successful submission
        navigate("/ShopMainPage");

        // Show an alert box for success (you can customize this as needed)
        window.alert("User added successfully!");
      } else {
        // Handle other status codes or errors
        setErrorMessage("Failed to sign up. Please try again.");

        // Show an alert box for failure (you can customize this as needed)
        window.alert("Failed to sign up. Please try again.");
      }
    } catch (error) {
      // Handle network error or server error
      console.error("Error signing up:", error);
      setErrorMessage("Failed to sign up. Please try again.");

      // Show an alert box for failure (you can customize this as needed)
      window.alert("Failed to sign up. Please try again.");
    }
  };

  return (
    <body>
      <OutHeader />
      <div className="container">
        <h1>All4U</h1>
        <h2>Shop Owner Sign Up</h2>
        {errorMessage && <p className="error">{errorMessage}</p>}
        {successMessage && <p className="success">{successMessage}</p>}
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
            onChange={(e) => setUserName(e.target.value)}
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
            value={phoneNumber} // Change 'number' to 'phoneNumber'
            onChange={(e) => setPhoneNumber(e.target.value)} // Change 'setNumber' to 'setPhoneNumber'
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
            placeholder="Business Name"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
          {/* Subscription Type Select */}
          <select
            value={subscriptionType}
            onChange={(e) => setSubscriptionType(e.target.value)}
            required
          >
            <option value="">Choose Subscription Type</option>
            <option value="basic">Basic</option>
            <option value="premium">Premium</option>
            <option value="enterprise">Enterprise</option>
          </select>
          <button type="submit">Continue</button>
        </form>
      </div>
      <Footer />
    </body>
  );
}

export default ShopOwnerSignUp;
