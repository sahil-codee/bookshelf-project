import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import { useSelector, useDispatch } from "react-redux"; // Import useDispatch
import { logout } from "./store/actions/authActions";

function Navbar() {
  const username = useSelector((state) => state.auth.username);
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Add useDispatch to dispatch actions

  const handleLogout = () => {
    // Dispatch the logout action to clear Redux state
    dispatch(logout());
    navigate("/login"); // Redirect to the login page
  };

  return (
    <div className="navbar">
      <div className="navbar-logo">
        <h1>Bookshelf</h1>
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
        {username && <div className="username"> {username}!</div>}
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;
