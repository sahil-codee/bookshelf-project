import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import Alert from "@mui/material/Alert";

function LoginAccounts({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      email,
      password,
    };

    try {
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Inside the handleSubmit function after successful login
      if (response.ok) {
        const userData = await response.json();
        console.log("Received userData:", userData); // Add this line to check the received data
        // Save the token in localStorage
        localStorage.setItem("token", userData.token);

        // Call the onLogin function to update the username state in App.js
        onLogin(userData.username);

        // Redirect to the dashboard
        navigate("/dashboard");
      } else if (response.status === 401) {
        const errorData = await response.json();
        if (errorData.message) {
          setLoginMessage(errorData.message);
        }
        console.error("Authentication failed:", errorData.message);
      } else {
        const errorData = await response.json();
        if (errorData.error) {
          setLoginMessage(errorData.error);
        }
        console.error("Login failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <div className="login-container">
      <div className="logo">
        <h1>Bookshelf</h1>
      </div>
      <div>
        <h3>Login</h3>
      </div>

      <form action="post" onSubmit={handleSubmit} className="login-form">
        <div className="input-group">
          {loginMessage && (
            <Alert severity="error" style={{ marginBottom: "20px" }}>
              {loginMessage}
            </Alert>
          )}
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Login</button>
      </form>
      <p className="terms">
        By signing in, you agree to the Bookshelf <br />{" "}
        <a href="/">Terms of Service</a> and <a href="/">Privacy Policy</a>
      </p>
      <p className="login-link">
        Don't have an account? <a href="/signup">Sign up</a>
      </p>
    </div>
  );
}

export default LoginAccounts;
