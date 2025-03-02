const User = require('./userModel');
const Product = require('./productModel');
const Cart = require('./cartModel');
const Order = require('./orderModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

exports.registerUser = async(req,res)=>{
    try {
    const {fname, lname, email, phone, password, address} = req.body;
    console.log('Request Body:', req.body);

    const hashedPassword = await bcrypt.hash(password,10);
    if(!fname || !lname || !email || !phone || !password || !address){
        return res.status(400).json({message: 'Please fill in all fields'});
    }
    const existingUser = await User.findOne({ email});
    if (existingUser) {
      return res.status(400).json({
        status: false,
        message: "Email or phone number is already registered.",
      });
    }
console.log(existingUser);
    const createuser = await User.create({
        fname,
        lname,
        email,
        phone,
        password:hashedPassword, 
        address
        });
        console.log(createuser)
        res.status(201).json({message:'User created successfully',createuser});
        console.log(createuser)
    } catch (error) {
        res.status(400).json({message:'Error creating user',error});
    }
                

}
exports.logIn = async (req,res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({message: 'Please fill in all fields'});
        }
        const user = await User.findOne({email});
        
        if(!user) {
            return res.status(400).json({message: 'Invalid email or password'});
            }
            const isMatch = await bcrypt.compare(password, user.password)
            console.log(isMatch)
            if(!isMatch) {
                return res.status(400).json({message: 'Invalid email or password'});
                }
                const token = jwt.sign({userId:user._id, email:user.email}, process.env.SECRET_KEY, {expiresIn: "1h"})
                console.log(token)
                res.status(200).json({message: 'Logged in successfully', token});
                } catch (error) {
                    res.status(400).json({message: 'Error logging in',error});

    
}
}
exports.getUser = async (req, res)=>{
    try{
        const{userId}=req.params;
        
        const token = req.headers.authorization.split(' ')[1];

        if (!token) {
        return res.status(403).json({ message: 'Authentication required' });
        }
        const decoded = jwt.verify(token, process.env.secret_key); 
        const loggedInUserId = decoded.userId;
        console.log("logged in user",loggedInUserId);

        if (loggedInUserId !==userId) {
        return res.status(403).json({ message: 'User ID in token does not match URL parameter' });
        }

        const user = await User.findById(userId);
        
        if(!user) {
        return res.status(400).json({message: 'User not found'});
        }
         res.status(200).json({message: 'User found', user});
    } catch (error) {
        console.error(error)
    res.status(400).json({message: 'Error fetching user',error});
    }
}

exports.updateUser = async (req , res)=>{
    try {
        const { _id } = req.params;

        const { lname,fname, email } = req.body;
    
        const userUpdate = await User.findByIdAndUpdate(_id, { fname, lname, email }, { new: true })
    
        if (!userUpdate) {
          return res.status(404).send({ message: "user not found" })
        }
        
    
        return res.status(201).send({ message: "user data updated successfully", data: userUpdate })
    
      } catch (error) {
    
        res.status(500).send({ message: "Internal server error", error })
        
    
      }
    
    }

exports.createProduct = async (req , res) =>{

try {
    const { title, price, description, currencyId, isFreeShipping, style, availableSizes, installments, currencyFormat } = req.body;

    if (!title || !price || !description || !currencyId) {
        return res.status(400).json({ message: 'Please fill in all mandatory fields' });
    }

    if (isNaN(price) || price <= 0) {
        return res.status(400).json({ message: "Price must be a valid number greater than 0" });
    }

    if (currencyId !== "INR") {
        return res.status(400).json({ message: "Invalid currencyId. Only 'INR' is allowed." });
    }

    const validSizes = ["S", "XS", "M", "X", "L", "XXL", "XL"];
    let sizesArray = [];

     if (availableSizes) {

        if (!availableSizes.every(size => validSizes.includes(size))) {
            return res.status(400).json({ message: "Invalid size(s) provided" });
         }

        sizesArray = availableSizes;
    }

    const product = await Product.create({
        title,
        price,
        description,
        currencyId,
        isFreeShipping: isFreeShipping || false,
        currencyFormat,
        style,
        availableSizes: sizesArray,
        installments
    });

    res.status(201).json({ message: 'Product created successfully', product });

} catch (error) {
    console.error("Error creating product:", error); 
    res.status(500).json({ message: 'Internal server error', error: error.message });
}
};

exports.getProduct = async(req ,res)=>{
    try {
        const product = await Product.find({isDeleted: false});
        console.log(product)
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
            }
            res.status(200).json(product);
            } catch (error) {
                console.error("Error getting product:", error);
                res.status(500).json({ message: 'Internal server error', error: error.message });
            }

}

