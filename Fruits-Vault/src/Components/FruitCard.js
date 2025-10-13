import React from "react";
import "./FruitCard.css";

const FruitCard = ({ fruit, addToCart }) => {
  return (
    <div className="fruit-card">
      <img src={fruit.image} alt={fruit.name} className="fruit-image" />
      <h3>{fruit.name}</h3>
      <p>Price: ₹{fruit.price}</p>
      <button onClick={() => addToCart(fruit)}>Add to Cart</button>
    </div>
  );
};

export default FruitCard;
