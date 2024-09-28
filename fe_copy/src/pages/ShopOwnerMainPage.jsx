import React, { useState, useEffect, useRef } from "react";
import "./css/index.css";
import "./css/shopOwnerMainPage.css";
import { API_URL } from "../constans.js";
import { useNavigate } from "react-router-dom";
import { Line, Bar, Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

function ShopOwnerMainPage() {
  const [outOfStockProducts, setOutOfStockProducts] = useState([]);
  const [newOrders, setNewOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState("");
  const [error, setError] = useState(null);
  const productsContainerRef = useRef(null);
  const ordersContainerRef = useRef(null);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [errorProducts, setErrorProducts] = useState(null);
  const [errorOrders, setErrorOrders] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const [loadingGraph, setLoadingGraph] = useState(true);
  const [errorGraph, setErrorGraph] = useState(null);
  const navigate = useNavigate();
  const [barGraphData, setBarGraphData] = useState({});
  const [pieGraphData, setPieGraphData] = useState({});
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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
          setUserInfo(data.userInfo);
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
    if (!userInfo.userName) return;
    const fetchOutOfStockProducts = async () => {
      try {
        const response = await fetch(
          `/order/get-out-of-stock-products/${userInfo.userName}`
        );
        if (response.ok) {
          const data = await response.json();
          console.log("Out of Stock Products: ", data); // Log the fetched data
          setOutOfStockProducts(data || []);
          setLoadingProducts(false);
        } else {
          console.error("Failed to fetch out-of-stock products");
          setErrorProducts("Failed to fetch out-of-stock products.");
          setLoadingProducts(false);
        }
      } catch (error) {
        console.error("Error fetching out-of-stock products:", error);
        setErrorProducts("Error fetching out-of-stock products.");
        setLoadingProducts(false);
      }
    };

    fetchOutOfStockProducts();
  }, [userInfo.userName]);

  // Navigate to PRODUCTS page to edit the product
  const handleEditProduct = (catalogNumber) => {
    navigate(`/ShopOwnerProductsPage?catalogNumber=${catalogNumber}`);
  };

  // Fetch new orders
  useEffect(() => {
    const fetchNewOrders = async () => {
      try {
        const response = await fetch(
          `/order/get-business-new-orders/${userInfo.userName}`
        );
        if (response.ok) {
          const data = await response.json();
          console.log("Business new orders >> ", data);
          setNewOrders(data);
        } else {
          setErrorOrders("Failed to fetch new orders.");
        }
      } catch (error) {
        setErrorOrders("Error fetching new orders.");
      } finally {
        setLoading(false);
      }
    };

    if (userInfo.userName) {
      fetchNewOrders();
    }
  }, [userInfo.userName]);

  // Helper function to scroll containers
  const scroll = (direction, containerRef) => {
    if (containerRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div>
      <main>
        <h1>{userInfo.businessName}</h1>
        {/* Out of Stock Products Section */}
        {outOfStockProducts.length > 0 && (
          <section className="out-of-stock-products">
            <h2 className="section-title">Out Of Stock Products</h2>
            {loadingProducts ? (
              <p>Loading...</p>
            ) : errorProducts ? (
              <p>{errorProducts}</p>
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
                      <button
                        className="replenish-button"
                        onClick={() => handleEditProduct(product.catalogNumber)}
                      >
                        Edit
                      </button>
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
        )}

        {/* Other sections */}
      </main>
    </div>
  );
}

export default ShopOwnerMainPage;
