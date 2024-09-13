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
  const [shippingAddress, setShippingAddress] = useState(""); // Add a state for shipping address

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
      console.log("Fetched cart items from backend:", data); // Log fetched data
      setCartItems(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching cart data:", error);
      setError("Error fetching cart data.");
      setLoading(false);
    }
  };

  const updateCartItemAmount = async (catalogNumber, newAmount) => {
    try {
      console.log(
        `Updating item with catalogNumber: ${catalogNumber}, new amount: ${newAmount}`
      ); // Debug log

      const response = await fetch(
        `http://localhost:5000/cart/${encodeURIComponent(catalogNumber)}`, // Ensure the URL is correctly encoded
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: newAmount }), // Use 'amount' instead of 'quantity'
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `Failed to update item amount. Status: ${response.status}, Message: ${errorText}`
        ); // Improved error logging
        throw new Error("Failed to update item amount.");
      }

      const updatedCart = await response.json();
      setCartItems(updatedCart); // Update cart with new data from the backend
    } catch (error) {
      setError("Error updating item amount.");
      console.error("Error details:", error); // Detailed error logging
    }
  };

  // Remove item from cart
  const removeCartItem = async (catalogNumber) => {
    try {
      const response = await fetch(
        `http://localhost:5000/cart/${encodeURIComponent(catalogNumber)}`, // Ensure the URL is correctly encoded
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove item from cart.");
      }

      const updatedCart = await response.json();
      setCartItems(updatedCart); // Update cart with new data from the backend
    } catch (error) {
      setError("Error removing item from cart.");
      console.error(error);
    }
  };

  const handlePlaceOrder = async () => {
    if (!shippingAddress) {
      alert("Please enter a shipping address.");
      return;
    }

    // Validate required fields for each item in the cart
    console.log("Cart items before validation:", cartItems); // Log cart items before validation

    const preparedCartItems = cartItems
      .map((item, index) => {
        if (!item.catalogNumber || !item.amount) {
          // Validate 'amount'
          console.error(
            `Item at index ${index} is missing required fields:`,
            item
          ); // Log if fields are missing
          alert(
            "Some items are missing required fields. Please check your cart."
          );
          return null; // Return null if a field is missing
        }
        return {
          catalogNumber: item.catalogNumber, // Use `catalogNumber`
          amount: item.amount, // Use 'amount'
        };
      })
      .filter((item) => item !== null); // Remove invalid items

    console.log("Validated cart items ready for order:", preparedCartItems); // Log valid items

    if (preparedCartItems.length === 0) {
      alert(
        "Your cart is empty or contains invalid items. Please review your cart."
      );
      return;
    }

    // Prepare data to send to the server
    const orderPayload = {
      userName: "fofo", // Replace with the connected user
      shippingAddress: shippingAddress, // Shipping address
      cartItems: preparedCartItems, // Send valid items
    };

    console.log("Placing order with payload:", orderPayload); // Log data being sent to the server

    try {
      const response = await fetch("http://localhost:5000/order/addOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `Failed to place order. Status: ${response.status}, Message: ${errorText}`
        );
        throw new Error("Failed to place order.");
      }

      const result = await response.json();
      alert(`Order placed successfully! Order Number: ${result.orderNumber}`);
      setCartItems([]); // Clear cart after placing order
    } catch (error) {
      setError("Error placing order.");
      console.error("Error details:", error); // Log error message
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
            <h1>Your Cart</h1>
          </div>
          <img src={background_img} alt="backgroundImg" />
        </section>
        <div className="basket-cart-container">
          {/* Left side: Shopping Cart */}

          <div className="cart-section">
            <h2>Shopping cart</h2>
            <p>You have {cartItems.length} items in your cart</p>
            <div className="cart-items">
              {cartItems.map((item, index) => (
                <div key={item.catalogNumber || index} className="cart-item">
                  <img
                    src={`${API_URL}/uploads/${item.picturePath}`} // Corrected from 'image' to 'picturePath'
                    alt={item.productName} // Corrected from 'name' to 'productName'
                    className="cart-item-image"
                  />
                  <div className="cart-item-details">
                    <h3>{item.productName}</h3>{" "}
                    {/* Corrected from 'name' to 'productName' */}
                    <p>{item.description}</p>
                    <div className="cart-item-controls">
                      <input
                        type="number"
                        value={item.amount} // Use 'amount'
                        min="1"
                        onChange={(e) =>
                          updateCartItemAmount(
                            item.catalogNumber,
                            Number(e.target.value)
                          )
                        }
                      />
                      <span>${item.price}</span>
                      <button
                        onClick={() => removeCartItem(item.catalogNumber)}
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
            <input
              type="text"
              placeholder="Enter Shipping Address"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              className="shipping-input"
            />

            <div className="summary-section">
              <p>
                Subtotal: $
                {cartItems
                  .reduce(
                    (total, item) => total + item.price * item.amount, // Use 'amount'
                    0
                  )
                  .toFixed(2)}
              </p>
              <p>Shipping: $4</p>
              <p>
                Total (Tax incl.): $
                {(
                  cartItems.reduce(
                    (total, item) => total + item.price * item.amount, // Use 'amount'
                    0
                  ) + 4
                ).toFixed(2)}
              </p>
            </div>
            <button onClick={handleCheckout} className="checkout-button">
              Checkout with PayPal →
            </button>
            <button onClick={handlePlaceOrder} className="checkout-button">
              Place Order
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BasketCart;
