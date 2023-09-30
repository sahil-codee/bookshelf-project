// models/user.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: String,
  username: String,
  password: String,
  books: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
});

const User = mongoose.model('User', userSchema);

export default User;
