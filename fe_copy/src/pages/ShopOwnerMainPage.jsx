import React, { useState, useEffect, useRef } from "react"; // Import useRef to reference elements
import ShopOwnerHeader from "../components/ShopOwnerHeader"; // Import the ShopOwnerHeader component
import Footer from "../components/Footer";
import "./css/index.css";
import "./css/shopOwnerMainPage.css";
import { API_URL } from "../constans.js"; // Ensure this path is correct

function ShopOwnerMainPage() {
  const [outOfStockProducts, setOutOfStockProducts] = useState([]);
  const [newOrders, setNewOrders] = useState([]); // State to store new orders
  const [userName, setUserName] = useState(""); // State to store the username
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // References for containers to scroll
  const outOfStockRef = useRef(null);
  const newOrdersRef = useRef(null);

  // Scroll functions for the containers
  const scrollLeft = (ref) => {
    if (ref.current) ref.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = (ref) => {
    if (ref.current) ref.current.scrollBy({ left: 300, behavior: "smooth" });
  };

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
          setUserName(data.userInfo.userName); // Set the user's username
          setError(null); // Clear any previous errors
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

  // Fetch out-of-stock products for the business owner
  useEffect(() => {
    const fetchOutOfStockProducts = async () => {
      if (!userName) return; // Fetch only when userName is set
      try {
        const response = await fetch(
          `/order/get-out-of-stock-products/${userName}`
        );
        if (response.ok) {
          const data = await response.json();
          setOutOfStockProducts(data || []); // Ensure data is an array
          setLoading(false);
          setError(null); // Clear any previous errors
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

  // Fetch New Orders for the Business Owner
  useEffect(() => {
    const fetchNewOrders = async () => {
      if (!userName) return; // Fetch only when userName is set
      try {
        console.log("Fetching new orders for user:", userName); // Debugging log
        const response = await fetch(`/order/get-business-orders2/${userName}`); // Ensure this endpoint exists and is correct
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched new orders:", data); // Debugging log
          const ordersWithCatalogNumbers = await Promise.all(
            data.map(async (order) => {
              // Fetch catalog numbers for each order
              const catalogNumbers = await fetchCatalogNumbers(
                order.orderNumber
              );
              return { ...order, catalogNumbers };
            })
          );
          setNewOrders(ordersWithCatalogNumbers); // Set orders with catalog numbers
          setError(null); // Clear any previous errors
        } else {
          setError("Failed to fetch new orders");
          console.error("Failed to fetch new orders:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching new orders:", error);
        setError("Error fetching new orders");
      }
    };

    fetchNewOrders();
  }, [userName]);

  // Fetch Catalog Numbers for an order and user
  const fetchCatalogNumbers = async (orderNumber) => {
    try {
      const response = await fetch(
        `/order/get-catalog-numbers/${orderNumber}/${userName}`
      );
      if (response.ok) {
        const catalogNumbers = await response.json();
        return catalogNumbers; // Return catalog numbers
      } else {
        console.error("Failed to fetch catalog numbers");
        return [];
      }
    } catch (error) {
      console.error("Error fetching catalog numbers:", error);
      return [];
    }
  };

  return (
    <div>
      {/* Header Component */}
      <ShopOwnerHeader />

      {/* Main Content */}
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
                onClick={() => scrollLeft(outOfStockRef)}
              >
                {"<"}
              </button>
              <div className="products-container" ref={outOfStockRef}>
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
                onClick={() => scrollRight(outOfStockRef)}
              >
                {">"}
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
              onClick={() => scrollLeft(newOrdersRef)}
            >
              {"<"}
            </button>
            <div className="orders-container" ref={newOrdersRef}>
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
                      {order.catalogNumbers &&
                      order.catalogNumbers.length > 0 ? (
                        order.catalogNumbers.map((catalogNumber, idx) => (
                          <li key={idx}>Catalog Number: {catalogNumber}</li>
                        ))
                      ) : (
                        <li>No products available for this order</li>
                      )}
                    </ul>
                    <button className="select-button">Select</button>
                  </div>
                ))
              )}
            </div>
            <button
              className="arrow arrow-right"
              onClick={() => scrollRight(newOrdersRef)}
            >
              {">"}
            </button>
          </div>
        </section>
      </main>

      {/* Footer Component */}
      <Footer />
    </div>
  );
}

export default ShopOwnerMainPage;
