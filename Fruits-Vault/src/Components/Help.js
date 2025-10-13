import React, { useState } from "react";
import "./Help.css";

const HelpCenter = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    question: "",
  });
  const [responseMessage, setResponseMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, question } = formData;

    if (!name || !email || !question) {
      alert("Please fill in all fields before submitting.");
      return;
    }

    setResponseMessage(
      `Thank you, ${name}! Your question has been received. We will respond shortly at ${email}.`
    );

    setFormData({ name: "", email: "", question: "" });
  };

  return (
    <div className="help-center-wrapper">
      <div className="help-center-container">
        <h1>FRIUTS BASKET STORE- Help Center</h1>
        <p className="website-info">
          Welcome to the Fruits Basket Store Help Center! We are committed to providing you fresh, quality fruits with excellent customer service. If you have any questions or concerns, please use the form below to contact us.
        </p>

        <form className="help-form" onSubmit={handleSubmit}>
          <label htmlFor="name">Name:</label>
          <input
            name="name"
            id="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label htmlFor="email">Email:</label>
          <input
            name="email"
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="question">Your Question:</label>
          <textarea
            name="question"
            id="question"
            value={formData.question}
            onChange={handleChange}
            required
          ></textarea>

          <button type="submit">Submit</button>
        </form>

        {responseMessage && (
          <p className="response-message">{responseMessage}</p>
        )}

        <section className="terms-conditions">
          <h2>Terms and Conditions</h2>
          <p>
            By purchasing from Fruits Basket Store , you agree to our terms and conditions. We strive for the highest quality, but due to the nature of fresh produce, availability and quality might vary. We do not accept returns on perishable goods but will address any complaints promptly. Please read all product details thoroughly before placing orders.
          </p>
        </section>

        <p className="contact-info">
          <strong>Contact us:</strong> <br />
          <span className="glow-text">Email: support@fruitsbasketstore .com</span> <br />
          <span className="glow-text">Phone: +91 8923499****</span>
        </p>
      </div>
    </div>
  );
};

export default HelpCenter;
