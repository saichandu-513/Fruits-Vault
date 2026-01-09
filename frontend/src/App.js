import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./Components/Dashboard";
import LandingPage from "./Components/LandingPage";
import SignIn from "./Components/SignIn";
import SignUp from "./Components/SignUp";
import Profile from "./Components/Profile";
import Cart from "./Components/Cart";
import Orders from "./Components/Orders";
import Help from "./Components/Help";
import Wishlist from "./Components/Wishlist";
import Logout from "./Components/Logout";
import Coupons from "./Components/Coupons";
import Payment from "./Components/Payment";
import RequireAuth from "./auth/RequireAuth";
import { useAuth } from "./auth/AuthContext";

function HomeRedirect() {
  const { isAuthenticated, initializing } = useAuth();
  if (initializing) return null;
  return <Navigate to={isAuthenticated ? "/dashboard" : "/landing"} replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />

        <Route path="/landing" element={<LandingPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/help" element={<Help />} />

        <Route path="/account" element={<Navigate to="/profile" replace />} />
        <Route path="/search" element={<Navigate to="/dashboard" replace />} />

        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />
        <Route
          path="/cart"
          element={
            <RequireAuth>
              <Cart />
            </RequireAuth>
          }
        />
        <Route
          path="/payment"
          element={
            <RequireAuth>
              <Payment />
            </RequireAuth>
          }
        />
        <Route
          path="/orders"
          element={
            <RequireAuth>
              <Orders />
            </RequireAuth>
          }
        />
        <Route
          path="/wishlist"
          element={
            <RequireAuth>
              <Wishlist />
            </RequireAuth>
          }
        />
        <Route
          path="/coupons"
          element={
            <RequireAuth>
              <Coupons />
            </RequireAuth>
          }
        />

        <Route path="/logout" element={<Logout />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
