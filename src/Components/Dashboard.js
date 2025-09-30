import React, { useState } from "react";
import Navbar from "./Navbar";
import FruitCard from "./FruitCard";
import "./Dashboard.css";

// Add your fruit images to public/images folder
const fruitsData = [
  { name: "Apple", price: 2, image: "/images/apple.jpg" },
  { name: "Banana", price: 1, image: "/images/banana.jpg" },
  { name: "Orange", price: 1.5, image: "/images/orange.jpg" },
  { name: "Mango", price: 3, image: "/images/mango.jpg" },
  { name: "Pineapple", price: 2.5, image: "/images/pineapple.jpg" },
  { name: "Grapes", price: 2.2, image: "/images/grapes.jpg" },
];

const Dashboard = () => {
  const [cart, setCart] = useState([]);

  const addToCart = (fruit) => {
    setCart([...cart, fruit]);
    alert(`${fruit.name} added to cart!`);
  };

  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard-home">
        <h1>Fresh Fruits</h1>
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
