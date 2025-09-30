import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const sections = [
    { name: "Profile", path: "/profile" },
    { name: "Cart", path: "/cart" },
    { name: "Account", path: "/account" },
    { name: "Orders", path: "/orders" },
    { name: "Help Center", path: "/help" },
    { name: "Wishlist", path: "/wishlist" },
    { name: "Search", path: "/search" },
    { name: "Logout", path: "/logout" },
    { name: "Coupons", path: "/coupons" },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-logo">Fruits Vault</div>
      <ul className="navbar-menu">
        {sections.map((item, index) => (
          <li key={index}>
            <Link to={item.path}>{item.name}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
