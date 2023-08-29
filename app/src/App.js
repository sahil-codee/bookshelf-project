import React, { useEffect, useState } from "react";
import jwt_decode from "jwt-decode"; // Import the jwt_decode function
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import LoginAccounts from "./components/LoginAccounts";
import RegisterAccounts from "./components/RegisterAccounts";
import MyBookshelf from "./components/MyBookshelf";
import { ReadingListProvider } from "./components/ReadingListContext ";

function App() {
  const [username, setUsername] = useState("");

  const handleLogin = (newUsername) => {
    setUsername(newUsername);
  };

  const handleLogout = () => {
    setUsername("");
    localStorage.removeItem("token"); // Remove the token from localStorage on logout
  };

  useEffect(() => {
    // Check if a token is stored in localStorage
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwt_decode(token);
        setUsername(decodedToken.username);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  useEffect(() => {
    // Check if a token is stored in localStorage
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwt_decode(token);
        setUsername(decodedToken.username);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }

    // Check if a username is stored in localStorage
    const storedUsername = localStorage.getItem("username");

    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  return (
    <Router>
      <ReadingListProvider>
        <Navbar username={username} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<LoginAccounts onLogin={handleLogin} />} />
          <Route
            path="/dashboard"
            element={<Dashboard username={username} />}
          />
          <Route
            path="/login"
            element={<LoginAccounts onLogin={handleLogin} />}
          />
          <Route path="/signup" element={<RegisterAccounts />} />
          <Route path="/my-bookshelf" element={<MyBookshelf />} />
        </Routes>
      </ReadingListProvider>
    </Router>
  );
}

export default App;
