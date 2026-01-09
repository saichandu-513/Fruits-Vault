import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { useCart } from "../cart/CartContext";
import { useSearch } from "../search/SearchContext";

function Icon({ children }) {
  return (
    <span aria-hidden="true" style={{ width: 16, height: 16, display: "inline-flex" }}>
      {children}
    </span>
  );
}

const icons = {
  home: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 10.5L12 3l9 7.5" />
      <path d="M5 10v10h14V10" />
    </svg>
  ),
  profile: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  cart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 6h15l-2 9H7L6 6z" />
      <path d="M6 6L5 3H2" />
      <circle cx="9" cy="20" r="1" />
      <circle cx="18" cy="20" r="1" />
    </svg>
  ),
  orders: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 5H7a2 2 0 0 0-2 2v14l4-2 4 2 4-2 4 2V7a2 2 0 0 0-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
    </svg>
  ),
  wishlist: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  ),
  coupons: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7z" />
      <path d="M9 9h0M15 15h0" />
      <path d="M15 9l-6 6" />
    </svg>
  ),
  logout: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 17l1 1a2 2 0 0 0 2 0l1-1" />
      <path d="M7 7v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V7" />
      <path d="M12 3v8" />
    </svg>
  )
};

const Navbar = () => {
  const { cartCount } = useCart();
  const { term, setTerm } = useSearch();
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link to="/dashboard" onClick={() => setTerm("") }>
            <Icon>{icons.home}</Icon>
            Home
          </Link>
        </li>
        <li>
          <Link to="/profile">
            <Icon>{icons.profile}</Icon>
            Profile
          </Link>
        </li>
        <li>
          <Link to="/cart">
            <Icon>{icons.cart}</Icon>
            Cart
            {cartCount > 0 ? <span className="navbar-badge">{cartCount}</span> : null}
          </Link>
        </li>
        <li>
          <Link to="/orders">
            <Icon>{icons.orders}</Icon>
            Orders
          </Link>
        </li>
        <li>
          <Link to="/wishlist">
            <Icon>{icons.wishlist}</Icon>
            Wishlist
          </Link>
        </li>
        <li>
          <Link to="/coupons">
            <Icon>{icons.coupons}</Icon>
            Coupons
          </Link>
        </li>
        <li className="navbar-search">
          <input
            type="text"
            value={term}
            placeholder="Search fruits"
            className={isSearchFocused ? "navbar-search-input navbar-search-input--focused" : "navbar-search-input"}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            onChange={(e) => {
              setTerm(e.target.value);
            }}
          />
        </li>
        <li>
          <Link to="/logout">
            <Icon>{icons.logout}</Icon>
            Logout
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
