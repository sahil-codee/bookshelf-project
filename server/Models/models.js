// models.js
import mongoose from 'mongoose';

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
      completed: Boolean,
    },
  ],
});

const Registration = mongoose.model('Registration', registrationSchema);

export { Registration };
