
import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/register">Register</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/trading-news">Trading News</Link></li>
        <li><Link to="/chart">Trading Chart</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;