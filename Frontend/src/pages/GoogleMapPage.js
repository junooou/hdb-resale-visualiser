import React from "react";
import Navbar from "../homepage/Navbar";
import MapComponent from "../utils/MapComponent";

//Base of GoogleMap Page
function GoogleMapPage() {
  return (
    <div className="min-h-screen bg-white text-red-900">
      <Navbar />
      <MapComponent />
    </div>
  );
}

export default GoogleMapPage;
