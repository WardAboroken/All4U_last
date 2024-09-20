import React, { useState, useEffect } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
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
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    userName: "",
    email: "",
    phoneNumber: "",
    image: "",
  });
  const [shopOwnerPaypalEmails, setShopOwnerPaypalEmails] = useState({});
  const [paidGroups, setPaidGroups] = useState([]); // State to track paid groups

  useEffect(() => {
    fetchCustomerInfo();
    fetchCartItems();
  }, []);

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
        headers: {
          "Content-Type": "application/json",
        },
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
          headers: {
            "Content-Type": "application/json",
          },
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

  const updateCartItemAmount = async (catalogNumber, newQuantity) => {
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
    const groupedItems = groupItemsByShopOwner(cartItems);
    // console.log("groupedItems: ", groupedItems);
    const orders = Object.keys(groupedItems).map((userName) => {
      const paypalEmail =
        shopOwnerPaypalEmails[userName] || "no-paypal@example.com";
      // console.log("paypalEmail: ", paypalEmail);
      return {
        paypalEmail,
        items: groupedItems[userName],
      };
    });
    //  console.log("orders: ", orders);
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

      // Clear cart and update state
      setCartItems([]);

      // Mark the group as paid
      const userName = order.items[0]?.userName;
      if (userName) {
        setPaidGroups((prevPaid) => [...prevPaid, userName]);
      }
    } catch (error) {
      setError("Error placing order.");
      console.error("Error details:", error);
    }
  };
  // Refactor to store the checkout data once before rendering the JSX
  const checkoutGroups = handleCheckout();

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
          {cartItems.length === 0 ? (
            <div className="empty-cart-message">
              <p>Your cart is empty. Start shopping now!</p>
            </div>
          ) : (
            <div>
              <p>
                You have {cartItems.length}{" "}
                {cartItems.length === 1 ? "item" : "items"} in your cart.
              </p>

              {checkoutGroups.map((order) => {
                const { paypalEmail, items } = order;
                const userName = items[0]?.userName;
                console.log(
                  "returned handleCheckout paypalEmail >>> ",
                  paypalEmail
                );

                if (!userName) {
                  console.error("No userName found for items:", items);
                  return null;
                }

                // Calculate total amount for this group of items
                const totalAmountForGroup = items
                  .reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                  )
                  .toFixed(2);

                return (
                  <div className="group-container" key={userName}>
                    {/* Left side: Shopping Cart for this shop owner */}
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
                                  updateCartItemAmount(
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
                              className="remove-button"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Right side: Payment options for this group */}
                    {userName && items.length > 0 && (
                      <div className="checkout-section">
                        <h4>Checkout for {userName}</h4>
                        <p>
                          Total for {userName}: ${totalAmountForGroup}
                        </p>{" "}
                        {/* Display total for this group */}
                        <PayPalScriptProvider
                          options={{
                            "client-id":
                              "Abyy9Z-JZx5mZiqXweLUvTFt5Ccg48FzSSeVCvo1MJmucY3Xfv_IiY75rwI9rkLbXzMuHoWMQTjvDv8D",
                          }}
                        >
                          <div className="paypal-button-container">
                            <PayPalButtons
                              createOrder={async (data, actions) => {
                                try {
                                  console.log(
                                    "createOrder paypalEmail >>> ",
                                    paypalEmail
                                  );
                                  // Validate PayPal email before proceeding
                                  if (
                                    !paypalEmail ||
                                    paypalEmail === "no-paypal@example.com"
                                  ) {
                                    alert(
                                      "Invalid PayPal email for this merchant."
                                    );
                                    return;
                                  }

                                  console.log(
                                    "paypalEmail before order creation:",
                                    paypalEmail
                                  );

                                  // If email is invalid, stop execution
                                  if (
                                    !paypalEmail ||
                                    paypalEmail === "no-paypal@example.com"
                                  ) {
                                    alert(
                                      "Invalid PayPal email for this merchant."
                                    );
                                    return; // Important: stop further execution
                                  }

                                  const orderID = await actions.order.create({
                                    purchase_units: [
                                      {
                                        amount: {
                                          value: totalAmountForGroup,
                                        },
                                        payee: {
                                          email_address: paypalEmail,
                                        },
                                      },
                                    ],
                                  });

                                  console.log(
                                    "Order created successfully, ID:",
                                    orderID
                                  );
                                  return orderID; // Make sure you return the order ID here
                                } catch (error) {
                                  console.error("Error creating order:", error);
                                  throw new Error("Order creation failed");
                                }
                              }}
                              onApprove={async (data, actions) => {
                                try {
                                  const details = await actions.order.capture();
                                  alert(
                                    "Transaction completed by " +
                                      details.payer.name.given_name
                                  );

                                  // Handle order placement after payment
                                  console.log(
                                    "before handlePlaceOrder paypalEmail >>> ",
                                    paypalEmail
                                  );
                                  console.log(
                                    "before handlePlaceOrder items >>> ",
                                    items
                                  );

                                  await handlePlaceOrder({
                                    paypalEmail: paypalEmail,
                                    items: items,
                                  });

                                  console.log(
                                    "after handlePlaceOrder paypalEmail >>> ",
                                    paypalEmail
                                  );
                                  console.log(
                                    "after handlePlaceOrder items >>> ",
                                    items
                                  );

                                  // Update cart by removing paid items
                                  setCartItems((prevItems) =>
                                    prevItems.filter(
                                      (cartItem) =>
                                        !items.some(
                                          (paidItem) =>
                                            paidItem.catalogNumber ===
                                            cartItem.catalogNumber
                                        )
                                    )
                                  );

                                  // Mark the user group as paid
                                  setPaidGroups((prevPaid) => [
                                    ...prevPaid,
                                    userName,
                                  ]);
                                } catch (error) {
                                  console.error("PayPal Checkout Error", error);
                                  setError(
                                    "An error occurred during the PayPal checkout process."
                                  );
                                }
                              }}
                              onError={(err) => {
                                console.error("PayPal Checkout Error", err);
                                setError(
                                  "An error occurred during the PayPal checkout process."
                                );
                              }}
                            />
                          </div>
                        </PayPalScriptProvider>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BasketCart;
