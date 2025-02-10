import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./compontents/Navbar";
import Login from "./compontents/Login";
import Register from "./compontents/Register";
import Profile from "./compontents/Profile";
import TradingNews from "./compontents/NewFeed"; // Assuming this is your news feed component
import TradingChart from "./compontents/Tradingchart";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/trading-news" element={<TradingNews />} />
        <Route path="/chart" element={<TradingChart />} />
        </Routes>
    </Router>
  );
}

export default App;