// models.js
import mongoose from "mongoose";

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
      pagesRead: Number,
      pageCount: Number,
      averageRating: Number, // Added field for average rating
      ratingsCount: Number, // Added field for ratings count
      completed: Boolean,
      progress: Number,
    },
  ],
});

const Registration = mongoose.model("Registration", registrationSchema);

export { Registration };
