import React, { useState } from "react";

function RegisterAccounts() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [reenterPassword, setReenterPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Check if passwords match
      if (password !== reenterPassword) {
        alert("Passwords do not match.");
        return;
      }

      // Check username availability
      const usernameResponse = await fetch(
        `/api/check-username?username=${username}`
      );
      const isUsernameAvailable = await usernameResponse.json();

      if (!isUsernameAvailable) {
        alert("Username is already taken. Please choose another username.");
        return;
      }

      // Check if email address is associated with an account
      const emailResponse = await fetch(`/api/check-email?email=${email}`);
      const isEmailTaken = await emailResponse.json();

      if (isEmailTaken) {
        alert(
          "An account with this email address already exists. Please sign in."
        );
        return;
      }

      const formData = {
        email: email,
        username: username,
        password: password,
        reenterPassword: reenterPassword,
      };

      // Send data to the backend using fetch
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      // Handle the response as needed
      console.log("Registration successful:", responseData);
    } catch (error) {
      console.error("Registration failed:", error);
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
        Already have an account? <a href="/">Sign in</a>
      </p>
    </div>
  );
}

export default RegisterAccounts;
