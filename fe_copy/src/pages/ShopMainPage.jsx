import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom"; // Import NavLink and useLocation
import CustomerHeader from "../components/CustomerHeader.jsx";
import Footer from "../components/Footer";
import "./css/shopMainPage.css";
import "./css/index.css";
import { API_URL } from "../constans.js";

import background_img from "../assets/images/warmth_background.jpeg";

function ShopMainPage() {
  const [products, setProducts] = useState([]);
  const [userFavCategories, setUserFavCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation(); // Hook to access the query parameter in the URL

  // Extract search term from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get("search");

  // Fetch user info and set favorite categories
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

  // Fetch products based on user favorites or search term
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
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

        // Filter products based on search term if provided
        if (searchTerm) {
          const searchResults = data.filter((product) =>
            product.productName.toLowerCase().includes(searchTerm.toLowerCase())
          );
          setProducts(searchResults);
        }
        // Filter products based on user's favorite categories if there are any
        else if (userFavCategories.length > 0) {
          const filteredProducts = data.filter((product) =>
            userFavCategories.includes(product.categoryNumber)
          );
          setProducts(filteredProducts);
        } else {
          setProducts(data); // If no favorite categories or search term, display all products
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [userFavCategories, searchTerm]); // Fetch whenever favorites or search term changes



  return (
    <div>
      <CustomerHeader />
      <main className="container">
        <section className="sectionMain">
          <div className="hero-content">
            <h1>All4U</h1>
          </div>
          <img src={background_img} alt="backgroundImg" />
        </section>
        <section className="sectionProducts">
          <h2>Products</h2>
          {loading ? (
            <p>Loading...</p>
          ) : products.length > 0 ? (
            <ul>
              {products.map((product) => (
                <li key={product.productId}>
                  <NavLink to={`/Product/${product.catalogNumber}`}>
                    <img
                      src={`${API_URL}/uploads/${product.picturePath}`}
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
          ) : (
            <p>
              No products found. Try a different search or explore all products.
            </p>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default ShopMainPage;
