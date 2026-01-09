import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "./Logout.css";

const Logout = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  useEffect(() => {
    // If a user navigates here directly, keep behavior simple.
    if (!user) {
      navigate("/signin", { replace: true });
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/signin", { replace: true });
  };

  return (
    <div className="logout-overlay">
      <div className="logout-card">
        <h2 style={{ marginTop: 0 }}>Leave Fresh Basket?</h2>
        <p className="logout-muted">Are you sure you want to logout?</p>
        <div className="logout-actions">
          <button type="button" className="fb-btn-secondary" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button type="button" className="fb-btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout;
