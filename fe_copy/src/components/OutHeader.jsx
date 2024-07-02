import React from 'react'
import { NavLink, Link } from "react-router-dom";


function OutHeader() {
  return (
    <header>
      <div className="header">
        <div className="header__wrap">
          <div className="logo">
            <Link to="/">
              <span className="slogan">All4U</span>
            </Link>
          </div>
          <nav className="loginMenu">
            <ul className="menu">
              <li>
                <NavLink
                  to="/Login"
                  className={({ isActive }) =>
                    isActive ? "menu-item active" : "menu-item"
                  }
                  end
                >
                  Login
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/UserTypeSelection"
                  className={({ isActive }) =>
                    isActive ? "menu-item active" : "menu-item"
                  }
                >
                  SignUp
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default OutHeader