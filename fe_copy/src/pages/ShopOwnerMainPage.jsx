import React from "react";
import ShopOwnerHeader from "../components/ShopOwnerHeader"; // Make sure to import the ShopOwnerHeader component
import Footer from "../components/Footer";
import "./css/index.css";
import background_img from "../assets/images/warmth_background.jpeg"; // Ensure the path is correct

function ShopMainPage() {
  return (
    <body>
      <ShopOwnerHeader />
      <main>
        <section className="section1">
          <img src={background_img} alt="backgroundImg" />
        </section>
        <section className="section2"></section>
      </main>
      <Footer />
    </body>
  );
}

export default ShopMainPage;
