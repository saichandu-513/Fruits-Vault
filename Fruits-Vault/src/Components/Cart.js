import React from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

const Cart = ({ cart }) => {
  const navigate = useNavigate();
  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  const handleProceedToPayment = () => {
    navigate("/payment");
  };

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>
      {cart.length === 0 ? (
        <p>Cart is empty.</p>
      ) : (
        <>
          <ul className="cart-list">
            {cart.map((item, idx) => (
              <li key={idx}>
                <img src={item.image} alt={item.name} />
                <div className="cart-item-details">
                  <strong>{item.name}</strong> - ₹{item.price}
                </div>
              </li>
            ))}
          </ul>
          <h3 className="cart-total">Total: ₹{totalPrice}</h3>
          <button className="payment-btn" onClick={handleProceedToPayment}>
            Proceed to Payment
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;
