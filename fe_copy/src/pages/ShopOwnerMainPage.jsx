import React from "react";
import ShopOwnerHeader from "../components/ShopOwnerHeader"; // Import the ShopOwnerHeader component
import Footer from "../components/Footer";
import "./css/index.css";
import "./css/shopOwnerMainPage.css"
import background_img from "../assets/images/warmth_background.jpeg"; // Ensure the path is correct

function ShopOwnerMainPage() {
  return (
    <div>
      {/* Header Component */}
      <ShopOwnerHeader />

      {/* Main Content */}
      <main>
        {/* Background Image Section */}
        <section className="section1">
          <img
            src={background_img}
            alt="background"
            className="background-image"
          />
        </section>

        {/* Section 2 for Content like Dashboard or Actions */}
        <section className="section2">
          {/* Example Content: You can replace this with actual dashboard content */}
          <div className="dashboard">
            <h2>Welcome to the Shop Owner Dashboard</h2>
            <p>
              Here you can manage orders, view statistics, and handle inventory.
            </p>
            {/* Add buttons or links to different functionalities */}
            <div className="dashboard-actions">
              <button>Manage Orders</button>
              <button>Manage Products</button>
              <button>View Sales Reports</button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Component */}
      <Footer />
    </div>
  );
}

export default ShopOwnerMainPage;
