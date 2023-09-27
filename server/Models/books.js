// models/book.js
import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  image: String,
  title: String,
  author: String,
  genre: String,
  pagesRead: Number,
  completed: Boolean,
});

const Book = mongoose.model('Book', bookSchema);

export default Book;
