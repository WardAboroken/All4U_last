import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import basket_cart from "../asserts/images/shopping-cart.png";
import user_profile from "../asserts/images/user_profile.jpeg"; // Adjust the path
import "../pages/css/insideHeader.css"; // Adjust the path as per your project structure

const InsideHeader = () => {
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    userName: "",
    email: "",
    phoneNumber: "",
    image: "", // Added image field
  });

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch("/userinfo/getUserInfo", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUserInfo(data.userInfo);
      } else {
        console.error("Failed to fetch user info");
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const toggleCategoryDropdown = () => {
    setShowCategoryDropdown(!showCategoryDropdown);
    setShowProfileDropdown(false);
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
    setShowCategoryDropdown(false);
  };

  // Category list
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

  return (
    <header className="header">
      <div className="left-section">
        <div className="menu">
          <button className="toggleButton" onClick={toggleCategoryDropdown}>
            Categories
          </button>
          <div
            className={`dropdownContent ${showCategoryDropdown ? "show" : ""}`}
          >
            {Object.keys(categories).map((categoryName) => (
              <NavLink
                key={categories[categoryName]}
                to={`/${categoryName.replace(/\s+/g, "")}`}
                className="menuItem"
              >
                {categoryName}
              </NavLink>
            ))}
          </div>
        </div>
        <div className="searchBox">
          <input type="text" placeholder="Search..." />
          <button type="button">Search</button>
        </div>
      </div>
      <div className="right-section">
        <div className="profileInfo">
          <button className="menuItem" onClick={toggleProfileDropdown}>
            <img src={userInfo.image || user_profile} alt="User Profile" />
          </button>
          <div
            className={`profileDropdownContent ${
              showProfileDropdown ? "show" : ""
            }`}
          >
            <table>
              <tbody>
                <tr>
                  <th>Name</th>
                  <td>{userInfo.name}</td>
                </tr>
                <tr>
                  <th>User Name</th>
                  <td>{userInfo.userName}</td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td>{userInfo.email}</td>
                </tr>
                <tr>
                  <th>Phone Number</th>
                  <td>{userInfo.phoneNumber}</td>
                </tr>
              </tbody>
            </table>
            <NavLink to="/EditCustomerProfile" className="editProfileBtn">
              Edit Profile
            </NavLink>
            <NavLink to="/CustomerOrdersHistory" className="ordersHistoryBtn">
              Orders History =&gt;
            </NavLink>
            <NavLink to="/" className="logoutBtn">
              LogOut
            </NavLink>
          </div>
        </div>
        <div className="basketCart">
          <NavLink to="/cart" className="menuItem">
            <img src={basket_cart} alt="Basket" />
          </NavLink>
        </div>
      </div>
    </header>
  );
};

export default InsideHeader;
