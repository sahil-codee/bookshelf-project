const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Atlas connection
const MONGODB_URI =
  "mongodb+srv://admin-sahil:test1234@cluster0.ilwhu.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB Atlas");
});

app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ message: "An error occurred" });
  });
  

// Define the user schema
const userSchema = new mongoose.Schema({
  email: String,
  username: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

// API route to handle user registration
const bcrypt = require("bcrypt");

app.post("/api/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

    const newUser = new User({
      email,
      username,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    console.error("Registration failed:", error);
    res.status(500).json({ message: "Registration failed" });
  }
});

app.get("/api/check-username", async (req, res) => {
    try {
      const { username } = req.query;
  
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.json(false); // Username is taken
      }
  
      res.json(true); // Username is available
    } catch (error) {
      console.error("Username check failed:", error);
      res.status(500).json(false); // Error occurred
    }
  });

  app.get("/api/check-email", async (req, res) => {
    try {
      const { email } = req.query;
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.json(true); // Email is taken
      }
  
      res.json(false); // Email is not taken
    } catch (error) {
      console.error("Email check failed:", error);
      res.status(500).json(false); // Error occurred
    }
  });
  

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
