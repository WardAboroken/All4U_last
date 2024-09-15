import React, { useState, useEffect } from "react";
import "./css/shopOwnerOrdersPage.css"; // Ensure this file contains the required styles
import ShopOwnerHeader from "../components/ShopOwnerHeader";

const ShopOwnerOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    // Fetch user data and then orders for the logged-in business owner
    const fetchUserOrders = async () => {
      try {
        // Fetch logged-in user info first to get businessOwnerId
        const res = await fetch("/userinfo/getUserInfo", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) {
         
        }
        const data = await res.json();
        const businessOwnerId = data.userInfo.userName; // Ensure the field name matches your backend response

        if (!businessOwnerId) {
          console.error("Business owner ID is undefined.");
          return;
        }

        // Now fetch orders for the business owner using the correct ID
        const response = await fetch(
          `/order/get-business-orders/${businessOwnerId}`
        );
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
          setFilteredOrders(data);
        } else {
          console.error("Failed to fetch orders.");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchUserOrders();
  }, []);

  // Filter orders based on search term
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setFilteredOrders(
      orders.filter((order) =>
        order.orderNumber.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  };

  // Handle status update
  const handleStatusChange = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.orderId === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

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
        <button className="filter-button">Filter</button>
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
              <td>{order.date}</td>
              <td>
                <select
                  value={order.status}
                  onChange={(e) =>
                    handleStatusChange(order.orderNumber, e.target.value)
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
                <button className="details-button">
                  Details <span className="arrow">▼</span>
                </button>
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
