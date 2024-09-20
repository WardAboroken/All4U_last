import React, { useState, useEffect, useRef } from "react";
import ShopOwnerHeader from "../components/ShopOwnerHeader";
import Footer from "../components/Footer";
import "./css/index.css";
import "./css/shopOwnerMainPage.css";
import { API_URL } from "../constans.js";
import { useNavigate } from "react-router-dom";

function ShopOwnerMainPage() {
  const [outOfStockProducts, setOutOfStockProducts] = useState([]);
  const [newOrders, setNewOrders] = useState([]);
  const [doneOrders, setDoneOrders] = useState([]);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const productsContainerRef = useRef(null);
  const ordersContainerRef = useRef(null);
  const doneOrdersContainerRef = useRef(null);

  const navigate = useNavigate();

  // Fetch user info to get the logged-in business owner's username
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch("/userinfo/getUserInfo", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
          const data = await response.json();
          setUserName(data.userInfo.userName);
          setError(null);
        } else {
          setError("Failed to fetch user info");
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        setError("Error fetching user info");
      }
    };

    fetchUserInfo();
  }, []);

  // Fetch out-of-stock products
  useEffect(() => {
    if (!userName) return;
    const fetchOutOfStockProducts = async () => {
      try {
        const response = await fetch(
          `/order/get-out-of-stock-products/${userName}`
        );
        if (response.ok) {
          const data = await response.json();
          setOutOfStockProducts(data || []);
          setLoading(false);
          setError(null);
        } else {
          setError("Failed to fetch out-of-stock products");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching out-of-stock products:", error);
        setError("Error fetching out-of-stock products");
        setLoading(false);
      }
    };

    fetchOutOfStockProducts();
  }, [userName]);

  // Fetch New Orders
  useEffect(() => {
    if (!userName) return;
    const fetchNewOrders = async () => {
      try {
        const response = await fetch(`/order/get-business-orders2/${userName}`);
        if (response.ok) {
          const data = await response.json();
          setNewOrders(data);
          setError(null);
        } else {
          setError("Failed to fetch new orders");
        }
      } catch (error) {
        console.error("Error fetching new orders:", error);
        setError("Error fetching new orders");
      }
    };

    fetchNewOrders();
  }, [userName]);

  // Fetch Done Orders
  useEffect(() => {
    if (!userName) return;
    const fetchDoneOrders = async () => {
      try {
        const response = await fetch(`/order/get-completed-orders/${userName}`);
        if (response.ok) {
          const data = await response.json();
          setDoneOrders(data);
          setError(null);
        } else {
          setError("Failed to fetch done orders");
        }
      } catch (error) {
        console.error("Error fetching done orders:", error);
        setError("Error fetching done orders");
      }
    };

    fetchDoneOrders();
  }, [userName]);

  // Navigate to Orders page and show order details
  const handleSelectOrder = (orderNumber) => {
    navigate(`/ShopOwnerOrdersPage?orderNumber=${orderNumber}`); // Navigate with orderNumber in query
  };

  // Helper function to scroll containers
  const scroll = (direction, containerRef) => {
    if (containerRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div>
      <ShopOwnerHeader />
      <main>
        {/* Out of Stock Products Section */}
        <section className="out-of-stock-products">
          <h2 className="section-title">Out Of Stock Products</h2>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <div className="arrow-container">
              <button
                className="arrow arrow-left"
                onClick={() => scroll("left", productsContainerRef)}
              >
                &lt;
              </button>
              <div className="products-container" ref={productsContainerRef}>
                {outOfStockProducts.map((product) => (
                  <div key={product.catalogNumber} className="product-card">
                    <p className="catalog-number">
                      Catalogue number: {product.catalogNumber}
                    </p>
                    <h3 className="product-name">{product.productName}</h3>
                    <img
                      src={`${API_URL}/uploads/${product.picturePath}`}
                      alt={product.productName}
                      className="product-image"
                    />
                    <button className="replenish-button">Replenish</button>
                  </div>
                ))}
              </div>
              <button
                className="arrow arrow-right"
                onClick={() => scroll("right", productsContainerRef)}
              >
                &gt;
              </button>
            </div>
          )}
        </section>

        {/* New Orders Section */}
        <section className="new-orders-section">
          <h2 className="section-title">New Orders</h2>
          <div className="arrow-container">
            <button
              className="arrow arrow-left"
              onClick={() => scroll("left", ordersContainerRef)}
            >
              &lt;
            </button>
            <div className="orders-container" ref={ordersContainerRef}>
              {newOrders.length === 0 ? (
                <p>No new orders available.</p>
              ) : (
                newOrders.map((order) => (
                  <div key={order.orderNumber} className="order-card">
                    <h4>Order number {order.orderNumber}</h4>
                    <p className="order-total-cost">
                      ${order.totalCost} TOTAL COST
                    </p>
                    <ul className="order-items-list">
                      <li>
                        Order Date: {new Date(order.date).toLocaleDateString()}
                      </li>{" "}
                      {/* Display Order Date */}
                    </ul>
                    <button
                      className="select-button"
                      onClick={() => handleSelectOrder(order.orderNumber)}
                    >
                      Select
                    </button>
                  </div>
                ))
              )}
            </div>
            <button
              className="arrow arrow-right"
              onClick={() => scroll("right", ordersContainerRef)}
            >
              &gt;
            </button>
          </div>
        </section>

        {/* Done Orders Section */}
        <section className="done-orders-section">
          <h2 className="section-title">Done Orders</h2>
          <div className="arrow-container">
            <button
              className="arrow arrow-left"
              onClick={() => scroll("left", doneOrdersContainerRef)}
            >
              &lt;
            </button>
            <div className="orders-container" ref={doneOrdersContainerRef}>
              {doneOrders.length === 0 ? (
                <p>No done orders available.</p>
              ) : (
                doneOrders.map((order) => (
                  <div key={order.orderNumber} className="order-card">
                    <h4>Order number {order.orderNumber}</h4>
                    <p className="order-total-cost">
                      ${order.totalCost} TOTAL COST
                    </p>
                    <ul className="order-items-list">
                      <li>
                        Order Date: {new Date(order.date).toLocaleDateString()}
                      </li>{" "}
                      {/* Display Order Date */}
                    </ul>
                    <button
                      className="select-button"
                      onClick={() => handleSelectOrder(order.orderNumber)}
                    >
                      Select
                    </button>
                  </div>
                ))
              )}
            </div>
            <button
              className="arrow arrow-right"
              onClick={() => scroll("right", doneOrdersContainerRef)}
            >
              &gt;
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default ShopOwnerMainPage;