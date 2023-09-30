// src/LoginAccounts.js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loginSuccess,
  loginFailure,
  setPassword,
  setEmail,
} from "../store/actions/authActions"; // Import your actions
import { useNavigate } from "react-router-dom";
import "../../App.css";
import Alert from "@mui/material/Alert";
import Copyright from "../footer/Copyright";
import { BASE_URL } from "../services/helper";

function LoginAccounts() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const email = useSelector((state) => state.auth.email); // Using Redux for email
  const password = useSelector((state) => state.auth.password);
  const loginMessage = useSelector((state) => state.auth.error);

  useEffect(() => {
    // Clear email and password when the component unmounts
    return () => {
      dispatch(setEmail(""));
      dispatch(setPassword(""));
    };
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      email, // Use the email from Redux
      password, // Use the password from Redux
    };

    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const userData = await response.json();
        console.log("User data received after login:", userData); // Add this log
        dispatch(loginSuccess(userData.username));

        localStorage.setItem("token", userData.token);
        navigate("/dashboard");
      } else if (response.status === 401) {
        const errorData = await response.json();
        if (errorData.message) {
          dispatch(loginFailure(errorData.message));
        }
      } else {
        const errorData = await response.json();
        if (errorData.error) {
          dispatch(loginFailure(errorData.error));
        }
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const handlePasswordChange = (e) => {
    dispatch(setPassword(e.target.value));
  };

  const handleEmailChange = (e) => {
    dispatch(setEmail(e.target.value)); // Update email using Redux action
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
            value={email} // Use the email from Redux
            onChange={handleEmailChange} // Use Redux action here
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password} // Use the password from Redux
            onChange={handlePasswordChange} // Use Redux action here
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
        Don't have an account? <a href="https://quiet-nougat-c17eef.netlify.app/signup">Sign up</a>
      </p>
      <div>
        <Copyright />
      </div>
    </div>
  );
}

export default LoginAccounts;
