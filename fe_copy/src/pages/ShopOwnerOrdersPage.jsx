import React, { useState, useEffect } from "react";
import "./css/shopOwnerOrdersPage.css"; // Ensure this file contains the required styles
import ShopOwnerHeader from "../components/ShopOwnerHeader";
import { useLocation } from "react-router-dom"; // Import useLocation for reading query params

const ShopOwnerOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [visibleDetails, setVisibleDetails] = useState({}); // State to manage visibility of details
  const [orderDetails, setOrderDetails] = useState({}); // State to manage fetched order details
  const [userName, setUserName] = useState(""); // State to manage the logged-in user's username
  const [loading, setLoading] = useState(true); // State to handle loading
  const [selectedFilter, setSelectedFilter] = useState("All Orders"); // For the comboBox filter

  const location = useLocation(); // Hook to get the current URL location
  const queryParams = new URLSearchParams(location.search); // Parse query parameters from the URL
  const autoExpandOrderNumber = queryParams.get("orderNumber"); // Read the orderNumber query parameter

  useEffect(() => {
    // Fetch user data and then orders for the logged-in business owner
    const fetchUserOrders = async () => {
      try {
        const res = await fetch("/userinfo/getUserInfo", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) {
          console.error("Failed to fetch user info");
          return;
        }
        const data = await res.json();
        const businessOwnerId = data.userInfo.userName;

        if (!businessOwnerId) {
          console.error("Business owner ID is undefined.");
          return;
        }

        setUserName(businessOwnerId); // Set the userName for future use

        // Now fetch orders for the business owner using the correct ID
        const response = await fetch(`
          /order/get-business-orders/${businessOwnerId}`
        );
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
          setFilteredOrders(data);

          // After fetching orders, auto-expand the order details if needed
          if (autoExpandOrderNumber) {
            const orderExists = data.some(
              (order) => order.orderNumber.toString() === autoExpandOrderNumber
            );
            if (orderExists) {
              fetchOrderDetails(autoExpandOrderNumber); // Auto-fetch details for the order
            }
          }
        } else {
          console.error("Failed to fetch orders.");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false); // Stop loading after fetching
      }
    };

    fetchUserOrders();
  }, [autoExpandOrderNumber]); // Run the effect again if the query parameter changes

  // Function to fetch and display order details
  const fetchOrderDetails = async (orderNumber) => {
    if (!orderNumber) return; // Ensure orderNumber is valid

    try {
      const response = await fetch(`/order/get-order-details`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber, userName }), // Send both orderNumber and userName
      });
      if (response.ok) {
        const data = await response.json();
        setOrderDetails((prevDetails) => ({
          ...prevDetails,
          [orderNumber]: data,
        }));
        setVisibleDetails((prevDetails) => ({
          ...prevDetails,
          [orderNumber]: true, // Automatically set visibility to true
        }));
      } else {
        console.error("Failed to fetch order details.");
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  // Function to auto-expand the order details when the component mounts
  useEffect(() => {
    if (autoExpandOrderNumber && filteredOrders.length > 0) {
      fetchOrderDetails(autoExpandOrderNumber); // Fetch details automatically for the order
    }
  }, [autoExpandOrderNumber, filteredOrders]);

  // Toggle visibility of order details
  const toggleDetails = (orderNumber) => {
    if (visibleDetails[orderNumber]) {
      setVisibleDetails((prevDetails) => ({
        ...prevDetails,
        [orderNumber]: false,
      }));
    } else {
      fetchOrderDetails(orderNumber); // Fetch details when toggling open
    }
  };

  // Function to update order status in the backend
  const updateOrderStatus = async (orderNumber, catalogNumbers, newStatus) => {
    try {
      const response = await fetch(`
        /order/update-order-status/${orderNumber}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ catalogNumbers, status: newStatus }), // Send catalog numbers as an array
        }
      );

      if (response.ok) {
        console.log("Order status updated successfully");
      } else {
        console.error("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  // Function to handle status change
  const handleStatusChange = (orderNumber, catalogNumbers, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.orderNumber === orderNumber
          ? { ...order, status: newStatus }
          : order
      )
    );

    updateOrderStatus(orderNumber, catalogNumbers.split(","), newStatus)
      .then(() => {
        setFilteredOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderNumber === orderNumber
              ? { ...order, status: newStatus }
              : order
          )
        );
      })
      .catch((error) => {
        console.error("Error updating order status:", error);
      });
  };

  // Filter orders based on search term
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setFilteredOrders(
      orders.filter((order) =>
        order.orderNumber.toString().includes(e.target.value)
      )
    );
  };

  // Filter orders based on selected filter option
  const handleFilterChange = (e) => {
    setSelectedFilter(e.target.value);
    if (e.target.value === "All Orders") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(
        orders.filter((order) => order.status === e.target.value)
      );
    }
  };

  if (loading) {
    return <p>Loading orders...</p>;
  }

  return (
    <div className="orders-page">
      <ShopOwnerHeader />
      <h1>Orders List</h1>
      <div className="search-filter">
        <input
          type="text"
          placeholder="Search order..."
          value={searchTerm}
          onChange={handleSearch}
        />
        {/* Updated: Replacing the button with a filter comboBox */}
        <select
          className="filter-select"
          value={selectedFilter}
          onChange={handleFilterChange}
        >
          <option value="All Orders">All Orders</option>
          <option value="Received">Received</option>
          <option value="In preparation">In preparation</option>
          <option value="Ready">Ready</option>
          <option value="Underway">Underway</option>
          <option value="Been Provided">Been Provided</option>
        </select>
      </div>
      <table className="orders-table">
        <thead>
          <tr>
            <th>Order Number</th>
            <th>Date</th>
            <th>Status</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order.orderNumber}>
              <td>{order.orderNumber}</td>
              <td>{new Date(order.date).toLocaleDateString()}</td>
              <td>
                <select
                  value={order.status}
                  onChange={(e) =>
                    handleStatusChange(
                      order.orderNumber,
                      order.catalogNumbers,
                      e.target.value
                    )
                  }
                >
                  <option value="Received">Received</option>
                  <option value="In preparation">In preparation</option>
                  <option value="Ready">Ready</option>
                  <option value="Underway">Underway</option>
                  <option value="Been Provided">Been Provided</option>
                </select>
              </td>
              <td>
                <button
                  className="details-button"
                  onClick={() => toggleDetails(order.orderNumber)}
                >
                  Details
                </button>
                {visibleDetails[order.orderNumber] && (
                  <table className="order-details-table">
                    <thead>
                      <tr>
                        <th>Catalog Number</th>
                        <th>Product Name</th>
                        <th>Amount</th>
                        <th>Size</th>
                        <th>Color</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderDetails[order.orderNumber]?.map(
                        (product, index) => (
                          <tr key={index}>
                            <td>{product.catalogNumber}</td>
                            <td>{product.productName}</td>
                            <td>{product.amount}</td>
                            <td>{product.size}</td>
                            <td>{product.color}</td>
                            <td>${product.price}</td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <footer>
        <a href="/sales-progress">Click here to view your sales progress →</a>
      </footer>
    </div>
  );
};

export default ShopOwnerOrdersPage;