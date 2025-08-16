import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// dropdown options
const uniqueDistricts = [
  "Ang Mo Kio", "Bedok", "Bishan", "Bukit Batok", "Bukit Merah",
  "Bukit Panjang", "Bukit Timah", "Central Area", "Choa Chu Kang", "Clementi",
  "Geylang", "Hougang", "Jurong East", "Jurong West", "Kallang/Whampoa",
  "Marine Parade", "Pasir Ris", "Punggol", "Queenstown", "Sembawang",
  "Sengkang", "Serangoon", "Tampines", "Toa Payoh", "Woodlands", "Yishun"
];

const uniqueRoomTypes = [
  "1 Room", "2 Room", "3 Room", "4 Room", "5 Room", "Executive",
];

const SearchSection = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [roomType, setRoomType] = useState("");

  // navigate to results page with selected filters
  const handleSearch = () => {
    if (!searchTerm && !roomType) {
      alert("🚨 Please select a district or a room type to search.");
      return;
    }

    const params = new URLSearchParams();
    if (searchTerm) params.set("district", searchTerm);
    if (roomType) params.set("roomType", roomType);

    navigate(`/search-results?${params.toString()}`);
  };

  return (
    <header className="text-center py-16 bg-gradient-to-b from-white to-red-300">
      <h2 className="text-4xl font-extrabold">Find Past HDB Resale Transactions</h2>
      <p className="mt-3 text-lg">Search by district and/or room type to see past resale prices.</p>

      {/* Search Form */}
      <div className="mt-6 flex justify-center gap-4">
        <select
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-4 py-3 rounded-lg w-96"
        >
          <option value="">Select District</option>
          {uniqueDistricts.map((district) => (
            <option key={district} value={district}>{district}</option>
          ))}
        </select>

        <select
          value={roomType}
          onChange={(e) => setRoomType(e.target.value)}
          className="border px-4 py-3 rounded-lg w-48"
        >
          <option value="">Select Room Type</option>
          {uniqueRoomTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <button
          className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
    </header>
  );
};

export default SearchSection;