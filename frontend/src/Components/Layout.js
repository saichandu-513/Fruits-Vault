import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children, size = "md" }) {
  const sizeClass = size === "sm" ? "fb-page-card-sm" : size === "xl" ? "fb-page-card-xl" : "";

  return (
    <div>
      <Navbar />
      <div className="fb-page">
        <div className={`fb-page-card ${sizeClass}`.trim()}>{children}</div>
      </div>
      <Footer />
    </div>
  );
}
