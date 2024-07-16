import React, { useState, useEffect } from "react";
import InsideHeader from "../components/InsideHeader";
import Footer from "../components/Footer";
import "./css/index.css";
// import background_img from "../asserts/images/warmth_background.jpeg";

function ShopMainPage() {
  const [products, setProducts] = useState([]);
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

    fetchProducts();
  }, []);

  return (
    <div>
      <InsideHeader />
      <main>
        <section className="section1">
          {/* <img src={background_img} alt="backgroundImg" /> */}
        </section>
        <section className="section2">
          <h2>Products</h2>
          <ul>
            {products.map((product) => (
              <li key={product.productId}>
                <img
                  src={`../asserts/images/${product.picture_path}`}
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
