import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Registration } from "../Models/models.js";

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Registration.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 3600000,
    });

    res.json({ message: "Login successful", username: user.username, token });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while processing your request" });
  }
};

export const signup = async (req, res) => {
  console.log("Received signup request:", req.body);
  const { email, username, password, reenterPassword } = req.body;

  if (!email || !username || !password || !reenterPassword) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (password !== reenterPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  try {
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
        { id: savedRegistration._id, email, username },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.json({ message: "Registration successful", token, username });
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
};

export const verifyToken = (req, res) => {
  res.json({ user: req.user });
};

export const addToDashboard = async (req, res) => {
  const book = req.body.book;
  const { user } = req;
  console.log("Received book data:", book);
  console.log("Page Count:", book.volumeInfo?.pageCount);
  
  try {
    if (
      !book ||
      !book.volumeInfo ||
      !book.volumeInfo.title ||
      !book.volumeInfo.authors ||
      !book.volumeInfo.imageLinks ||
      !book.volumeInfo.imageLinks.thumbnail ||
      !book.volumeInfo?.pageCount // Using optional chaining to access pageCount
    ) {
      return res.status(400).json({ message: "Invalid book data" });
    }

    const {
      title,
      authors,
      imageLinks,
      averageRating,
      ratingsCount,
      pageCount,
    } = book.volumeInfo;

    // Create a book object with the correct pageCount value
    const bookToAdd = {
      title,
      author: authors.join(", "),
      image: imageLinks.thumbnail,
      averageRating,
      ratingsCount,
      pageCount, // Include the pageCount
    };

    const updatedUser = await Registration.findByIdAndUpdate(
      user._id,
      { $push: { books: bookToAdd } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(201).json({ message: "Book added to dashboard successfully" });
  } catch (error) {
    console.error("Error adding book to dashboard:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller function to update a book's rating
// Controller function to update a book's rating
export const updateBookRating = async (req, res) => {
  const { book } = req.body;

  try {
    // Find the book by ID and update its rating
    const updatedBook = await Registration.findOneAndUpdate(
      { "books._id": book._id }, // Find the book by its _id
      { $set: { "books.$.averageRating": book.averageRating } }, // Update the averageRating field
      { new: true } // Return the updated book
    );

    if (!updatedBook) {
      return res.status(404).json({ error: "Book not found" });
    }

    return res.json({ success: true, updatedBook });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getDashboard = async (req, res) => {
  const { user } = req;

  try {
    const userData = await Registration.findById(user._id);

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const userBooks = userData.books || [];
    res.status(200).json({ books: userBooks });
  } catch (error) {
    console.error("Error fetching added books for dashboard:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const removeBook = async (req, res) => {
  const { bookId } = req.body;
  const { user } = req;

  try {
    const updatedUser = await Registration.findByIdAndUpdate(
      user._id,
      { $pull: { books: { _id: bookId } } }, // Remove the book with the specified _id
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Book removed successfully" });
  } catch (error) {
    console.error("Error removing book:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateBookProgress = async (req, res) => {
  const book = req.body.book;
  const { user } = req;

  try {
    // Find the book in the user's books array and update the progress
    const updatedUser = await Registration.findOneAndUpdate(
      { _id: user._id, "books._id": book._id },
      {
        $set: {
          "books.$.pagesRead": book.pagesRead,
          "books.$.lastProgressUpdate": book.lastProgressUpdate,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ message: "Book not found in user's library" });
    }

    res.status(200).json({ message: "Book progress updated successfully" });
  } catch (error) {
    console.error("Error updating book progress:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
