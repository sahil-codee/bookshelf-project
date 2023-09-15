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
    dbName: "bookshelf", // Specify the database name within the cluster
  })
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB Atlas:", error);
  });

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

const registrationSchema = new mongoose.Schema({
  email: String,
  username: String,
  password: String,
  books: [
    {
      image: String,
      title: String,
      author: String,
      genre: String,
      pagesRead: Number, // Track reading progress
      completed: Boolean, // Track whether the book is completed
      // ... other book-specific fields
    },
  ],
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
      { expiresIn: "24h" }
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
        { expiresIn: "7d" }
      );

      res.json({ message: "Registration successful", token, username });

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
app.get("/verify-token", authenticateMiddleware, (req, res) => {
  // If the middleware passes, the token is valid
  res.json({ user: req.user });
});

// Endpoint to add a book to the user's reading list
// Endpoint to add a book to the user's dashboard
app.post("/dashboard", authenticateMiddleware, async (req, res) => {
  const book = req.body.book; // Extract the entire book object
  const { user } = req;
  // console.log(req.body);
  console.log("User ID:", user._id); // Add this line for debugging
  try {
    if (
      !book ||
      !book.volumeInfo ||
      !book.volumeInfo.title ||
      !book.volumeInfo.authors ||
      !book.volumeInfo.imageLinks ||
      !book.volumeInfo.imageLinks.thumbnail
    ) {
      return res.status(400).json({ message: "Invalid book data" });
    }

    // Create a new book object with the specific properties
    const { title, authors, imageLinks } = book.volumeInfo;
    const bookToAdd = {
      title,
      author: authors.join(", "), // Join authors array into a single string
      image: imageLinks.thumbnail,
    };

    // Find the user by their ID and update their books array
    const updatedUser = await Registration.findByIdAndUpdate(
      user._id, // Assuming user._id is the user's ID
      { $push: { books: bookToAdd } }, // Add the book to the user's books array
      { new: true } // Return the updated user object
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(201).json({ message: "Book added to dashboard successfully" });
  } catch (error) {
    console.error("Error adding book to dashboard:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Endpoint to get added books for the user's dashboard
app.get("/dashboard", authenticateMiddleware, async (req, res) => {
  const { user } = req;

  try {
    // Find the user by their ID and retrieve their books
    const userData = await Registration.findById(user._id);

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract the user's books and send them in the response
    const userBooks = userData.books || [];
    res.status(200).json({ books: userBooks });
  } catch (error) {
    console.error("Error fetching added books for dashboard:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
