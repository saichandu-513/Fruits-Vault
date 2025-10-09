import React, { useState } from 'react';
import './SignUp.css';
import logoImage from '../images/logo1.png';
import backgroundImage from '../images/Background1.png';
import { Link } from 'react-router-dom';

function SignIn() {
  const [form, setForm] = useState({ identifier: '', password: '' });

  function handleChange(event) {
    const { name, value } = event.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    alert(`Signed in as: ${form.identifier}`);
  }

  return (
    <div className="signup-wrapper" style={{ background: `url(${backgroundImage}) no-repeat center center/cover`, minHeight: '100vh' }}>
      <img src={logoImage} alt="Fruit Basket" className="signup-logo" />
      <div className="signup-card">
        <h2 className="signup-title">Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className="signup-field">
            <label htmlFor="identifier" className="signup-label">Username</label>
            <input id="identifier" name="identifier" type="text" placeholder="Enter email or phone" value={form.identifier} onChange={handleChange} required className="signup-input" />
          </div>
          <div className="signup-field">
            <label htmlFor="password" className="signup-label">Password</label>
            <input id="password" name="password" type="password"  title="please enter a password" placeholder="Enter Password" value={form.password} onChange={handleChange} required className="signup-input" />
          </div>
          <button type="submit" className="btn btn-rounded signup-submit">Continue</button>
        </form>
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <span>Don't have an account? </span>
          <Link to="/signup" style={{ color: "#fff", textDecoration: 'underline' }}>Sign Up</Link>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
