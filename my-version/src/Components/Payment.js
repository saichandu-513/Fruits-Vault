import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Payment.css";



const Payment = () => {
  const navigate = useNavigate();
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    // Basic validation here...

    alert("Payment Successful!");
    // Redirect to order confirmation or home page
    navigate("/orders");
  };

  return (
  <div className="payment-container">
    <h1>Payment Details</h1>
    <form className="payment-form" onSubmit={handlePaymentSubmit}>
      <div>
        <label>Card Number:</label><br/>
        <input
          type="text"
          value={cardNumber}
          onChange={e => setCardNumber(e.target.value)}
          required
          maxLength={16}
          pattern="\d{16}"
        />
      </div>
      <div>
        <label>Expiry Date (MM/YY):</label><br/>
        <input
          type="text"
          value={expiry}
          onChange={e => setExpiry(e.target.value)}
          required
          pattern="(0[1-9]|1[0-2])\/\d{2}"
          placeholder="MM/YY"
        />
      </div>
      <div>
        <label>CVV:</label><br/>
        <input
          type="password"
          value={cvv}
          onChange={e => setCvv(e.target.value)}
          required
          maxLength={3}
          pattern="\d{3}"
        />
      </div>
      <button className="pay-btn" type="submit">Pay Now</button>
    </form>
  </div>
);

};

export default Payment;
