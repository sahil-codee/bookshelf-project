import React, { useEffect, useState } from "react";
import jwt_decode from "jwt-decode"; // You'll need to install this package

function Dashboard() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Decode the token to get user information
    const token = localStorage.getItem("token");
    console.log(`token:`, token); // Add this line to check if the token is present
    if (token) {
      try {
        const decodedToken = jwt_decode(token);
        console.log(decodedToken);
        setUsername(decodedToken.username);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  return (
    <div>
      <h1>Welcome, {username}!</h1>
      {/* Rest of your dashboard content */}
    </div>
  );
}

export default Dashboard;
