import React, { useState } from 'react';
import './SignUp.css';
import logoImage from '../images/logo1.png';
import backgroundImage from '../images/Backgroung1.png';

function SignUp() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', phone: '' });

  function handleChange(event) {
    const { name, value } = event.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    alert(`Signed up:\nFirst Name: ${form.firstName}\nLast Name: ${form.lastName}\nEmail: ${form.email}\nPhone: ${form.phone}`);
  }

  return (
  <div className="signup-wrapper" style={{ background: `url(${backgroundImage}) no-repeat center center/cover`, minHeight: '100vh' }}>
      <img src={logoImage} alt="Fruit Basket" className="signup-logo" />
      <div className="signup-card">
        <h2 className="signup-title">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="signup-field">
            <label htmlFor="firstName" className="signup-label">First Name</label>
            <input id="firstName" name="firstName" pattern="[A-Za-z]{2,}" type="text" title='Enter Your Valid Name ' placeholder='Enter First Name' value={form.firstName} onChange={handleChange} required className="signup-input" />
          </div>
          <div className="signup-field">
            <label htmlFor="lastName" className="signup-label">Last Name</label>
            <input id="lastName" name="lastName" type="text" pattern="[A-Za-z]{2,}" title='Enter Your Valid Name' placeholder='Enter Last Name' value={form.lastName} onChange={handleChange} required className="signup-input" />
          </div>
          <div className="signup-field">
            <label htmlFor="email" className="signup-label">Email</label>
            <input id="email" name="email" type="email" title='Enter a Valid Email Address' placeholder='Enter Email' value={form.email} onChange={handleChange} required className="signup-input" />
          </div>
          <div className="signup-field">
            <label htmlFor="password" className="signup-label">Password</label>
            <input id="password" name="password" type="password" title="Password: 8–15 characters with uppercase, lowercase, number, and special character."
 pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}" placeholder='Enter Password' value={form.password} onChange={handleChange} required className="signup-input" />
          </div>
          <div className="signup-field">
            <label htmlFor="phone" className="signup-label">Phone</label>
            <input id="phone" name="phone" type="tel" pattern="[0-9]{10}" title="Enter a Valid Phone Number"  placeholder='+91 Enter Phone Number' value={form.phone} onChange={handleChange} required className="signup-input" />
          </div>
          <button type="submit" className="btn btn-rounded signup-submit">Continue</button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;


