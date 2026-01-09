import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';
import logoImage from '../images/logo1.png';
import Footer from './Footer';

function LandingPage() {
  return (
    <header className="landing-page showcase" style={{ height: '100vh' }}>
      <div className="showcase-top">
        {<img src={logoImage} alt="Fruit Basket" />}
        <div className="top-actions">
          <Link to="/signin" className="btn btn-rounded">Sign in</Link>
          <Link to="/signup" className="btn btn-rounded">Sign up</Link>
        </div>
      </div>
      <div className="showcase-content">
        <h1>Fruit Vault !</h1>
        <p>Shop for your favorite fruits</p>
        <Link to="/dashboard" className="btn btn-xl">
          Shop Now &gt; <i className="fas fa-chevron-right btn-icon"></i>
        </Link>
      </div>

      <div className="landing-footer">
        <Footer />
      </div>
    </header>
  );
}

export default LandingPage;


