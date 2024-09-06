import React, { useState, useEffect } from "react";
import { API_URL } from "../constans.js";
import CustomerHeader from "../components/CustomerHeader.jsx";
import Footer from "../components/Footer";
import "./css/index.css";
import "./css/shopMainPage.css";
import background_img from "../assets/images/warmth_background.jpeg";
import "./css/basketCart.css"; // Import the CSS file for styling

const BasketCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch cart data from backend
  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await fetch("http://localhost:5000/cart"); // Ensure the URL is correct
      if (!response.ok) {
        throw new Error("Failed to fetch cart data.");
      }
      const data = await response.json();
      setCartItems(data);
      setLoading(false);
    } catch (error) {
      setError("Error fetching cart data.");
      setLoading(false);
    }
  };

  const updateCartItemQuantity = async (itemId, newQuantity) => {
    try {
      console.log("Item ID to update: ", itemId); // Debugging log
      const response = await fetch(`http://localhost:5000/cart/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity }), // Send new quantity in the request body
      });

      if (!response.ok) {
        throw new Error("Failed to update item quantity.");
      }

      const updatedCart = await response.json();
      setCartItems(updatedCart); // Update cart with new data from the backend
    } catch (error) {
      setError("Error updating item quantity.");
      console.error(error); // Log error to console
    }
  };

  // Remove item from cart
  const removeCartItem = async (itemId) => {
    try {
      const response = await fetch(`http://localhost:5000/cart/${itemId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to remove item from cart.");
      }

      const updatedCart = await response.json();
      setCartItems(updatedCart); // Update cart with new data from the backend
    } catch (error) {
      setError("Error removing item from cart.");
      console.error(error); // Log error to console
    }
  };

  // Handle Proceed to Checkout
  const handleCheckout = () => {
    alert(
      "Proceeding to PayPal checkout... (Implement PayPal integration here)"
    );
  };

  if (loading)
    return (
      <div>
        <CustomerHeader />
        <main className="container">
          <section className="sectionMain">
            <div className="hero-content">
              <h1>Loading..</h1>
            </div>
            <img src={background_img} alt="backgroundImg" />
          </section>
        </main>
        <Footer />
      </div>
    );
  if (error)
    return (
      <div>
        <CustomerHeader />
        <main className="container">
          <section className="sectionMain">
            <div className="hero-content">
              <h1>{error}</h1>
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
            <h1>{error}</h1>
          </div>
          <img src={background_img} alt="backgroundImg" />
        </section>
        <div className="basket-cart-container">
          {/* Left side: Shopping Cart */}

          <div className="cart-section">
            <h2>Shopping cart</h2>
            <p>You have {cartItems.length} items in your cart</p>
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.catalogNumber} className="cart-item">
                  <img
                    src={`${API_URL}/uploads/${item.image}`}
                    alt={item.name}
                    className="cart-item-image"
                  />
                  <div className="cart-item-details">
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <div className="cart-item-controls">
                      <input
                        type="number"
                        value={item.quantity}
                        min="1"
                        onChange={(e) =>
                          updateCartItemQuantity(
                            item.id,
                            Number(e.target.value)
                          )
                        }
                      />
                      <span>${item.price}</span>
                      <button
                        onClick={() => removeCartItem(item.id)}
                        className="remove-button"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right side: PayPal Checkout Section */}
          <div className="checkout-section">
            <h3>PayPal Details</h3>
            <input
              type="text"
              placeholder="PayPal Address"
              className="payment-input"
            />
            <input
              type="password"
              placeholder="PayPal Password"
              className="payment-input"
            />

            <h3>Shipping Address</h3>
            {/* Add Shipping Address Form Inputs Here */}

            <div className="summary-section">
              <p>
                Subtotal: $
                {cartItems
                  .reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                  )
                  .toFixed(2)}
              </p>
              <p>Shipping: $4</p>
              <p>
                Total (Tax incl.): $
                {(
                  cartItems.reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                  ) + 4
                ).toFixed(2)}
              </p>
            </div>
            <button onClick={handleCheckout} className="checkout-button">
              Checkout with PayPal →
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BasketCart;
