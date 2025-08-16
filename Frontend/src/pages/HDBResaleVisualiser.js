import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const API_URL = "http://127.0.0.1:8000/api/resale/";

export default function HDBResaleVisualizer() {
  const { mode } = useParams();
  const location = useLocation();

  const {
    selectedDistricts = [],
    selectedRoomType = "",
    selectedDistrict = "",
    selectedRoomTypes = [],
  } = location.state || {};

  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);
  const [selectedDatasetIndex, setSelectedDatasetIndex] = useState(null);

  // fetch once when page loads
  useEffect(() => {
    if (!hasFetched) {
      if (mode === "multi" && selectedDistricts.length && selectedRoomType) {
        fetchMultiDistrictData();
      } else if (mode === "single" && selectedDistrict && selectedRoomTypes.length) {
        fetchSingleDistrictData();
      }
      setHasFetched(true);
    }
  }, [mode, selectedDistricts, selectedRoomType, selectedDistrict, selectedRoomTypes, hasFetched]);

  const formatRoomType = (name) => name.toUpperCase().replace(/-/g, " ");

  // fetch data for single district view
  const fetchSingleDistrictData = () => {
    setLoading(true);
    setError(null);
    const queryParams = new URLSearchParams();
    queryParams.append("town", selectedDistrict);

    axios
      .get(`${API_URL}resale_roomtype_trends/?${queryParams.toString()}`)
      .then((res) => {
        const formattedRoomTypes = selectedRoomTypes.map(formatRoomType);
        processChartData(res.data, formattedRoomTypes, "flat_type");
      })
      .catch(handleError)
      .finally(() => setLoading(false));
  };

  // fetch data for multi-district view
  const fetchMultiDistrictData = () => {
    setLoading(true);
    setError(null);
    const queryParams = new URLSearchParams();
    selectedDistricts.forEach((town) => queryParams.append("towns", town));
    queryParams.append("room_type", selectedRoomType);
    queryParams.append("type", "price_trends");

    axios
      .get(`${API_URL}resale_analysis/?${queryParams.toString()}`)
      .then((res) => processChartData(res.data, selectedDistricts, "town"))
      .catch(handleError)
      .finally(() => setLoading(false));
  };

  // prepare chart data
  const processChartData = (data, categories, key) => {
    if (!data.length) {
      setError("No data found for the selected criteria.");
      return;
    }

    const yKey =
      data[0].resale_price !== undefined
        ? "resale_price"
        : data[0].avg_price !== undefined
        ? "avg_price"
        : null;

    if (!yKey) {
      setError("Unexpected data format from server.");
      return;
    }

    const uniqueYears = [...new Set(data.map((d) => Number(d.year)))].sort();

    const datasets = categories.map((category) => {
      const filtered = data.filter((d) => d[key].toUpperCase() === category.toUpperCase());

      return {
        label: category,
        data: uniqueYears.map((year) => {
          const match = filtered.find((d) => Number(d.year) === year);
          return match && match[yKey] ? Number(match[yKey]) : null;
        }),
        rawData: filtered,
        borderColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        tension: 0.1,
        fill: false,
      };
    });

    setChartData({ labels: uniqueYears, datasets });
  };

  // handle request error
  const handleError = (err) => {
    console.error("Fetch error:", err);
    setError("Failed to load data. Please try again.");
  };

  // chart configuration
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: { font: { size: 18, weight: "bold" } },
        onClick: (e, legendItem) => {
          setSelectedDatasetIndex((prev) =>
            prev === legendItem.datasetIndex ? null : legendItem.datasetIndex
          );
        },
      },
      title: {
        display: true,
        text: [
          mode === "multi"
            ? `Compare ${selectedRoomType} Room Type in Multiple Districts`
            : `Compare Multiple Room Types in ${selectedDistrict}`,
        ],
        font: { size: 16 },
      },
    },
    scales: {
      x: {
        title: { display: true, text: "Year", font: { size: 16 } },
      },
      y: {
        title: { display: true, text: "Resale Price (SGD)", font: { size: 16 } },
        beginAtZero: false,
      },
    },
  };

  return (
    <div className="min-h-screen bg-white text-red-900">
      <Navbar />

      {/* page title */}
      <h1 className="text-3xl font-bold text-center mt-6">HDB Resale Price Visualizer</h1>

      {/* main content area */}
      <div className="w-3/4 mx-auto mt-0 p-5 bg-white rounded-lg shadow">
        {loading && <p className="text-blue-500 mt-4">Loading...</p>}
        {error && <p className="text-red-500 mt-4">{error}</p>}

        {/* line chart */}
        {chartData && (
          <>
            <Line data={chartData} options={chartOptions} />
            <h3 className="text-base text-center mt-2">Click a legend label to show table</h3>

            {/* data table */}
            {selectedDatasetIndex !== null && (
              <div className="mt-8">
                <h2 className="text-xl font-bold text-center mb-2">
                  Data for: {chartData.datasets[selectedDatasetIndex].label}
                </h2>
                <table className="w-full border text-center border-gray-300 rounded">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 border">Year</th>
                      <th className="p-2 border">Average Resale Price (SGD)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chartData.labels.map((year, idx) => {
                      const price = chartData.datasets[selectedDatasetIndex].data[idx];
                      return (
                        <tr key={year}>
                          <td className="p-2 border">{year}</td>
                          <td className="p-2 border">{price ? `$${price.toLocaleString()}` : "N/A"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}