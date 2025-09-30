import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./Components/Dashboard";
import LandingPage from "./Components/LandingPage";
import SignIn from "./Components/SignIn";
import SignUp from "./Components/SignUp";
import Profile from "./Components/Profile";
import Cart from "./Components/Cart";
import Account from "./Components/Account";
import Orders from "./Components/Orders";
import Help from "./Components/Help";
import Wishlist from "./Components/Wishlist";
import Search from "./Components/Search";
import Logout from "./Components/Logout";
import Coupons from "./Components/Coupons";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<Cart />} />
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
