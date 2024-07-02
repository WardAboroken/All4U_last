import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import basket_cart from "../asserts/images/shopping_cart_icon.jpeg";
import user_profile from "../asserts/images/user_profile.jpeg";
import "../pages/css/insideHeader.css"; // Adjust the path as per your project structure

function InsideHeader() {
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

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
            <NavLink to="/accessories" className="menuItem">
              Accessories
            </NavLink>
            <NavLink to="/clothing" className="menuItem">
              Clothing
            </NavLink>
            <NavLink to="/shoes" className="menuItem">
              Shoes
            </NavLink>
            <NavLink to="/workTools" className="menuItem">
              Work Tools
            </NavLink>
            <NavLink to="/homeStyling" className="menuItem">
              Home Styling
            </NavLink>
            <NavLink to="/sport" className="menuItem">
              Sport
            </NavLink>
            <NavLink to="/petSupplies" className="menuItem">
              Pet Supplies
            </NavLink>
            <NavLink to="/furnishing" className="menuItem">
              Furnishing
            </NavLink>
            <NavLink to="/beauty" className="menuItem">
              Beauty
            </NavLink>
            <NavLink to="/safety" className="menuItem">
              Safety
            </NavLink>
            <NavLink to="/cleaning" className="menuItem">
              Cleaning
            </NavLink>
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
              <input type="image" id="image" alt="Logout" src={user_profile} />
              <table>
                <tr>
                  <th>Name</th>
                  <th>
                    <input type="text" placeholder="Name" />
                  </th>
                </tr>
                <tr>
                  <td>User Name</td>
                  <td>
                    <input type="text" placeholder="Username" />
                  </td>
                </tr>
                <tr>
                  <td>Email</td>
                  <td>
                    <input type="text" placeholder="Email" />
                  </td>
                </tr>
                <tr>
                  <td>Phone Number</td>
                  <td>
                    <input type="text" placeholder="PhoneNumber" />
                  </td>
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
