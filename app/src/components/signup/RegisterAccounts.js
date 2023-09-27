import React, { useState } from "react";
import "../../App.css";
import { useNavigate } from "react-router-dom";

function RegisterAccounts({ onLogin }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [reenterPassword, setReenterPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [signupMessage, setSignupMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Frontend validation
    if (password !== reenterPassword) {
      setPasswordError("Passwords do not match");
      return;
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    // Create an object with the form data
    const formData = {
      email,
      username,
      password,
      reenterPassword,
    };

    try {
      // Send the POST request using fetch
      const response = await fetch("http://localhost:3001/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.message) {
          setSignupMessage(responseData.message);

          onLogin(username);

          const token = responseData.token;
          if (token) {
            localStorage.setItem("token", token);
          }
          // Redirect to the dashboard
          navigate("/dashboard");
        }
      } else if (response.status === 409) {
        const errorData = await response.json();
        if (errorData.message) {
          setSignupMessage(errorData.message);
        }
        console.error("User already exists:", errorData.message);
      } else {
        const errorData = await response.json();
        if (errorData.error) {
          setSignupMessage(errorData.error);
        }
        console.error("Registration failed:", response.statusText);
        // Handle other error cases, show error message, etc.
      }
    } catch (error) {
      console.error("Error registering:", error);
      // Handle network errors or other exceptions
    }
  };

  return (
    <div className="register-container">
      <div className="logo">
        <h1>Bookshelf</h1>
      </div>
      <div>
        <h3>Create Account</h3>
      </div>

      <form action="post" onSubmit={handleSubmit} className="sign-up-form">
        <div className="input-group">
          <label htmlFor="username">Your Name</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="First and Last name"
          />{" "}
        </div>

        <div className="input-group">
          {signupMessage && (
            <p className="signup-message" style={{ color: "red" }}>
              {signupMessage}
            </p>
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
          {passwordError ? (
            <p className="error-message">{passwordError}</p>
          ) : (
            ""
          )}
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            placeholder="At least 6 characters"
          />{" "}
        </div>

        <div className="input-group">
          <label htmlFor="reenterPassword">Re-enter Password</label>
          <input
            type="password"
            id="reenterPassword"
            value={reenterPassword}
            onChange={(e) => setReenterPassword(e.target.value)}
            minLength={8}
            required
          />{" "}
        </div>

        <button type="submit">Create Account</button>
      </form>
      <p className="terms">
        By creating an account, you agree to the Bookshelf <br />{" "}
        <a href="/">Terms of Service</a> and <a href="/">Privacy Policy</a>
      </p>
      <p className="login-link">
        Already have an account? <a href="/login">Sign in</a>
      </p>
    </div>
  );
}

export default RegisterAccounts;
