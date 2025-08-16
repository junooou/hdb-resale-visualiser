import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const districts = [
  { name: "Ang Mo Kio", lat: 1.3691, lng: 103.8454 },
  { name: "Bedok", lat: 1.3244, lng: 103.9301 },
  { name: "Bishan", lat: 1.3508, lng: 103.8494 },
  { name: "Bukit Batok", lat: 1.3496, lng: 103.7499 },
  { name: "Bukit Merah", lat: 1.2825, lng: 103.8198 },
  { name: "Bukit Panjang", lat: 1.3770, lng: 103.7621 },
  { name: "Bukit Timah", lat: 1.3294, lng: 103.8021 },
  { name: "Central Area", lat: 1.2903, lng: 103.8519 },
  { name: "Choa Chu Kang", lat: 1.3854, lng: 103.7441 },
  { name: "Clementi", lat: 1.3151, lng: 103.7658 },
  { name: "Geylang", lat: 1.3167, lng: 103.8864 },
  { name: "Hougang", lat: 1.3714, lng: 103.8864 },
  { name: "Jurong East", lat: 1.3331, lng: 103.7420 },
  { name: "Jurong West", lat: 1.3396, lng: 103.7073 },
  { name: "Kallang/Whampoa", lat: 1.3195, lng: 103.8627 },
  { name: "Marine Parade", lat: 1.3031, lng: 103.9108 },
  { name: "Pasir Ris", lat: 1.3731, lng: 103.9496 },
  { name: "Punggol", lat: 1.4051, lng: 103.9023 },
  { name: "Queenstown", lat: 1.2944, lng: 103.8065 },
  { name: "Sembawang", lat: 1.4491, lng: 103.8201 },
  { name: "Sengkang", lat: 1.3911, lng: 103.8955 },
  { name: "Serangoon", lat: 1.3496, lng: 103.8732 },
  { name: "Tampines", lat: 1.3530, lng: 103.9444 },
  { name: "Toa Payoh", lat: 1.3320, lng: 103.8476 },
  { name: "Woodlands", lat: 1.4360, lng: 103.7860 },
  { name: "Yishun", lat: 1.4295, lng: 103.8355 }
];

const roomTypes = [
"1 Room", "2 Room", "3 Room", "4 Room", "5 Room", "Executive",
];

