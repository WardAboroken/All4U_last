import React, { useEffect, useState } from "react";
import AdminHeader from "../components/AdminHeader";
import Footer from "../components/Footer";
import "./css/index.css";

function AdminMainPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch data from the backend
    const fetchData = async () => {
      try {
        const response = await fetch("/admin/getUsersStatus2"); // Replace with your API endpoint
        const result = await response.json();
        console.log("Fetched data:", result); // Debugging log to see the fetched data
        setData(result); // Assuming the result is an array of objects
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const confirmStatus = async (userName) => {
    console.log("Confirm button clicked for user:", userName); // Debugging log

    try {
      const response = await fetch(`/admin/updateStatus/${userName}/1`, {
        // Updated URL
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Fetch request sent. Response status:", response.status); // Debugging log for the fetch request

      if (response.ok) {
        alert("Status updated successfully!");
        setData((prevData) =>
          prevData.map((item) =>
            item.userName === userName ? { ...item, status: 1 } : item
          )
        );
      } else {
        const errorMessage = await response.text();
        console.error("Failed to update status:", errorMessage); // More detailed error logging
        alert("Failed to update status.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("An error occurred while updating status.");
    }
  };

  const handleReject = (userName) => {
    console.log("Reject button clicked for user:", userName); // Debugging log
    if (!userName) {
      console.error("UserName is undefined or invalid"); // Log if the userName is missing or invalid
      return;
    }

    console.log("Before alert for user:", userName); // Additional log to see the flow

    // Add your logic here for rejecting the entry
    alert(`Rejected row with userName: ${userName}`);

    console.log("After alert for user:", userName); // Additional log to see if this runs
  };

  return (
    <div>
      <AdminHeader />
      <main>
        <section className="section1">
          <h1>Admin Dashboard</h1>
          <table className="data-table">
            <thead>
              <tr>
                <th>name</th>
                <th>userName</th>
                <th>psw</th>
                <th>email</th>
                <th>phoneNumber</th>
                <th>typeOfUser</th>
                <th>subscriptionType</th>
                <th>businessName</th>
                <th>businessAddress</th>
                <th>description</th>
                <th>status</th>
                <th>Actions</th> {/* Added column for buttons */}
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.userName}</td>
                    <td>{item.psw}</td>
                    <td>{item.email}</td>
                    <td>{item.phoneNumber}</td>
                    <td>{item.typeOfUser}</td>
                    <td>{item.subscriptionType}</td>
                    <td>{item.businessName}</td>
                    <td>{item.businessAddress}</td>
                    <td>{item.description}</td>
                    <td>{item.status}</td>
                    <td>
                      <button onClick={() => confirmStatus(item.userName)}>
                        Confirm
                      </button>

                      <button onClick={() => handleReject(item.userName)}>
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="12">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
        <section className="section2"></section>
      </main>
      <Footer />
    </div>
  );
}

export default AdminMainPage;
