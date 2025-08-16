import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../homepage/Navbar";

const districts = [
  "Ang Mo Kio", "Bedok", "Bishan", "Bukit Batok", "Bukit Merah",
  "Bukit Panjang", "Bukit Timah", "Central Area", "Choa Chu Kang", "Clementi",
  "Geylang", "Hougang", "Jurong East", "Jurong West", "Kallang/Whampoa",
  "Marine Parade", "Pasir Ris", "Punggol", "Queenstown", "Sembawang",
  "Sengkang", "Serangoon", "Tampines", "Toa Payoh", "Woodlands", "Yishun"
];

const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Select on Map 
export default function MapSelection() {
  const navigate = useNavigate();
  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const [startYear, setStartYear] = useState("");
  const [startMonth, setStartMonth] = useState("");
  const [endYear, setEndYear] = useState("");
  const [endMonth, setEndMonth] = useState("");

  const handleDistrictSelection = (district) => {
    setSelectedDistricts((prev) =>
      prev.includes(district)
        ? prev.filter((d) => d !== district)
        : prev.length < 5
        ? [...prev, district]
        : prev
    );
  };

  const handleCompare = () => {
    if (!selectedDistricts.length) {
      alert("Please select at least one district.");
      return;
    }
    if (!startYear || !startMonth || !endYear || !endMonth) {
      alert("Please select a valid time range.");
      return;
    }

    const startIndex = months.indexOf(startMonth);
    const endIndex = months.indexOf(endMonth);

    const startTimeValue = parseInt(`${startYear}${String(startIndex + 1).padStart(2, "0")}`);
    const endTimeValue = parseInt(`${endYear}${String(endIndex + 1).padStart(2, "0")}`);

    if (endTimeValue < startTimeValue) {
      alert("End date must be later than start date.");
      return;
    }

    const startFormatted = `${startYear}-${String(startIndex + 1).padStart(2, "0")}`;
    const endFormatted = `${endYear}-${String(endIndex + 1).padStart(2, "0")}`;

    const displayStart = `${startMonth} ${startYear}`;
    const displayEnd = `${endMonth} ${endYear}`;

    const comparisonData = {
      districts: selectedDistricts,
      startTime: displayStart,
      endTime: displayEnd,
    };

    const existingHistory = JSON.parse(localStorage.getItem("recentComparisons")) || [];
    const updatedHistory = [comparisonData, ...existingHistory.slice(0, 4)];
    localStorage.setItem("recentComparisons", JSON.stringify(updatedHistory));

    const params = new URLSearchParams({
      districts: selectedDistricts.join(","),
      startTime: startFormatted,
      endTime: endFormatted,
      startMonthUI: displayStart,
      endMonthUI: displayEnd,
    });

    navigate(`/price-comparison?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-red-900">
      <Navbar />

      <div className="max-w-4xl mx-auto mt-10 px-6">
        <h1 className="text-4xl font-bold text-center mb-6">Select Districts and Time</h1>

        {/* district selection */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-3">Districts</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {districts.map((district) => (
              <label key={district} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedDistricts.includes(district)}
                  onChange={() => handleDistrictSelection(district)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-lg">{district}</span>
              </label>
            ))}
          </div>
        </div>

        {/* selected districts */}
        {selectedDistricts.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-3">Selected Districts</h2>
            <div className="flex flex-wrap gap-3">
              {selectedDistricts.map((district) => (
                <span key={district} className="bg-gray-300 text-black px-4 py-2 rounded-full">
                  {district}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* time range */}
        {selectedDistricts.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">Time Range</h2>
            <div className="flex flex-wrap gap-6">
              {/* start time */}
              <div>
                <p className="font-semibold mb-1">Start</p>
                <div className="flex gap-2">
                  <select
                    value={startYear}
                    onChange={(e) => setStartYear(e.target.value)}
                    className="border px-4 py-2 rounded-lg w-32"
                  >
                    <option value="">-- Year --</option>
                    {years.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>

                  <select
                    value={startMonth}
                    onChange={(e) => setStartMonth(e.target.value)}
                    className="border px-4 py-2 rounded-lg w-36"
                  >
                    <option value="">-- Month --</option>
                    {months.map((month) => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* end time */}
              <div>
                <p className="font-semibold mb-1">End</p>
                <div className="flex gap-2">
                  <select
                    value={endYear}
                    onChange={(e) => setEndYear(e.target.value)}
                    className="border px-4 py-2 rounded-lg w-32"
                  >
                    <option value="">-- Year --</option>
                    {years.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>

                  <select
                    value={endMonth}
                    onChange={(e) => setEndMonth(e.target.value)}
                    className="border px-4 py-2 rounded-lg w-36"
                  >
                    <option value="">-- Month --</option>
                    {months.map((month) => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* compare button */}
        {startYear && startMonth && endYear && endMonth && (
          <div className="text-center mt-6">
            <button
              onClick={handleCompare}
              className="px-8 py-4 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-all"
            >
              Compare Prices
            </button>
          </div>
        )}

        {/* back to homepage */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg shadow-lg hover:bg-red-700 transition-all"
          >
            Back to Homepage
          </button>
        </div>
      </div>
    </div>
  );
}
