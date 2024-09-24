import React, { useState, useEffect, useMemo } from "react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { API_URL } from "../constans.js";
import CustomerHeader from "../components/CustomerHeader.jsx";
import Footer from "../components/Footer";
import PayPalCheckoutButton from "../components/PayPalCheckoutButton.jsx";
import "./css/index.css";
import "./css/shopMainPage.css";
import background_img from "../assets/images/warmth_background.jpeg";
import "./css/basketCart.css";

const BasketCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    userName: "",
    email: "",
    phoneNumber: "",
    image: "",
    address: "",
  });
  const [shopOwnerPaypalEmails, setShopOwnerPaypalEmails] = useState({});
  const [paidGroups, setPaidGroups] = useState([]);

  // Fetch customer info and cart items when component mounts
  useEffect(() => {
    fetchCustomerInfo();
    fetchCartItems();
  }, []);

  // Fetch shop owner PayPal emails when cart items or PayPal emails change
  useEffect(() => {
    const groupedItems = groupItemsByShopOwner(cartItems);
    Object.keys(groupedItems).forEach((userName) => {
      if (!shopOwnerPaypalEmails[userName]) {
        fetchShopOwnerInfo(userName);
      }
    });
  }, [cartItems, shopOwnerPaypalEmails]);

  const fetchCustomerInfo = async () => {
    try {
      const response = await fetch("/userinfo/getUserInfo", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        const data = await response.json();
        setCustomerInfo(data.userInfo);
      } else {
        console.error("Failed to fetch user info");
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const fetchShopOwnerInfo = async (userName) => {
    try {
      const response = await fetch(
        `/userInfo/getWorkerInfoByUserName/${encodeURIComponent(userName)}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setShopOwnerPaypalEmails((prevEmails) => ({
          ...prevEmails,
          [userName]: data.workerInfo.paypalEmail,
        }));
      } else {
        console.error("Failed to fetch shop owner info");
      }
    } catch (error) {
      console.error("Error fetching shop owner info:", error);
    }
  };

  const fetchCartItems = async () => {
    try {
      const response = await fetch("http://localhost:5000/cart");
      if (!response.ok) {
        throw new Error("Failed to fetch cart data.");
      }
      const data = await response.json();
      setCartItems(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching cart data:", error);
      setError("Error fetching cart data.");
      setLoading(false);
    }
  };

  const groupItemsByShopOwner = (items) => {
    return items.reduce((groups, item) => {
      const { userName } = item;
      if (!groups[userName]) {
        groups[userName] = [];
      }
      groups[userName].push(item);
      return groups;
    }, {});
  };

  const updateCartItemQuantity = async (catalogNumber, newQuantity) => {
    const item = cartItems.find((item) => item.catalogNumber === catalogNumber);
    if (!item) {
      console.error("Item not found in the cart");
      setError("Item not found in the cart.");
      return;
    }

    if (newQuantity < 1) {
      alert("Quantity must be at least 1.");
      return;
    }

    if (newQuantity > item.amount) {
      alert(
        `The maximum quantity available for this product is ${item.amount}.`
      );
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/cart/${encodeURIComponent(catalogNumber)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity: newQuantity }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `Failed to update item amount. Status: ${response.status}, Message: ${errorText}`
        );
        throw new Error("Failed to update item amount.");
      }

      const updatedCart = await response.json();
      setCartItems(updatedCart);
    } catch (error) {
      setError("Error updating item amount.");
      console.error("Error details:", error);
    }
  };

  const removeCartItem = async (catalogNumber) => {
    try {
      const response = await fetch(
        `http://localhost:5000/cart/${encodeURIComponent(catalogNumber)}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove item from cart.");
      }

      const updatedCart = await response.json();
      setCartItems(updatedCart);
    } catch (error) {
      setError("Error removing item from cart.");
      console.error(error);
    }
  };

  const handleCheckout = () => {
    const orders = Object.keys(checkoutGroups).map((userName) => {
      const paypalEmail =
        shopOwnerPaypalEmails[userName] || "no-paypal@example.com";
      return {
        paypalEmail,
        items: checkoutGroups[userName],
        userName, // Add userName here
      };
    });
    return orders;
  };

  const handlePlaceOrder = async (order) => {
    if (!order || !order.items || !Array.isArray(order.items)) {
      console.error("Invalid order or items for placing order.");
      return;
    }

    const preparedCartItems = order.items.map((item) => ({
      catalogNumber: item.catalogNumber,
      quantity: item.quantity,
    }));

    const orderPayload = {
      userName: customerInfo.userName,
      shippingAddress: customerInfo.address,
      cartItems: preparedCartItems,
    };

    try {
      const response = await fetch(`http://localhost:5000/order/addOrder`, {
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
      alert(
        `Order placed successfully for ${order.paypalEmail}! Order Number: ${result.orderNumber}`
      );

      // Remove only the paid items from the cart
      setCartItems((prevItems) =>
        prevItems.filter(
          (cartItem) =>
            !order.items.some(
              (paidItem) => paidItem.catalogNumber === cartItem.catalogNumber
            )
        )
      );

      // Mark the group as paid
      const userName = order.userName;
      if (userName) {
        setPaidGroups((prevPaid) => [...prevPaid, userName]);
      }
    } catch (error) {
      setError("Error placing order.");
      console.error("Error details:", error);
    }
  };

  // Memoizing the grouped cart items to avoid re-calculating on each render
  const checkoutGroups = useMemo(
    () => groupItemsByShopOwner(cartItems),
    [cartItems]
  );
  const orders = handleCheckout(); // Reintroducing handleCheckout properly

  return (
    <div>
      <CustomerHeader />
      <main className="container">
        <section className="sectionMain">
          <div className="hero-content">
            <h1>Your Cart</h1>
          </div>
        </section>

        <div className="basket-cart-container">
          {cartItems.length === 0 ? (
            <div className="empty-cart-message">
              <p>Your cart is empty. Start shopping now!</p>
            </div>
          ) : (
            orders.map((order) => {
              const { paypalEmail, items } = order;
              const userName = items[0]?.userName;

              if (!userName) {
                return <div>Error: Missing user information</div>;
              }

              const totalAmountForGroup = items
                .reduce((total, item) => total + item.price * item.quantity, 0)
                .toFixed(2);

              return (
                <div className="group-container" key={userName}>
                  <div className="cart-section">
                    <h3>Items from {userName}:</h3>
                    {items.map((item, index) => (
                      <div
                        key={item.catalogNumber || index}
                        className="cart-item"
                      >
                        <img
                          src={`${API_URL}/uploads/${item.picturePath}`}
                          alt={item.productName}
                          className="cart-item-image"
                        />
                        <div className="cart-item-controls">
                          <input
                            type="number"
                            value={item.quantity}
                            min="1"
                            max={item.amount}
                            onChange={(e) => {
                              const newQuantity = Number(e.target.value);
                              if (newQuantity <= item.amount) {
                                updateCartItemQuantity(
                                  item.catalogNumber,
                                  newQuantity
                                );
                              } else {
                                alert(
                                  "Quantity cannot exceed available stock."
                                );
                              }
                            }}
                          />
                          <span>${item.price}</span>
                          <button
                            onClick={() => removeCartItem(item.catalogNumber)}
                          >
                            🗑
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="checkout-section">
                    <h4>Checkout for {userName}</h4>
                    <p>
                      Total for {userName}: ${totalAmountForGroup}
                    </p>

                    {/* PayPal Button Component */}
                    <PayPalCheckoutButton
                      totalAmount={totalAmountForGroup}
                      paypalEmail={paypalEmail}
                      items={items}
                      handlePlaceOrder={handlePlaceOrder}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BasketCart;
