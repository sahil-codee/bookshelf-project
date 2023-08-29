import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

function Navbar({ username, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    navigate("/login"); // Redirect to the login page
  };

  return (
    <div className="navbar">
      <div className="navbar-logo">
        <h1>My App</h1>
      </div>
      <div className="navbar-links">
        <ul>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/my-bookshelf">My Bookshelf</Link>
          </li>
        </ul>
      </div>
      <div className="navbar-links">
        {username && <div className="username">Welcome {username}!</div>}
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;
