const mongoose = require('mongoose');
const cartSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
        unique: true
    },
    products:[{
        productId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Product',
            required:true
    },
        quantity:{
            type:Number,
            required:true,
            min: 1
        }
    }],
    totalAmount:{
        type:Number,
        required:true,
        default:0,
        comment: " Holds total number of items in the cart"
        }
    },
    {timestamps: true}
);
const Cart = mongoose.model('Cart',cartSchema);
module.exports = Cart;