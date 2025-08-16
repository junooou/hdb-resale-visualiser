import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./homepage/HomePage";
import ForgotPassword from "./login/ForgotPassword";
import Signup from "./login/Signup";
import ResetPassword from "./login/ResetPassword";
import Profile from "./pages/Profile";
import MapSelection from "./pages/MapSelection";
import SelectionMode from "./pages/SelectionMode";
import GoogleMapPage from "./pages/GoogleMapPage";
import PriceComparison from "./pages/PriceComparison";
import SearchResults from "./pages/SearchResults";
import Insights from "./pages/Insights";
import HDBResaleVisualiser from "./pages/HDBResaleVisualiser";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/map-selection" element={<MapSelection />} />
                <Route path="/selection-mode" element={<SelectionMode />} />  
                <Route path="/map" element={<GoogleMapPage />} />
                <Route path="/compare-results" element={<PriceComparison />} />
                <Route path="/search-results" element={<SearchResults />} />
                <Route path="/insights" element={<Insights />} />
                <Route path="/price-comparison" element={<PriceComparison />} />
                <Route path="/visualiser/:mode" element={<HDBResaleVisualiser />} /> 
            </Routes>
        </Router>
    );
}

export default App;
