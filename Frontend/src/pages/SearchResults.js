import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../homepage/Navbar";
import ReactSlider from "react-slider";

const API_URL = "http://127.0.0.1:8000/api/resale/raw_data_by_town/";

const townOptions = [
    "Ang Mo Kio", "Bedok", "Bishan", "Bukit Batok", "Bukit Merah",
    "Bukit Panjang", "Bukit Timah", "Central Area", "Choa Chu Kang", "Clementi",
    "Geylang", "Hougang", "Jurong East", "Jurong West", "Kallang/Whampoa",
    "Marine Parade", "Pasir Ris", "Punggol", "Queenstown", "Sembawang",
    "Sengkang", "Serangoon", "Tampines", "Toa Payoh", "Woodlands", "Yishun"
];
const roomTypeOptions = [
    "1 Room", "2 Room", "3 Room", "4 Room", "5 Room", "Executive", "Multi-Generation"
];

const SearchResults = () => {
    const location = useLocation();

    const [district, setDistrict] = useState("");
    const [roomType, setRoomType] = useState("");
    const [filteredResults, setFilteredResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [yearRange, setYearRange] = useState([2017, 2025]);

    const [sortConfig, setSortConfig] = useState({
        field: "resale_price",
        direction: "asc",
    });

    const fetchData = (district, roomType) => {
        if (!district) return;

        setLoading(true);

        const params = new URLSearchParams({ town: district.toUpperCase() });
        if (roomType) params.set("room_type", roomType.toUpperCase());

        axios
            .get(`${API_URL}?${params.toString()}`)
            .then((res) => {
                let results = res.data;

                // Sorting
                results.sort((a, b) => {
                    const { field, direction } = sortConfig;
                    let valA = a[field];
                    let valB = b[field];

                    if (field === "month") {
                        valA = new Date(valA);
                        valB = new Date(valB);
                    }

                    if (typeof valA === "string") {
                        return direction === "asc"
                            ? valA.localeCompare(valB)
                            : valB.localeCompare(valA);
                    }

                    return direction === "asc" ? valA - valB : valB - valA;
                });

                setFilteredResults(results);
            })
            .catch((err) => {
                console.error("❌ Error fetching data:", err);
                setFilteredResults([]);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const districtParam = params.get("district");
        const roomTypeParam = params.get("roomType") || "";

        setDistrict(districtParam || "");
        setRoomType(roomTypeParam);

        if (districtParam) {
            fetchData(districtParam, roomTypeParam);
        }
    }, [location.search, sortConfig]);

    const handleSort = (field) => {
        setSortConfig((prev) => ({
            field,
            direction: prev.field === field && prev.direction === "asc" ? "desc" : "asc",
        }));
    };

    const getSortSymbol = (field) => {
        if (sortConfig.field !== field) return "";
        return sortConfig.direction === "asc" ? " ↑" : " ↓";
    };

    return (
        <div className="min-h-screen bg-gray-100 text-red-900">
            <Navbar />
            <div className="max-w-6xl mx-auto mt-10 px-6">
                <h1 className="text-4xl font-bold text-center mb-10">🏠 HDB Past Listings</h1>

                <div className="bg-white p-6 shadow-md rounded-lg mb-10">
                    <h2 className="text-xl font-semibold mb-4">🔎 Filter Listings</h2>

                    {/* Filter Bar */}
                    <div className="flex flex-wrap md:flex-nowrap gap-4 items-center">
                        {/* District Dropdown */}
                        <select
                            value={district}
                            onChange={(e) => setDistrict(e.target.value)}
                            className="border px-4 py-2 rounded-lg w-full md:w-48"
                        >
                            <option value="">Select District</option>
                            {townOptions.map((town) => (
                                <option key={town} value={town}>{town}</option>
                            ))}
                        </select>

                        {/* Room Type Dropdown */}
                        <select
                            value={roomType}
                            onChange={(e) => setRoomType(e.target.value)}
                            className="border px-4 py-2 rounded-lg w-full md:w-48"
                        >
                            <option value="">Select Room Type</option>
                            {roomTypeOptions.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>

                        {/* Search Button */}
                        <button
                            onClick={() => fetchData(district, roomType)}
                            className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 transition-all w-full md:w-auto"
                        >
                            Search
                        </button>

                        {/* Year Slider */}
                        <div className="flex flex-col md:flex-row md:items-center w-full md:w-auto ml-auto">
                            <label className="font-semibold text-sm mb-1 md:mb-0 md:mr-2 whitespace-nowrap">
                                📅 Select Year Range:
                            </label>

                            <span className="text-sm mr-2">{yearRange[0]}</span>

                            <ReactSlider
                                className="w-full md:w-48 h-6"
                                thumbClassName="h-4 w-4 bg-red-600 rounded-full cursor-pointer top-1.5"
                                trackClassName="top-2 bottom-2 bg-red-300"
                                min={2017}
                                max={2025}
                                value={yearRange}
                                onChange={(newRange) => setYearRange(newRange)}
                                pearling
                                minDistance={1}
                            />

                            <span className="text-sm ml-2">{yearRange[1]}</span>
                        </div>
                    </div>
                </div>

                {/* Results */}
                {loading && <p className="text-center text-xl font-semibold">Loading results...</p>}
                {!loading && filteredResults.length === 0 && (
                    <p className="text-center">No listings found.</p>
                )}
                {!loading && filteredResults.length > 0 && (
                    <table className="table-auto w-full bg-white rounded-lg shadow-md overflow-hidden">
                        <thead className="bg-red-200">
                            <tr>
                                <th onClick={() => handleSort("month")} className="cursor-pointer px-4 py-3">
                                    Month{getSortSymbol("month")}
                                </th>
                                <th onClick={() => handleSort("block")} className="cursor-pointer px-4 py-3">
                                    Block{getSortSymbol("block")}
                                </th>
                                <th onClick={() => handleSort("street_name")} className="cursor-pointer px-4 py-3">
                                    Street Name{getSortSymbol("street_name")}
                                </th>
                                <th onClick={() => handleSort("flat_type")} className="cursor-pointer px-4 py-3">
                                    Room Type{getSortSymbol("flat_type")}
                                </th>
                                <th onClick={() => handleSort("floor_area_sqm")} className="cursor-pointer px-4 py-3">
                                    Floor Area (sqm){getSortSymbol("floor_area_sqm")}
                                </th>
                                <th onClick={() => handleSort("lease_commence_date")} className="cursor-pointer px-4 py-3">
                                    Start of Lease{getSortSymbol("lease_commence_date")}
                                </th>
                                <th onClick={() => handleSort("resale_price")} className="cursor-pointer px-4 py-3">
                                    Resale Price{getSortSymbol("resale_price")}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredResults
                                .filter((item) => {
                                    const year = new Date(item.month).getFullYear();
                                    return year >= yearRange[0] && year <= yearRange[1];
                                })
                                .map((item, idx) => (
                                    <tr key={idx} className="text-center border-b hover:bg-gray-100">
                                        <td className="px-4 py-2">{item.month}</td>
                                        <td className="px-4 py-2">{item.block}</td>
                                        <td className="px-4 py-2">{item.street_name}</td>
                                        <td className="px-4 py-2">{item.flat_type}</td>
                                        <td className="px-4 py-2">{item.floor_area_sqm}</td>
                                        <td className="px-4 py-2">{item.lease_commence_date}</td>
                                        <td className="px-4 py-2">${item.resale_price.toLocaleString()}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default SearchResults;
