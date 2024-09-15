import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CustomerHeader from "../components/CustomerHeader";
import Footer from "../components/Footer";
import { NavLink } from "react-router-dom";
import "./css/productPage.css";
import { API_URL } from "../constans.js";

const ProductPage = () => {
  const { catalogNumber } = useParams(); // Get catalogNumber from the URL params
  const [product, setProduct] = useState(null); // State for the main product
  const [relatedProducts, setRelatedProducts] = useState([]); // State for related products

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
          const selectedProduct = data.find(
            (product) => String(product.catalogNumber) === catalogNumber
          );

          if (selectedProduct) {
            setProduct(selectedProduct);

            // Filter related products by category number
            const related = data.filter(
              (pro) =>
                pro.categoryNumber === selectedProduct.categoryNumber &&
                pro.catalogNumber !== selectedProduct.catalogNumber
            );

            setRelatedProducts(related);
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
            catalogNumber: product.catalogNumber,
            productName: product.productName,
            price: product.price,
            amount: 1, // Default amount
            picturePath: product.picturePath,
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

  // Render a loading or not found message if the product is not found
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
            className="product-image"
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

        {/* Related Products Section */}
        <section className="sectionProducts">
          <h2>Related Products</h2>
          <ul>
            {relatedProducts.map((relatedProduct) => (
              <li key={relatedProduct.catalogNumber}>
                <NavLink to={`/Product/${relatedProduct.catalogNumber}`}>
                  <img
                    src={`${API_URL}/uploads/${relatedProduct.picturePath}`}
                    alt={relatedProduct.productName}
                    className="related-product-image"
                  />
                  <h3>{relatedProduct.productName}</h3>
                  <p>Price: ${relatedProduct.price}</p>
                  <ul>
                    <li>Description: {relatedProduct.description}</li>
                    <li>Catalog Number: {relatedProduct.catalogNumber}</li>
                    <li>Amount: {relatedProduct.amount}</li>
                    <li>Size: {relatedProduct.size}</li>
                    <li>Color: {relatedProduct.color}</li>
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
