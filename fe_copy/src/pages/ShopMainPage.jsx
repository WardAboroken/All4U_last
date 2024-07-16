import React, { useState, useEffect } from "react";
import InsideHeader from "../components/InsideHeader";
import Footer from "../components/Footer";
import "./css/index.css";
import "./css/shopMainPage.css";
import background_img from "../asserts/images/warmth_background.jpeg";

function ShopMainPage() {
  const [products, setProducts] = useState([]);
  const [userFavCategories, setUserFavCategories] = useState({
    preferredCategories: "",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/shop/get-products");

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setProducts(data); // Assuming the backend returns an array of products directly
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

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
          setUserFavCategories({
            preferredCategories: data.userInfo.preferredCategories,
          });
        } else {
          console.error("Failed to fetch user info");
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchProducts();
    fetchUserInfo();
  }, []);

  const getImagePath = (picturePath) => {
    try {
      return require(`../asserts/images/${picturePath}`).default;
    } catch (error) {
      console.error(`Image not found: ${picturePath}`);
      return require("../asserts/images/map.png").default; // Fallback image if not found
    }
  };

  return (
    <div>
      <InsideHeader />
      <main className="container">
        <section className="section1">
          <div className="hero-content">
            <h1>All4U</h1>
          </div>
          <img src={background_img} alt="backgroundImg" />
        </section>
        <section className="section2">
          <h2>Products</h2>
          <ul>
            {products.map((product) => (
              <li key={product.productId}>
                <img
                  src={getImagePath(product.picture_path)}
                  alt={product.productName}
                />
                <h3>{product.productName}</h3>
                <p>Price: ${product.price}</p>
                <ul>
                  <li>Description: {product.description}</li>
                  <li>Catalog Number: {product.catalogNumber}</li>
                  <li>Amount: {product.amount}</li>
                  <li>Size: {product.size}</li>
                  <li>Color: {product.color}</li>
                </ul>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default ShopMainPage;
