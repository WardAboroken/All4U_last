import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom"; // Import NavLink
import InsideHeader from "../components/InsideHeader";
import Footer from "../components/Footer";
import "./css/shopMainPage.css";
import "./css/index.css";

import background_img from "../assets/images/warmth_background.jpeg";

function ShopMainPage() {
  const [products, setProducts] = useState([]);
  const [userFavCategories, setUserFavCategories] = useState([]);

  useEffect(() => {
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
          const favData = data.userInfo.preferredCategories;
          console.log("User's favorite categories:", favData);

          // Parse the preferred categories as an array
          setUserFavCategories(JSON.parse(favData) || []);
        } else {
          console.error("Failed to fetch user info");
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/shop/get-products", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        if (userFavCategories.length > 0) {
          const filteredProducts = data.filter((product) =>
            userFavCategories.includes(product.categoryNumber)
          );
          setProducts(filteredProducts);
        } else {
          setProducts(data); // If no favorite categories, display all products
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    if (userFavCategories.length > 0) {
      fetchProducts();
    }
  }, [userFavCategories]);

  const getImagePath = (picturePath) => {
    try {
      return require(`../assets/images/${picturePath}`).default;
    } catch (error) {
      console.error(`Image not found: ${picturePath}`);
      return require("../assets/images/map.png").default;
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
                <NavLink to={`/Product/${product.catalogNumber}`}>
                  <img
                    src="http://localhost:5000/uploads"
                    // src={getImagePath(product.picture_path)}
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
                </NavLink>
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
