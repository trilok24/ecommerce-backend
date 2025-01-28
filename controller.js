const User = require('./userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
    try {
        const {_id}= req.params
    
        
        const user = await User.findById({_id});
        console.log(user);
        if(!user) {
            return res.status(400).json({message: 'User not found'});
            }
            res.status(200).json({message: 'User found', user});
        } catch (error) {
            res.status(400).json({message: 'Error fetching user',error});

}
}

exports.updateUser = async (req , res)=>{
    try {
        const { _id } = req.params
        const tokenUserId = req.user._id; 
        if (id !== tokenUserId) {
            return res.status(403).json({ message: 'Unauthorized: User ID mismatch' });
        }
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