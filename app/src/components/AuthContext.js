import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    // Check if the user is authenticated on page load
    // You might use localStorage, cookies, or other storage mechanisms to store the token
    // Example using localStorage:
    const token = localStorage.getItem("token");
    if (token) {
      // Fetch user data using the token and set the authenticated user
      fetch("/verify-token", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setAuthUser(data.user))
        .catch((error) => console.error("Token verification failed:", error));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
}
