import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ setCategory }) => {
  return (
    <nav className="navbar">
      <h1>Trading News</h1>
      <div className="nav-links">
        <button onClick={() => setCategory("trading")}>All</button>
        <button onClick={() => setCategory("crypto")}>Crypto</button>
        <button onClick={() => setCategory("stocks")}>Stocks</button>
        <button onClick={() => setCategory("forex")}>Forex</button>
        <button onClick={() => setCategory("commodities")}>Commodities</button>
      </div>
      <Link to="/profile">My Profile</Link>
    </nav>
  );
};

export default Navbar;