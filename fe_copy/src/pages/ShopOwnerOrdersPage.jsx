import React, { useState, useEffect } from "react";
import "./css/shopOwnerOrdersPage.css"; // Add CSS to style the Orders page

const ShopOwnerOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    // Fetch orders from backend
    const fetchOrders = async () => {
      try {
        const response = await fetch("/orders/get-orders");
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

    fetchOrders();
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
    // Update order status in the backend
    // Update order status in state
  };

  return (
    <div className="orders-page">
      <h1>Orders List</h1>
      <div className="search-filter">
        <input
          type="text"
          placeholder="Search order..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <button>Filter</button>
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
                    handleStatusChange(order.orderId, e.target.value)
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
                <button>Details</button>
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
