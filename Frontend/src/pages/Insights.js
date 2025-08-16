import React, { useEffect, useState } from "react";
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const districts = [
  "Ang Mo Kio", "Bedok", "Bishan", "Bukit Batok", "Bukit Merah", "Bukit Panjang", "Central Area", "Choa Chu Kang",
  "Clementi", "Geylang", "Hougang", "Jurong East", "Jurong West", "Kallang/Whampoa", "Marine Parade", "Pasir Ris",
  "Punggol", "Queenstown", "Sembawang", "Sengkang", "Serangoon", "Tampines", "Toa Payoh", "Woodlands", "Yishun"
];

const BASE_URL = "http://127.0.0.1:8000";

export default function Insights() {
  const [selectedDistrict, setSelectedDistrict] = useState("Woodlands");
  const [historical, setHistorical] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  // fetch data on district change
  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      try {
        const townParam = encodeURIComponent(selectedDistrict.toUpperCase());
        const histRes = await fetch(`${BASE_URL}/api/resale/resale_analysis/?towns=${townParam}&type=price_trends`);
        const predRes = await fetch(`${BASE_URL}/api/resale/ai_predict/?town=${townParam}`);

        const rawHistText = await histRes.text();
        const rawPredText = await predRes.text();

        if (!histRes.ok || !predRes.ok) throw new Error("API failed");

        const histData = JSON.parse(rawHistText);
        const predData = JSON.parse(rawPredText);

        const hist = [];
        const yearGroups = {};

        if (Array.isArray(histData)) {
          histData.forEach(item => {
            const year = item.year;
            const price = item.resale_price ?? item.avg_price ?? 0;

            if (!yearGroups[year]) yearGroups[year] = { total: 0, count: 0 };
            yearGroups[year].total += price;
            yearGroups[year].count += 1;
          });

          for (const [year, data] of Object.entries(yearGroups)) {
            hist.push({ year: Number(year), price: Math.round(data.total / data.count) });
          }

          hist.sort((a, b) => a.year - b.year);
        }

        const future = Array.isArray(predData?.predictions)
          ? predData.predictions.map(p => ({ year: p.year, price: Math.round(p.predicted_price) }))
          : [];

        setHistorical(hist);
        setPredictions(future);
      } catch (error) {
        console.error("Fetch error:", error);
        setHistorical([]);
        setPredictions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDistrict]);

  const allYears = [...new Set([...historical.map(d => d.year), ...predictions.map(d => d.year)])].sort((a, b) => a - b);
  const historicalMap = new Map(historical.map(d => [d.year, d.price]));
  const predictionsMap = new Map(predictions.map(d => [d.year, d.price]));

  const labels = allYears;
  const lastPrediction = predictions[predictions.length - 1]?.price ?? 0;

  const lineChartData = {
    labels,
    datasets: [
      {
        label: `Historical Prices in ${selectedDistrict}`,
        data: labels.map(year => historicalMap.get(year) ?? null),
        borderColor: "#1F77B4",
        backgroundColor: "rgba(31, 119, 180, 0.2)",
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: "#1F77B4",
        tension: 0.3,
      },
      {
        label: `Predicted Prices in ${selectedDistrict}`,
        data: labels.map(year => predictionsMap.get(year) ?? null),
        borderColor: "#D72638",
        backgroundColor: "rgba(215, 38, 56, 0.2)",
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: "#D72638",
        borderDash: [6, 4],
        tension: 0.3,
      },
    ],
  };

  const priceDifference =
    historical.length > 1 ? historical[historical.length - 1].price - historical[0].price : 0;

  const trendMessage = historical.length > 0
    ? priceDifference > 0
      ? `📈 Prices in ${selectedDistrict} have increased by $${priceDifference.toLocaleString()} since ${historical[0].year}.`
      : `📉 Prices in ${selectedDistrict} have decreased by $${Math.abs(priceDifference).toLocaleString()} since ${historical[0].year}.`
    : `No historical data available for ${selectedDistrict}.`;

  return (
    <div className="min-h-screen bg-gray-100 text-red-900">
      <Navbar />

      <div className="max-w-5xl mx-auto mt-12 px-6">
        {/* Page title */}
        <h1 className="text-5xl font-extrabold text-center mb-8 text-red-700">
          📊 AI-Powered Insights & Trends
        </h1>

        {/* District selector */}
        <div className="mb-6">
          <label className="text-lg font-semibold mr-3">Choose a District:</label>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="border px-4 py-2 rounded-lg bg-white shadow-sm"
          >
            {districts.map((district, index) => (
              <option key={index} value={district}>{district}</option>
            ))}
          </select>
        </div>

        {/* Chart section */}
        <div className="bg-white p-8 shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold mb-6 text-red-700">Resale Price Trend</h2>
          <div className="h-80">
            {loading ? (
              <p className="text-center text-gray-500">Loading chart...</p>
            ) : (
              <Line data={lineChartData} />
            )}
          </div>
        </div>

        {/* Prediction section */}
        <div className="mt-8 bg-white p-8 shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-purple-700">AI Price Prediction</h2>
          <p className="text-lg text-gray-800">
            📍 <strong>Estimated {predictions[predictions.length - 1]?.year ?? "N/A"} Resale Price:</strong>&nbsp;
            <span className="text-green-600 font-bold text-2xl">
              ${lastPrediction.toLocaleString()}
            </span>
          </p>
          <p className="text-gray-700 mt-3 text-lg">
            Based on trends, prices in {selectedDistrict} are projected to rise steadily.
          </p>
        </div>

        {/* Trend summary */}
        <div className="bg-white p-8 shadow-lg rounded-lg mt-8 text-center">
          <h2 className="text-2xl font-bold mb-4 text-blue-700">Market Summary</h2>
          <p className={`text-xl font-semibold ${priceDifference > 0 ? "text-green-600" : "text-red-600"}`}>
            {trendMessage}
          </p>
        </div>
      </div>
    </div>
  );
}