import React from "react";
import InsideHeader from "../components/InsideHeader"; // Make sure to import the InsideHeader component
import Footer from "../components/Footer";
import "./css/index.css";
import background_img from "../asserts/images/warmth_background.jpeg"; // Ensure the path is correct

function ShopMainPage() {
  return (
    <div>
      <InsideHeader />
      <main>
        <section className="section1">
          <img src={background_img} alt="backgroundImg" />
        </section>
        <section className="section2">
          
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default ShopMainPage;
