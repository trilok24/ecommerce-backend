const mongoose = require('mongoose');
const validator = require('validator')

const userSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true,
    trim: true
  },
  lname: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 
    validate: {
      validator: function (email) {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
      },
      message: "Invalid email format"
    }
  },
  profileImage: {
    type: String,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    match: /^[6-9]\d{9}$/,
    validate: {
      validator: function (phone) {
        return /^[6-9]\d{9}$/.test(phone);
      },
      message: "Invalid phone number format"
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  address: {
    shipping: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      pincode: { type: Number, required: true }
    },
    billing: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      pincode: { type: Number, required: true }
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);


module.exports = User;
