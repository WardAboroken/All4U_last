import React from "react";
import * as XLSX from "xlsx"; // Excel export
import { saveAs } from "file-saver"; // Excel file download
import { CSVLink } from "react-csv"; // CSV export
import { Line, Bar, Pie } from "react-chartjs-2";

const SalesGraph = ({
  graphData,
  barGraphData,
  pieGraphData,
  headers,
  startDate,
  endDate,
  loadingGraph,
  errorGraph,
  setStartDate,
  setEndDate,
  exportToExcel,
}) => {
  return (
    <section className="graph-section" id="graphSection">
      <h2 className="section-title">Sales Overview</h2>

      {/* Date Range Picker */}
      <div className="date-range-picker">
        <label htmlFor="startDate">Start Date:</label>
        <input
          type="date"
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <label htmlFor="endDate">End Date:</label>
        <input
          type="date"
          id="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      {/* Export Buttons */}
      <div style={{ marginTop: "20px" }}>
        <button onClick={() => exportToExcel(graphData)} disabled={!graphData}>
          Export to Excel
        </button>
        <CSVLink
          data={graphData}
          headers={headers}
          filename={`SalesData_${new Date().toLocaleDateString()}.csv`}
        >
          <button disabled={!graphData}>Export to CSV</button>
        </CSVLink>
      </div>

      {/* Graphs */}
      {loadingGraph ? (
        <p>Loading graph...</p>
      ) : errorGraph ? (
        <p>{errorGraph}</p>
      ) : (
        <div className="chart-container">
          <div className="chart-item">
            <h3>Line Chart</h3>
            <Line data={graphData} />
          </div>
          <div className="chart-item">
            <h3>Bar Chart</h3>
            <Bar data={barGraphData} />
          </div>
          <div className="chart-item">
            <h3>Pie Chart</h3>
            <Pie data={pieGraphData} />
          </div>
        </div>
      )}
    </section>
  );
};

export default SalesGraph;
