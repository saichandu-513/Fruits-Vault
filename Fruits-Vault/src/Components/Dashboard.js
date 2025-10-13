import React from "react";
import Navbar from "./Navbar";
import FruitCard from "./FruitCard";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = ({ cart = [], addToCart }) => {
  const navigate = useNavigate();

  const fruitsData = [
    { name: "Apple", price: 200, image: "/images/apple.jpg" },
    { name: "Banana", price: 100, image: "/images/banana.jpg" },
    { name: "Orange", price: 150, image: "/images/orange.jpg" },
    { name: "Mango", price: 300, image: "/images/mango.jpg" },
    { name: "Pineapple", price: 250, image: "/images/pineapple.jpg" },
    { name: "Grapes", price: 220, image: "/images/grapes.jpg" },
  ];

  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard-home">
        <h1>Fresh Fruits</h1>
        <button onClick={() => navigate("/cart")}>
          Go to Cart ({cart.length})
        </button>
        <div className="fruits-grid">
          {fruitsData.map((fruit, index) => (
            <FruitCard key={index} fruit={fruit} addToCart={addToCart} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
