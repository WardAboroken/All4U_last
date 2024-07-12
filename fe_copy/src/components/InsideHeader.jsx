import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import basket_cart from "../asserts/images/shopping_cart_icon.jpeg";
import user_profile from "../asserts/images/user_profile.jpeg";
import "../pages/css/insideHeader.css"; // Adjust the path as per your project structure

function InsideHeader() {
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    username: "",
    email: "",
    phoneNumber: "",
  });

  useEffect(() => {
    // Fetch user info from session on component mount
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch("/login/userinfo", {
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
            <NavLink to="/toys" className="menuItem">
              Toys
            </NavLink>
            {/* Other category links */}
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
            <img src={user_profile} alt="User Profile" />
          </button>
          <div
            className={`profileDropdownContent ${
              showProfileDropdown ? "show" : ""
            }`}
          >
            <form action="">
              <table>
                <tr>
                  <th>Name</th>
                  <td>{userInfo.name}</td>
                </tr>
                <tr>
                  <td>User Name</td>
                  <td>{userInfo.username}</td>
                </tr>
                <tr>
                  <td>Email</td>
                  <td>{userInfo.email}</td>
                </tr>
                <tr>
                  <td>Phone Number</td>
                  <td>{userInfo.phoneNumber}</td>
                </tr>
              </table>
              <NavLink to="/EditProfile" className="editProfileBtn">
                Edit Profile
              </NavLink>
              <NavLink to="/CustomerOrdersHistory" className="ordersHistoryBtn">
                Orders History =&gt;
              </NavLink>
              <NavLink to="/" className="logoutBtn">
                LogOut
              </NavLink>
            </form>
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
}

export default InsideHeader;
