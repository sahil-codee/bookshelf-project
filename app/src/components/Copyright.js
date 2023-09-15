// Copyright.js
import React from "react";
import "../App.css";

const Copyright = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="copyright-container">
      <p>&copy; {currentYear} Bookshelf. All Rights Reserved.</p>
    </footer>
  );
};

export default Copyright;
