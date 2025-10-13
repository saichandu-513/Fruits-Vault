import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import React, { useState } from "react";

import Dashboard from "./Components/Dashboard";
import LandingPage from "./Components/LandingPage";
import SignIn from "./Components/SignIn";
import SignUp from "./Components/SignUp";
import Profile from "./Components/Profile";
import Cart from "./Components/Cart";
import Payment from "./Components/Payment";
import Account from "./Components/Account";
import Orders from "./Components/Orders";
import Help from "./Components/Help";
import Wishlist from "./Components/Wishlist";
import Search from "./Components/Search";
import Logout from "./Components/Logout";
import Coupons from "./Components/Coupons";

function App() {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart(prev => [...prev, item]);
  };

  return (
    <Router>
      <Routes>
        {/* Default redirect to LandingPage */}
        <Route path="/" element={<Navigate to="/Landing" replace />} />
        {/* Pass cart and addToCart to Dashboard */}
        <Route path="/dashboard" element={<Dashboard cart={cart} addToCart={addToCart} />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />
        {/* pass cart to Cart component */}
        <Route path="/cart" element={<Cart cart={cart} />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/account" element={<Account />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/help" element={<Help />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/search" element={<Search />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/coupons" element={<Coupons />} />
      </Routes>
    </Router>
  );
}

export default App;
