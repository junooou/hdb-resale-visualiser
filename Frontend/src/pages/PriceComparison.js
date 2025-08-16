import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Line } from "react-chartjs-2";
import Navbar from "../homepage/Navbar";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TABLE_API = "http://127.0.0.1:8000/api/resale/resale_comparison/";
const GRAPH_API = "http://127.0.0.1:8000/api/resale/comparison_graph/";

const COLORS = [
  "#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#00c49f", "#0088fe", "#a4de6c"
];

// Price Comparison Page
const PriceComparison = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);

  const districts = (searchParams.get("districts")?.split(",") || []).map((d) => d.toUpperCase());
  const startTime = searchParams.get("startTime") || "Unknown";
  const endTime = searchParams.get("endTime") || "Unknown";
  const startMonthUI = searchParams.get("startMonthUI") || startTime;
  const endMonthUI = searchParams.get("endMonthUI") || endTime;

  const [view, setView] = useState("table");
  const [tableData, setTableData] = useState([]);
  const [graphData, setGraphData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const hasFetchedRef = useRef(false);

  // Fetch Data
  useEffect(() => {
    if (!hasFetchedRef.current && districts.length && startTime !== "Unknown" && endTime !== "Unknown") {
      fetchData();
      hasFetchedRef.current = true;
    }
  }, [districts, startTime, endTime]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    districts.forEach((town) => params.append("towns", town));
    params.append("start_year", startTime);
    params.append("end_year", endTime);

    try {
      const tableRes = await axios.get(`${TABLE_API}?${params.toString()}`);
      const tableFormatted = tableRes.data.map((entry) => ({
        town: entry.town,
        avg_price: Number(entry.avg_price).toFixed(2),
      }));
      setTableData(tableFormatted);

      const graphRes = await axios.get(`${GRAPH_API}?${params.toString()}&interval=year`);
      const grouped = {};

      graphRes.data.forEach(({ date, town, avg_price }) => {
        if (!grouped[town]) grouped[town] = [];
        grouped[town].push({ x: date, y: avg_price });
      });

      const datasets = Object.entries(grouped).map(([town, data], idx) => ({
        label: town,
        data,
        fill: false,
        borderColor: COLORS[idx % COLORS.length],
        tension: 0.3,
      }));

      const labels = [...new Set(graphRes.data.map((d) => d.date))].sort();
      setGraphData({ labels, datasets });
    } catch (err) {
      console.error("Error fetching comparison data:", err);
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  // Chart configuration
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 18,
            weight: "bold",
          },
        },
      },
      title: {
        display: true,
        text: "Average Resale Price Over Time",
        font: { size: 16 },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Year",
          font: { size: 16 },
        },
      },
      y: {
        title: {
          display: true,
          text: "Average Price ($)",
          font: { size: 16 },
        },
        beginAtZero: false,
      },
    },
  };

  return (
    <div className="min-h-screen bg-white text-red-900">
      <Navbar />

      <h1 className="text-3xl font-bold text-center mt-6">Price Comparison Page</h1>

      <div className="w-3/4 mx-auto mt-3 p-4 bg-white rounded-lg shadow">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold">
            Comparing Prices for:
            <span className="text-red-600 font-bold"> {districts.join(", ")}</span>
          </h2>
          <h3 className="text-lg text-gray-700 mt-2">
            Time Range: <span className="font-semibold">{startMonthUI} to {endMonthUI}</span>
          </h3>

          {/* View Toggle Buttons */}
          <div className="flex justify-center gap-4 mt-4">
            <button
              className={`px-6 py-3 font-bold rounded-lg transition ${view === "table" ? "bg-blue-600 text-white shadow-md" : "bg-gray-300 text-black"}`}
              onClick={() => setView("table")}
            >
              📋 Table View
            </button>
            <button
              className={`px-6 py-3 font-bold rounded-lg transition ${view === "graph" ? "bg-blue-600 text-white shadow-md" : "bg-gray-300 text-black"}`}
              onClick={() => setView("graph")}
            >
              📈 Graph View
            </button>
          </div>
        </div>

        {/* Table Section */}
        {view === "table" && (
          <div className="mt-4">
            {loading ? (
              <p className="text-blue-500">Loading...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-red-600 text-white">
                    <th className="border px-6 py-3">District</th>
                    <th className="border px-6 py-3">Time Range</th>
                    <th className="border px-6 py-3">Average Price</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, index) => (
                    <tr key={index} className="border bg-gray-50 hover:bg-gray-200 transition">
                      <td className="border px-6 py-3 text-center">{row.town}</td>
                      <td className="border px-6 py-3 text-center">{startMonthUI} - {endMonthUI}</td>
                      <td className="border px-6 py-3 text-center">${Number(row.avg_price).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Graph Section */}
        {view === "graph" && (
          <div className="mt-4">
            {loading ? (
              <p className="text-blue-500">Loading chart...</p>
            ) : (
              <Line data={graphData} options={chartOptions} />
            )}
          </div>
        )}

        {/* Navigation Button */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate("/map-selection")}
            className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg shadow-lg hover:bg-red-700 transition-all"
          >
            ⬅ Back to Selection
          </button>
        </div>
      </div>
    </div>
  );
};

export default PriceComparison;
