const User = require('./userModel');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');

exports.registerUser = async(req,res)=>{
    try {
    const {fname, lname, email, phone, password, address} = req.body;
    console.log('Request Body:', req.body);

    // const hashedPassword = await bcrypt.hash(password,10);
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
        password,
        address
        });
        console.log(createuser)
        res.status(201).json({message:'User created successfully',createuser});
        console.log(createuser)
    } catch (error) {
        res.status(400).json({message:'Error creating user',error});
    }
                

}
