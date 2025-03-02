const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema(
    {
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    orderItems:[{
            productId:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                require: true
                },
                quantity:{
                    type: Number,
                    require: true
                },
}],
totalAmount:{
    type: Number,
    require: true,
    comment: "Holds total price of all the items in the cart"
 },
totalItem:{
    type: Number,
    require: true,
    comment:"Holds total number of items"
},
totalQuantity:{
    type: Number,
    require:true,
    comment: " Holds total number of quantity "
},
cancellable:{
    type:Boolean,
    require:true,
    comment: "Holds whether the order is cancellable or not"
},
status:{
    type:String,
    require:true,
    enum:['pending','completed','canceled'],
    default:'pending',
    comment: "Holds the status of the order"

},
deletedAt:{
    type:Date,
    default: null
},
isDeleted:{
    type:Boolean,
    default: false
}},
{timestamps:true}
);

const Order = mongoose.model('Order',orderSchema);
module.exports = Order;