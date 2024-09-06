import React, { useState, useEffect } from "react";
import CustomerHeader from "../components/CustomerHeader";
import Footer from "../components/Footer";
import { useParams, NavLink } from "react-router-dom"; // Import NavLink
import "./css/index.css";
import "./css/shopMainPage.css";
import background_img from "../assets/images/warmth_background.jpeg";
import { API_URL } from "../constans.js";


const CategoryPage = () => {
  const { categoryName } = useParams();
  const [categoryNumber, setCategoryNumber] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = {
    Toys: 1,
    Clothing: 2,
    WorkTools: 3,
    PetSupplies: 4,
    HomeStyling: 5,
    Cleaning: 6,
    Shoes: 7,
    Sport: 8,
    Accessories: 9,
    Furnishing: 10,
    Safety: 11,
    Beauty: 12,
  };

  useEffect(() => {
    const categoryNum = categories[categoryName];
    setCategoryNumber(categoryNum);

    if (!categoryNum) {
      setLoading(false); // Stop loading if category doesn't exist
      console.error(`Category "${categoryName}" does not exist.`);
      return;
    }

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

        const filteredProducts = data.filter(
          (product) => product.categoryNumber === categoryNum
        );
        setProducts(filteredProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false); // Stop loading when fetching is done
      }
    };

    fetchProducts();
  }, [categoryName]);

  const getImagePath = (picturePath) => {
    try {
      return require(`../assets/images/${picturePath}`).default;
    } catch (error) {
      console.error(`Image not found: ${picturePath}`);
      return require("../assets/images/map.png").default;
    }
  };

  if (loading) return <p>Loading products...</p>;

  if (!categoryNumber)
    return (
      <div>
        <CustomerHeader />
        <main className="container">
          <section className="sectionMain">
            <div className="hero-content">
              <h1>Category Not Found</h1>
              <p>The category "{categoryName}" does not exist.</p>
            </div>
            <img src={background_img} alt="backgroundImg" />
          </section>
        </main>
        <Footer />
      </div>
    );

  return (
    <div>
      <CustomerHeader />
      <main className="container">
        <section className="sectionMain">
          <div className="hero-content">
            <h1>{categoryName}</h1>
          </div>
          <img src={background_img} alt="backgroundImg" />
        </section>
        <section className="sectionProducts">
          <h2>Products</h2>
          <ul>
            {products.length > 0 ? (
              products.map((product) => (
                <li key={product.productId}>
                  {/* Wrap each product in a NavLink */}
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
              ))
            ) : (
              <p>No products found for the category "{categoryName}".</p>
            )}
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;
