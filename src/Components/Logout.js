import React from "react";
import "./Logout.css";

const Logout = () => {
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://i.pravatar.cc/100", // Placeholder profile image
  };

  return (
    <div className="logout-container">
      <div className="profile-card">
        <img src={user.avatar} alt="User Avatar" className="profile-avatar" />
        <h2 className="profile-name">{user.name}</h2>
        <p className="profile-email">{user.email}</p>
      </div>

      <div className="logout-section">
        <h2>Logout</h2>
        <p>Are you sure you want to logout?</p>
        <button className="logout-btn">Logout</button>
      </div>
    </div>
  );
};

export default Logout;
