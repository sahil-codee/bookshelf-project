import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";

dotenv.config();
mongoose.set("debug", true);

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // Allow credentials (cookies and headers)
  })
);

app.use(bodyParser.json());

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB Atlas:", error);
  });

const authenticateMiddleware = (req, res, next) => {
  const token = req.cookies.token; // or req.headers.authorization.replace("Bearer ", "")
  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  readingList: [
    {
      title: String,
      authors: [String],
      image: String,
    },
  ],
});

const User = mongoose.model("User", userSchema);

// Define a schema for the registration data
const registrationSchema = new mongoose.Schema({
  email: String,
  username: String,
  password: String,
});

const Registration = mongoose.model("Registration", registrationSchema);

app.get("/", (req, res) => {
  res.send("Server is up and running.");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Registration.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Compare hashed passwords
    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, username: user.username }, // Include username in the token payload
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Send the token as an HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // Set to true for HTTPS environments
      sameSite: "strict",
      maxAge: 3600000, // 1 hour
    });

    // Send the username and token as part of the response
    res.json({ message: "Login successful", username: user.username, token });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while processing your request" });
  }
});

app.post("/signup", async (req, res) => {
  console.log("Received signup request:", req.body);
  const { email, username, password, reenterPassword } = req.body;

  if (!email || !username || !password || !reenterPassword) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (password !== reenterPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  try {
    // Check if the email is already registered

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await Registration.findOne({ email });

    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User already exists, please sign in" });
    }

    const registration = new Registration({
      email,
      username,
      password: hashedPassword,
    });
    const savedRegistration = await registration.save();

    if (savedRegistration) {
      console.log("Registration added to MongoDB:", savedRegistration);

      const token = jwt.sign(
        { id: savedRegistration._id, email, username }, // Include user info in the token payload
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({ message: "Registration successful", token }); // Send token in the response

      // You can then redirect the user using JavaScript on the client side
      // after receiving the JSON response with the token.
      // For example, in your frontend JavaScript, after receiving the response:
      // window.location.href = "/dashboard";
    } else {
      console.error("Registration not saved to MongoDB");
      return res
        .status(500)
        .json({ error: "An error occurred while processing your request" });
    }
  } catch (error) {
    console.error("Error:", error);

    return res
      .status(500)
      .json({ error: "An error occurred while processing your request" });
  }
});

// Endpoint to add a book to the user's reading list
app.post("/dashboard", authenticateMiddleware, async (req, res) => {
  const { bookTitle, bookAuthors, bookImage } = req.body;
  const userId = req.user.id;
  console.log("User ID:", userId); // Debugging line

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.readingList.push({
      title: bookTitle,
      authors: bookAuthors,
      image: bookImage,
    });
    await user.save();

    console.log("Updated Reading List:", user.readingList); // Debugging line
    res.json({ message: "Book added to reading list" });
  } catch (error) {
    console.error("Error adding book to reading list:", error);
    res.status(500).json({ error: "An error occurred while adding the book" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
