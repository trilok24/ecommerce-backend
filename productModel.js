const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      validate: {
        validator: function (value) {
          return value > 0;
        },
        message: 'Price must be a positive number'
      }
    },
    currencyId: {
      type: String,
      required: true,
      enum: ["INR"]
    },
    currencyFormat: {
      type: String,
      required: true,
      enum: ["₹"]
    },
    isFreeShipping: {
      type: Boolean,
      default: false
    },
    productImage: {
      type: String
    },
    style: {
      type: String
    },
    availableSizes: {
      type: [String],
      enum: ["S", "XS", "M", "X", "L", "XXL", "XL"]
    },
    installments: {
      type: Number
    },
    deletedAt: {
      type: Date,
      default: null
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
