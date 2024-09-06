import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CustomerHeader from "../components/CustomerHeader";
import Footer from "../components/Footer";
import { NavLink } from "react-router-dom";
import "./css/productPage.css";
import { API_URL } from "../constans.js";

const ProductPage = () => {
  const { catalogNumber } = useParams();
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);

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

            // Assuming categoryNumber is a primitive value (like a number)
            const filteredProducts = data.filter(
              (pro) => pro.categoryNumber === filteredProduct.categoryNumber
            );

            setProducts(filteredProducts);
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

  // Function to handle adding product to the cart
  const addToCart = async () => {
    if (product) {
      try {
        const response = await fetch("/cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: product.catalogNumber, // or any unique identifier for the product
            name: product.productName,
            price: product.price,
            quantity: 1, // Default quantity; you can allow users to choose this
            image: product.picturePath,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to add item to cart");
        }

        const data = await response.json();
        console.log("Product added to cart successfully:", data);
        alert("Product added to cart successfully!");
      } catch (error) {
        console.error("Error adding product to cart:", error);
        alert("Error adding product to cart.");
      }
    }
  };

  if (!product)
    return (
      <div>
        <CustomerHeader />
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
      <CustomerHeader />
      <main className="productContainer">
        <section className="section2">
          <div className="hero-content">
            <h1 className="product-name">{product.productName}</h1>
          </div>

          <img
            src={`${API_URL}/uploads/${product.picturePath}`}
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
        <section className="sectionProducts">
          <h2>Related Products</h2>
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
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ProductPage;
