import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/login.css";
import "./css/index.css";
import "./css/outHeader.css";
import "./css/customerSignup.css";
import OutHeader from "../components/OutHeader";
import Footer from "../components/Footer";

function CustomerSignUp() {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const categories = {
    Toys: 1,
    Clothing: 2,
    "Work Tools": 3,
    "Pet Supplies": 4,
    "Home Styling": 5,
    Cleaning: 6,
    Shoes: 7,
    Sport: 8,
    Accessories: 9,
    Furnishing: 10,
    Safety: 11,
    Beauty: 12,
  };

  const handleCategoryChange = (categoryId) => {
    const newSelectedCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];
    setSelectedCategories(newSelectedCategories);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const userData = {
      userName: formData.get("UserName"),
      password: formData.get("psw"),
      name: formData.get("name"),
      phoneNumber: formData.get("phoneNumber"),
      email: formData.get("email"),
      confirmPassword: formData.get("confirmPassword"),
      selectedCategories: selectedCategories,
    };

    // Check if password and confirm password match
    if (userData.password !== userData.confirmPassword) {
      window.alert("Passwords do not match. Please try again.");
      return;
    }

    try {
      const response = await fetch("/addNewUser/add-user-customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        navigate("/Login");
        window.alert("User added successfully!");
      } else {
        window.alert("Failed to sign up. Please try again.");
        setMessage(data.error || "Something went wrong");
      }
    } catch (error) {
      console.error("Error checking user: ", error.message);
      setMessage("Network error: " + error.message);
      window.alert("Failed to sign up. Please try again.");
    }
  };

  return (
    <body>
      <OutHeader />
      <div className="container">
        <h1>All4U</h1>
        <h2>Customer Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <input className="name" type="text" name="name" placeholder="Name" />
          <input
            className="UserName"
            type="text"
            name="UserName"
            placeholder="User Name"
            required
          />
          <input
            className="email"
            type="text"
            name="email"
            placeholder="Email"
            required
          />
          <input
            className="phoneNumber"
            type="tel"
            name="phoneNumber"
            placeholder="Phone Number"
            required
          />
          <input
            className="psw"
            type="password"
            name="psw"
            placeholder="Password"
            required
          />
          <input
            className="confirmPassword"
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            required
          />

          <div className="category-list">
            <h3>Select Your Favorite Categories:</h3>
            {Object.entries(categories).map(([categoryName, categoryId]) => (
              <label key={categoryId}>
                <input
                  type="checkbox"
                  value={categoryId}
                  checked={selectedCategories.includes(categoryId)}
                  onChange={() => handleCategoryChange(categoryId)}
                />
                {categoryName}
              </label>
            ))}
          </div>
          <button type="submit">Sign Up</button>
        </form>
        {message && <p>{message}</p>}
      </div>
      <Footer />
    </body>
  );
}

export default CustomerSignUp;
