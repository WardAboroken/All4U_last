import React, { useState } from "react";
// import { saveAs } from "file-saver";

const SalesReport = ({ filteredData, fetchStartDate, fetchEndDate }) => {
  const [showReport, setShowReport] = useState(false);

  // Handle showing the report
  const handlePreviewReport = () => {
    setShowReport(true);
  };

  // Handle hiding the report
  const handleHideReport = () => {
    setShowReport(false);
  };

  // Function to generate and download the report
  const generateReport = () => {
    const csvHeaders = ["Order Number", "Date", "Status", "Total Cost"];
    const csvRows = filteredData.map((order) => [
      order.orderNumber,
      new Date(order.date).toLocaleDateString(),
      order.status,
      order.totalCost,
    ]);

    let csvContent = csvHeaders.join(",") + "\n";
    csvRows.forEach((row) => {
      csvContent += row.join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `sales-report-${fetchStartDate}-to-${fetchEndDate}.csv`);
  };

  return (
    <div>
      {/* Button to trigger preview */}
      <button onClick={handlePreviewReport}>Preview Report</button>

      {/* Conditionally display the report */}
      {showReport && (
        <div>
          <h3>Sales Report</h3>
          <table>
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Date</th>
                <th>Status</th>
                <th>Total Cost</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((order) => (
                <tr key={order.orderNumber}>
                  <td>{order.orderNumber}</td>
                  <td>{new Date(order.date).toLocaleDateString()}</td>
                  <td>{order.status}</td>
                  <td>${order.totalCost}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Buttons for download and hiding the report */}
          <button onClick={generateReport}>Download Report</button>
          <button onClick={handleHideReport}>Hide Report</button>
        </div>
      )}
    </div>
  );
};

export default SalesReport;
