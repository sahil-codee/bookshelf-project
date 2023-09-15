import React, { useEffect, useState } from "react";
import jwt_decode from "jwt-decode"; // Import the jwt_decode function
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import LoginAccounts from "./components/LoginAccounts";
import RegisterAccounts from "./components/RegisterAccounts";
import MyBookshelf from "./components/MyBookshelf";
import Copyright from "./components/Copyright";
// import { AuthProvider } from "./components/AuthContext";
// import { useAuth } from "../src/components/AuthContext";

function App() {
  const [username, setUsername] = useState("");
  // const { updateAuthUser } = useAuth();
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
        console.log(decodedToken); // Add this line to check the decoded token
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
    // <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<LoginAccounts onLogin={handleLogin} />} />
        <Route
          path="/dashboard"
          element={
            <>
              {" "}
              <Navbar username={username} onLogout={handleLogout} />
              <Dashboard username={username} />{" "}
            </>
          }
        />
        <Route
          path="/login"
          element={
            <>
              {" "}
              <LoginAccounts onLogin={handleLogin} /> <Copyright />
            </>
          }
        />
        <Route
          path="/signup"
          element={
            <>
              {" "}
              <RegisterAccounts onLogin={handleLogin} /> <Copyright />{" "}
            </>
          }
        />
        <Route
          path="/my-bookshelf"
          element={
            <>
              {" "}
              <Navbar username={username} onLogout={handleLogout} />
              <MyBookshelf />{" "}
            </>
          }
        />
      </Routes>
    </Router>
    // </AuthProvider>
  );
}

export default App;
