import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import InsideHeader from "../components/InsideHeader";
import Footer from "../components/Footer";
import "./css/productPage.css"; // Import the CSS

const ProductPage = () => {
  const { catalogNumber } = useParams();
  const [product, setProduct] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/shop/get-products", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          const filteredProduct = data.find(
            (product) => JSON.stringify(product.catalogNumber) === catalogNumber
          );

          if (filteredProduct) {
            setProduct(filteredProduct);
          } else {
            console.error("Product not found");
          }
        } else {
          console.error("Failed to fetch products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [catalogNumber]);

  const addToCart = () => {
    if (product) {
      setCart((prevCart) => [...prevCart, product]);
      console.log("Product added to cart:", product);
    }
  };

  if (!product)
    return (
      <div>
        <InsideHeader />
        <main className="container2">
          <section className="section-not-found">
            <div className="hero-content">
              <h1>Product Not Found</h1>
              <p>
                The product with catalog number "{catalogNumber}" does not
                exist.
              </p>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );

  return (
    <div>
      <InsideHeader />
      <main className="productContainer">
        <section className="section2">
          <div className="hero-content">
            <h1 className="product-name">{product.productName}</h1>
          </div>

          <img
            className="product-image"
            src={`/assets/images/${product.picturePath}`}
            alt={product.productName}
          />

          <div className="product-details">
            <p>
              <span>Price:</span> ${product.price}
            </p>
            <p>
              <span>Description:</span> {product.description}
            </p>
            <p>
              <span>Catalog Number:</span> {product.catalogNumber}
            </p>
            <p>
              <span>Amount:</span> {product.amount}
            </p>
            <p>
              <span>Size:</span> {product.size}
            </p>
            <p>
              <span>Color:</span> {product.color}
            </p>
          </div>

          <button className="add-to-cart-button" onClick={addToCart}>
            Add to Cart
          </button>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ProductPage;
