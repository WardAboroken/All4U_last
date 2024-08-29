import React from "react";
import img from "../assets/images/artist photographer photography david welch-1.jpeg";
import "./css/outHeader.css";
import "./css/index.css";
import "./css/mainPage.css";
import OutHeader from "../components/OutHeader";
import Footer from "../components/Footer";

function MainPage() {
  return (
    <body>
      <OutHeader />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Merriweather|Open+Sans"
      />
      <div className="main-content">
        <section className="introduction">
          <h1 className="DivTitle">Welcome To All4U!</h1>
          <h4>An online shop that was made specially just for you.</h4>
          <p>
            <br />
            This site was built to make your shopping process easier and most
            importantly it will give you as much information as possible about
            the products you are interested in and thus help you organize a
            shopping list in the most convenient and safe way as you wish.
            <br />
            <br />
            You can find here some products in each category that might match
            your style and energy.
            <br />
            So please, take your time while choosing your perfect products and
            have a great time.
          </p>
          <br />
          <p className="pForInfo">
            WE ARE HERE FOR ANY QUESTION OF YOURS ;) <br />
            wardaboroken@gmail.com &#9993; taleemaddah@gmail.com
          </p>
        </section>
        <section className="products-image">
          <img src={img} alt="something" />
        </section>
      </div>
      <Footer />
    </body>
  );
}

export default MainPage;