exports.updateProduct=async(req,res)=>{
    try{
      const{productId}=req.params;
      const{title, description, price, currencyId,currencyFormat}=req.body;
      updatedProducts=await Product.findByIdAndUpdate(productId,
        {title, description, price, currencyId,currencyFormat},
        { new: true, runValidators: true }
      );
      res.status(200).json({ status:true,message:'success', data:updatedProducts });
  
      if (!updatedProducts) { 
        return res.status(404).json({ status: false, message: "Product not found" });
      }
    }
    catch (error) {
      console.error({ error });
      res.status(500).json({message: 'Internal server error',error: error.message,
    });
  }
  };


exports.getpro = async (req,res)=>{
    try {
        const {_id}=req.params;
        const product = await Product.findById(_id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
            }
            res.status(200).json(product);
            } catch (error) {
                console.error("Error getting product:", error);
                res.status(500).json({ message: 'Internal server error', error: error.message });
                }
}


exports.deletepro= async (req , res)=>{
    try {
        const {_id}=req.params;

        if(isDeleted){
            return res.status(400).json({ message: 'Product already deleted' });
        }
        const product = await Product.findByIdAndUpdate(_id, {isDeleted: true}, {new: true});
        
        if (!product) {

            return res.status(404).json({ message: 'Product not found' });
        }
            res.status(200).json({ message: 'Product deleted successfully' , product });

        } catch (error) {

            console.error("Error deleting product:", error);

            res.status(500).json({ message: 'Internal server error', error: error.message });
    }

}