const MapComponent = () => {
  const mapRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const mode = searchParams.get("mode");

        // selectedDistricts → Stores an array of selected districts (used in multi-district mode).
        // setSelectedDistricts → A function that updates selectedDistricts, causing a re-render.
  const [selectedDistricts, setSelectedDistricts] = useState([]); 
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedRoomTypes, setSelectedRoomTypes] = useState([]);
  const [selectedRoomTypeForMulti, setSelectedRoomTypeForMulti] = useState("");
  const markersRef = useRef([]); /* Creates a reference to an empty array
                                    useState is not being used because it will cause re-renders,
                                    slowing down the performance*/


  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCI0zhVegbDZWWzRj4GJMNLWx4Lhzr3urk";
    script.async = true;
    script.defer = true;
    script.onload = () => initializeMap();
    document.body.appendChild(script);
  }, []);

  function initializeMap() {
    const map = new window.google.maps.Map(mapRef.current, { // window.google.maps.Map is in-built function
      center: { lat: 1.3521, lng: 103.8198 },
      zoom: 11
    });

    districts.forEach(district => {
      const marker = new window.google.maps.Marker({ 
        position: { lat: district.lat, lng: district.lng },
        map,
        title: district.name,
        icon: { url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png" }
      });

      markersRef.current.push(marker); // markersRef.current is a React ref and .push(marker) is adding newly created marker in an array
      marker.addListener("click", () => handleMarkerClick(marker, district)); // API method to attach an event listerner to a marker
    });                                                                       // when you clicked on the marker, the listener triggers handleMarkerClick function
  }

  function handleMarkerClick(marker, district) {
    if (mode === "multi-district") {
      setSelectedDistricts(prevState => { // prevState is declared implicitly as function
        if (prevState.includes(district.name)) {  // equivalent to if (selectedDistricts.includes(district.name)), prevState is a ref to selectedDistricts
          setMarkerRed(marker); // If district is already selected, remove it
          return prevState.filter(d => d !== district.name); // removing the district name when re-selects
        }
  
        // Allow selection only if less than 5
        if (prevState.length < 5) {
          setMarkerBlue(marker);
          return [...prevState, district.name]; // Add new district in the new State
        } else {
          alert("You can select up to 5 districts only.");
          return prevState; // No change
        }
      });

    } else if (mode === "single-district") {
      setSelectedDistrict(prevSelected => {
        if (prevSelected === district.name) {
          setMarkerRed(marker);
          setSelectedRoomTypes([]);
          return null;  // Deselect if clicked again
        }
    
        if (prevSelected) {
          alert("You can only select one district at a time.");
          return prevSelected; // No change
        }
    
        setMarkerBlue(marker);
        return district.name;  // Set the newly selected district
      });
    }
    
  }

  function handleRoomTypeSelectionForMulti(event) {
    setSelectedRoomTypeForMulti(event.target.value);
  }  

  function proceedToComparison() {
    if (selectedDistricts.length < 2) {
      alert("Please select at least 2 districts before proceeding.");
      return;
    }
    if (!selectedRoomTypeForMulti) {
      alert("Please select a room type to compare.");
      return;
    }
  
    navigate("/visualiser/multi", {
      state: {
        selectedDistricts,
        selectedRoomType: selectedRoomTypeForMulti,
        type: "multi-district"
      }
    });
  }
  
  function setMarkerRed(marker) {
    marker.setIcon("http://maps.google.com/mapfiles/ms/icons/red-dot.png");
  };

  function setMarkerBlue(marker) {
    marker.setIcon("http://maps.google.com/mapfiles/ms/icons/blue-dot.png");
  };

  function handleRoomTypeSelection(room) {
    const updatedSelection = selectedRoomTypes.includes(room)
      ? selectedRoomTypes.filter(r => r !== room)
      : [...selectedRoomTypes, room];

    if (updatedSelection.length > 3) {
      alert("You can select up to 3 room types only.");
      return;
    }

    setSelectedRoomTypes(updatedSelection);
  }

  function generatePriceTrend() {
    if (selectedRoomTypes.length < 1 || selectedRoomTypes.length > 3) {
      alert("Please select between 1 to 3 room types before proceeding.");
      return;
    }
    navigate("/visualiser/single", {
      state: {
        selectedDistrict,
        selectedRoomTypes,
        type: "single-district"
      }
    });
  }

  return (
    <div className="min-h-screen bg-white text-red-900">
      <h1 className="text-3xl font-bold text-center mt-6">HDB Price Comparison</h1>
      <h2 className="text-xl font-semibold text-center mt-4">
        {mode === "multi-district"
          ? "Comparison Mode: Multi-District"
          : "Comparison Mode: Single-District"}
      </h2>
      <div ref={mapRef} style={{ width: "90%", height: "600px", margin: "auto", borderRadius: "10px", boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)" }} />

      {/* 🔹 SINGLE DISTRICT MODE */}
      {mode === "single-district" && selectedDistrict && (
        <div className="flex flex-col items-center mt-6">
          <h2 className="text-lg font-bold">Select Room Types for {selectedDistrict}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3">
            {roomTypes.map(room => (
              <label key={room} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedRoomTypes.includes(room)}
                  onChange={() => handleRoomTypeSelection(room)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-red-900">{room}</span>
              </label>
            ))}
          </div>
  
          {selectedRoomTypes.length > 0 && (
            <button onClick={generatePriceTrend} className="mt-4 px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow-md">
              📈 Generate Price Trend
            </button>
          )}
        </div>
      )}
  
      {/* 🔹 MULTI-DISTRICT MODE */}
      {mode === "multi-district" && (
        <div className="text-center mt-6">
          <h2 className="text-lg font-semibold">Selected Districts: {selectedDistricts.join(", ")}</h2>
  
          {selectedDistricts.length >= 2 && (
            <div className="mt-4">
              <label className="text-lg font-semibold mr-2">Select Room Type:</label>
              <select 
                value={selectedRoomTypeForMulti} 
                onChange={handleRoomTypeSelectionForMulti} 
                className="border px-3 py-2 rounded-lg"
              >
                <option value="">-- Select Room Type --</option>
                {roomTypes.map(room => (
                  <option key={room} value={room}>{room}</option>
                ))}
              </select>
            </div>
          )}
  
          {selectedRoomTypeForMulti && (
            <button onClick={proceedToComparison} className="mt-4 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md">
              ✅ Proceed to Compare Prices
            </button>
          )}
        </div>
      )}
  
      <button onClick={() => navigate("/")} className="mt-6 px-6 py-3 bg-red-600 text-white font-bold rounded-lg shadow-md">
        ⬅ Back to Homepage
      </button>
    </div>
  );  
};

export default MapComponent;
