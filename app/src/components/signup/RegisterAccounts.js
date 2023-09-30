import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setRegistrationEmail,
  setRegistrationUsername,
  setRegistrationPassword,
  setReenterPassword,
  setRegistrationError,
} from "../store/actions/authActions";
import { Link, useNavigate } from "react-router-dom";
import "../../App.css";
import Copyright from "../footer/Copyright";
import { BASE_URL } from "../services/helper";

function RegisterAccounts({ onLogin }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const registrationEmail = useSelector(
    (state) => state.auth.registrationEmail
  );
  const registrationUsername = useSelector(
    (state) => state.auth.registrationUsername
  );
  const registrationPassword = useSelector(
    (state) => state.auth.registrationPassword
  );
  const reenterPassword = useSelector((state) => state.auth.reenterPassword);
  const registrationError = useSelector(
    (state) => state.auth.registrationError
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (registrationPassword !== reenterPassword) {
      dispatch(setRegistrationError("Passwords do not match"));
      return;
    } else if (registrationPassword.length < 8) {
      dispatch(setRegistrationError("Password must be at least 8 characters"));
      return;
    }

    const formData = {
      email: registrationEmail,
      username: registrationUsername,
      password: registrationPassword,
      reenterPassword,
    };

    try {
      const response = await fetch(`${BASE_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.message) {
          dispatch(setRegistrationError(""));
          onLogin(registrationUsername);

          const token = responseData.token;
          if (token) {
            localStorage.setItem("token", token);
          }
          navigate("/dashboard");
        }
      } else if (response.status === 409) {
        const errorData = await response.json();
        if (errorData.message) {
          dispatch(setRegistrationError(errorData.message));
        }
        console.error("User already exists:", errorData.message);
      } else {
        const errorData = await response.json();
        if (errorData.error) {
          dispatch(setRegistrationError(errorData.error));
        }
        console.error("Registration failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error registering:", error);
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
            value={registrationUsername}
            onChange={(e) => dispatch(setRegistrationUsername(e.target.value))}
            required
            placeholder="First and Last name"
          />
        </div>

        <div className="input-group">
          {registrationError && (
            <p className="signup-message" style={{ color: "red" }}>
              {registrationError}
            </p>
          )}
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={registrationEmail}
            onChange={(e) => dispatch(setRegistrationEmail(e.target.value))}
            required
          />
        </div>

        <div className="input-group">
          {registrationError ? (
            <p className="error-message">{registrationError}</p>
          ) : (
            ""
          )}
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={registrationPassword}
            onChange={(e) => dispatch(setRegistrationPassword(e.target.value))}
            required
            minLength={8}
            placeholder="At least 8 characters"
          />
        </div>

        <div className="input-group">
          <label htmlFor="reenterPassword">Re-enter Password</label>
          <input
            type="password"
            id="reenterPassword"
            value={reenterPassword}
            onChange={(e) => dispatch(setReenterPassword(e.target.value))}
            minLength={8}
            required
          />
        </div>

        <button type="submit">Create Account</button>
      </form>
      <p className="terms">
        By creating an account, you agree to the Bookshelf <br />{" "}
        <a href="/">Terms of Service</a> and <a href="/">Privacy Policy</a>
      </p>
      <p className="login-link">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
      <div>
        <Copyright />
      </div>
    </div>
  );
}

export default RegisterAccounts;
