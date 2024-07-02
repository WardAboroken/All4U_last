import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import basket_cart from "../asserts/images/shopping_cart_icon.jpeg";
import user_profile from "../asserts/images/user_profile.jpeg";
import "../pages/css/insideHeader.css"; // Adjust the path as per your project structure

function InsideHeader() {
  const [showDropdown, setShowDropdown] = useState(false); // State to control dropdown visibility

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown); // Toggle the showDropdown state
  };

  return (
    <header className="header">
      <div className="left-section">
        <div className="menu">
          <button className="toggleButton" onClick={toggleDropdown}>
            Categories
          </button>
          <div className={`dropdownContent ${showDropdown ? "show" : ""}`}>
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
      <div className="profileInfo">
        <NavLink to="/profile" className="menuItem">
          <img src={user_profile} alt="Basket" />
        </NavLink>
        <NavLink to="/cart" className="menuItem">
          <img src={basket_cart} alt="Basket" />
        </NavLink>
      </div>
    </header>
  );
}

export default InsideHeader;
