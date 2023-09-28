// Copyright.js
import React from "react";
import "../../App.css";
import "./copyright.css";

const Copyright = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <p>&copy; {currentYear} Bookshelf. All Rights Reserved.</p>
    </footer>
  );
};

export default Copyright;
