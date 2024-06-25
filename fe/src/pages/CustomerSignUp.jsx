import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/login.css";
import "./css/customerSignup.css";

function CustomerSignUp() {
  const [name, setName] = useState("");
  const [userName, setUseName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [error, setError] = useState("");

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

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");

    const formData = {
      name,
      userName,
      email,
      number,
      password,
      selectedCategories,
    };

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigate("/UserTypeSelection");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Something went wrong");
      }
    } catch (error) {
      setError("Network error: " + error.message);
    }
  };

  return (
    <div className="container">
      <h1>All4U</h1>
      <h2>Customer Sign Up</h2>
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
        {error && <p className="error">{error}</p>}
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
    </div>
  );
}

export default CustomerSignUp;
