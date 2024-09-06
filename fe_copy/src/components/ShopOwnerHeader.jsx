import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import user_profile from "../assets/images/user_profile.jpeg"; // Ensure the path is correct
import "../pages/css//shopOwnerHeader.css"; // Ensure the path to your CSS file is correct

const ShopOwnerHeader = () => {
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

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  return (
    <header className="shop-owner-header">
      {/* Left Section: Logo or Shop Name */}
      <div className="header-left">
        <NavLink to="/ShopOwnerMainPage" className="shop-logo">
          All4U
        </NavLink>
      </div>

      {/* Center Section: Navigation Links */}
      <div className="header-center">
        <nav className="nav-links">
          <NavLink
            to="/ShopOwnerOrdersPage"
            className="nav-link"
            activeClassName="active-link"
          >
            Orders
          </NavLink>
          <NavLink
            to="/ShopOwnerProductsPage"
            className="nav-link"
            activeClassName="active-link"
          >
            Products
          </NavLink>
          <NavLink
            to="/ShopOwnerMainPage"
            className="nav-link"
            activeClassName="active-link"
          >
            Shop
          </NavLink>
        </nav>
      </div>

      {/* Right Section: User Profile Icon */}
      <div className="header-right">
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
            <NavLink to="/EditProfile" className="editProfileBtn">
              Edit Profile
            </NavLink>
            <NavLink to="/CustomerOrdersHistory" className="ordersHistoryBtn">
              Orders History &gt;
            </NavLink>
            <NavLink to="/" className="logoutBtn">
              LogOut
            </NavLink>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ShopOwnerHeader;
