import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./components/dashboard/Dashboard";
import LoginAccounts from './components/login/LoginAccounts'
import RegisterAccounts from "./components/signup/RegisterAccounts";
import MyBookshelf from "./components/MyBookshelf";
import { useDispatch, useSelector } from "react-redux";
import { setUsername, logout } from "./components/store/actions/authActions"; // Import your Redux actions

function App() {
  const dispatch = useDispatch();
  const username = useSelector((state) => state.auth.username);

  const handleLogin = (newUsername) => {
    dispatch(setUsername(newUsername));
    // Store the username in localStorage
    localStorage.setItem("username", newUsername);
  };

  const handleLogout = () => {
    dispatch(logout());
    // Remove the username from localStorage on logout
    localStorage.removeItem("username");
    localStorage.removeItem("token");
  };

  // Retrieve the username from localStorage when the application initializes
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      dispatch(setUsername(storedUsername));
    }
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<LoginAccounts onLogin={handleLogin} />}
        />
        <Route
          path="/dashboard"
          element={
            <>
              <Navbar username={username} onLogout={handleLogout} />
              <Dashboard username={username} />
            </>
          }
        />
        <Route
          path="/login"
          element={
            <>
              <LoginAccounts onLogin={handleLogin} />
            </>
          }
        />
        <Route
          path="/signup"
          element={
            <>
              <RegisterAccounts onLogin={handleLogin} />
            </>
          }
        />
        <Route
          path="/my-bookshelf"
          element={
            <>
              <Navbar username={username} onLogout={handleLogout} />
              <MyBookshelf />
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
