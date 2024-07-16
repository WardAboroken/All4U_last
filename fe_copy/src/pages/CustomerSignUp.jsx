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

  const categories = [
    "Toys",
    "Clothing",
    "Work Tools",
    "Pet Supplies",
    "Home Styling",
    "Cleaning",
    "Shoes",
    "Sport",
    "Accessories",
    "Furnishing",
    "Safety",
    "Beauty",
  ];

  const handleCategoryChange = (category) => {
    const newSelectedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
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
      typeOfUser: "customer",
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
        navigate("/ShopMainPage");
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
            {categories.map((category) => (
              <label key={category}>
                <input
                  type="checkbox"
                  value={category}
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                />
                {category}
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
