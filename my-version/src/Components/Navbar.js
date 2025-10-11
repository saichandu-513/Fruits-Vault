import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/cart">Cart</Link></li>
        <li><Link to="/account">Account</Link></li>
        <li><Link to="/orders">Orders</Link></li>
        <li><Link to="/help">Help Center</Link></li>
        <li><Link to="/wishlist">Wishlist</Link></li>
        <li><Link to="/search">Search</Link></li>
        <li><Link to="/logout">Logout</Link></li>
        <li><Link to="/coupons">Coupons</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