exports.addCart = async (req , res)=>{
    try {
        const userId=req.params._id;


        
        const {productId = _id, quantity}=req.body;
        console.log(req.body);

        const token = req.headers.authorization.split(' ')[1];
        console.log("token is ",token)
 
         if (!token) {
         return res.status(403).json({ message: 'Authentication required' });
     }
 
     const decoded = jwt.verify(token, process.env.secret_key); 
 
     const loggedInUserId = decoded.userId; 
     console.log("logged in user",loggedInUserId);
 
     if (loggedInUserId !==userId) {
         return res.status(403).json({ message: 'User ID in token does not match URL parameter' });
        }


        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({ message: 'User not found' });
            }

        const product = await Product.findById(productId);
        console.log(product);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
            }
         
        let cart = await Cart.findOne({userId});
        if(!cart){
            cart = new Cart({
                userId ,
                products: [{productId,quantity}],
                totalAmount: product.price*quantity

            });
            }else{
                const productIndex = cart.products.findIndex((item) => item.productId.toString() === productId.toString());
                if(productIndex !== -1){
                    cart.products[productIndex].quantity += quantity;
                    cart.totalAmount += product.price*quantity;
                    }else{
                        cart.products.push({productId,quantity});
                        }

                        
            cart.totalAmount = 0;
            for (let item of cart.products) {
                const prod = await Product.findById(item.productId);
                if (prod) {
                    cart.totalAmount += prod.price * item.quantity;
                }
            }
        }

        console.log("Total Price Before Saving:", cart.totalAmount);

        await cart.save();
        res.status(201).json({
            status:true,
            message: 'Product added to cart',
            cart: cart
        });                       
        }catch(error){
            console.log(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
}

exports.updateCart = async (req, res) => {
    try {
      const { cartId, productId } = req.body;
      const removeProduct = Number(req.body.removeProduct); 
  
      if (!cartId || !productId) {
        return res.status(400).json({ error: "cartId and productId are required" });
      }
  
      const cart = await Cart.findById(cartId);
      if (!cart) {
        return res.status(404).json({ error: "Cart not found" });
      }
  
      if (!Array.isArray(cart.items) || cart.items.length === 0) {
        return res.status(400).json({ error: "Your cart is empty. Please add a product first." });
      }
  
      const productIndex = cart.items.findIndex(item => item.productId.toString() === productId);
      if (productIndex === -1) {
        return res.status(404).json({ error: "Product not in cart" });
      }
  
      const product = await Product.findById(productId);
      if (!product || product.isDeleted) {
        return res.status(400).json({ error: "Invalid or deleted product" });
      }
  
     
      if (removeProduct > 0) {
        if (cart.items[productIndex].quantity > removeProduct) {
          cart.items[productIndex].quantity -= removeProduct; 
        } else {
          cart.items.splice(productIndex, 1); 
        }
      }
  
      
      cart.totalItems = cart.items.reduce((total, item) => total + item.quantity, 0);
      cart.totalPrice = cart.items.reduce((total, item) => total + item.quantity * product.price, 0);
  
      await cart.save();
  
      return res.status(200).json({ message: "Cart updated successfully", cart });
    } catch (error) {
      return res.status(500).json({ error: "Internal server error", details: error.message });
    }
  };

exports.delCart  = async (req , res)=>{
    try{
        const userId = req.params._id;

        const token = req.headers.authorization.split(' ')[1];
        console.log("token is ",token)
 
         if (!token) {
         return res.status(403).json({ message: 'Authentication required' });
     }
 
     const decoded = jwt.verify(token, process.env.secret_key); 
 
     const loggedInUserId = decoded.userId; 
 
     if (loggedInUserId !==userId) {
         return res.status(403).json({ message: 'User ID in token does not match URL parameter' });
        }

        const userExists = await User.findById(userId)
        if(!userExists){
            return res.status(404).json({ message: 'User not found' });
        }
        let cart = await Cart.findOne({userId});
        if(!cart){
            return res.status(404).json({ message: 'Cart not found' });
        }
        cart.item= [];
        cart.totalPrice=0;
        
        await cart.save();
        res.status(200).json({
            status:true,
            message: 'Cart deleted',
            cart:cart
            });
            }catch(error){
                console.log(error);
                res.status(500).json({ message: 'Internal Server Error' });
                }
}
exports.getCart = async (req, res) => {
    try {
        const { userId } = req.params;

        
        const cart = await Cart.findOne({ userId }).exec();
        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        
        const productIds = cart.items.map(item => item.productId);

     
        const products = await Product.find({ _id: { $in: productIds } }).exec();

        
        const productMap = {};
        products.forEach(product => {
            productMap[product._id.toString()] = product;
        });

       
        const cartResponse = {
            _id: cart._id,
            userId: cart.userId,
            items: cart.items.map(item => {
                const product = productMap[item.productId.toString()];
                return {
                    productId: item.productId,
                    name: product ? product.title : "Product Not Found",
                    description: product ? product.description : "No description available",
                    price: product ? product.price : 0,
                    image: product ? product.productImage : "",
                    quantity: item.quantity,
                    totalPrice: item.quantity * (product ? product.price : 0)
                };
            }),
            totalAmount: cart.items.reduce((sum, item) => {
                const product = productMap[item.productId.toString()];
                return sum + item.quantity * (product ? product.price : 0);
            }, 0)
        };

        return res.status(200).json({ success: true, cart: cartResponse });

    } catch (error) {
        console.error("Error fetching cart summary:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

exports.createOrder = async (req, res) => {
    try {
        const userId = req.params._id;
        console.log("Fetching cart for User ID:", userId);

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ status: false, message: "Invalid userId format" });
        }

        
        const cart = await Cart.findOne({ userId }).populate("products.productId");

        console.log("Cart Data:", JSON.stringify(cart, null, 2));

        if (!cart || !Array.isArray(cart.products) || cart.products.length === 0) {
            return res.status(400).json({ status: false, message: "Cart is empty or invalid" });
        }

        
        const totalQuantity = cart.products.reduce((sum, item) => sum + item.quantity, 0);

        const orderData = {
            userId,
            totalQuantity,
            totalPrice: cart.totalAmount, 
            orderItems: cart.products.map(item => ({
                productId: item.productId._id,  
                quantity: item.quantity,
                price: item.productId.price, 
            })),
            cancellable: true,
            status: "pending",
        };

        const newOrder = await Order.create(orderData);

        cart.products = [];
        cart.totalAmount = 0;
        await cart.save();

        res.status(201).json({
            status: true,
            message: "Order created successfully",
            order: newOrder,
        });

    } catch (error) {
        console.error("Error in createOrder:", error);
        res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const  userId  = req.params._id;
        console.log(userId);
        const { orderId, status } = req.body;
        const token = req.headers.authorization.split(' ')[1];
        console.log("token is ",token)
 
         if (!token) {
         return res.status(403).json({ message: 'Authentication required' });
     }
 
     const decoded = jwt.verify(token, process.env.secret_key); 
 
     const loggedInUserId = decoded.userId;
 
     if (loggedInUserId !==userId) {
         return res.status(403).json({ message: 'User ID in token does not match URL parameter' });
        }


        
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ status: false, message: "Invalid userId format" });
        }
       
        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({ status: false, message: "User not found" });
        }

    
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ status: false, message: "Invalid orderId format" });
        }

        
        const order = await Order.findOne({ _id: orderId, userId });
        if (!order) {
            return res.status(404).json({ status: false, message: "Order not found or does not belong to the user" });
        }

        
        if (status === "cancelled" && !order.cancellable) {
            return res.status(400).json({ status: false, message: "This order cannot be canceled" });
        }

       
        order.status = status;
        const updatedOrder = await order.save();

        res.status(200).json({
            status: true,
            message: "Order updated successfully",
            order: updatedOrder,
        });

    } catch (error) {
        console.error("Error in updateOrderStatus:", error);
        res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};