import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, setUsername } from "../store/actions/authActions";
import "./navigation.css";

function Navbar() {
  const username = useSelector((state) => state.auth.username);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  React.useEffect(() => {
    const storedUsername = localStorage.getItem("username");

    if (storedUsername) {
      dispatch(setUsername(storedUsername));
    }
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("username");
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className={`navbar ${isMenuOpen ? "mobile-menu" : ""}`}>
      <div className="navbar-logo">
        <h1>Bookshelf</h1>
      </div>
      <div className="menu-toggle" onClick={toggleMenu}>
        {isMenuOpen ? "✕" : "☰"}
      </div>
      <div className={`navbar-links ${isMenuOpen ? "show-menu" : ""}`}>
        <ul>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/my-bookshelf">My Bookshelf</Link>
          </li>
          {username && (
            <li>
              <span className="username">{username}!</span>
            </li>
          )}
          {username && (
            <li>
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
