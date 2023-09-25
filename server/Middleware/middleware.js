// middleware.js
import jwt from "jsonwebtoken";
import { Registration } from "../Models/models.js";

const authenticateMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    console.log("Token:", token); // Log the token

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded:", decoded); // Log the decoded payload
    req.user = decoded;

    req.user = {
      _id: decoded.id, // Set _id based on 'id' from the payload
      // other user properties...
    };
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default authenticateMiddleware;
