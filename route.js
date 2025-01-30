const express = require('express');
const router = express.Router();
// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
const {registerUser , logIn, getUser,updateUser,createProduct}=require('./controller');

router.post('/register',registerUser);
router.post('/login',logIn);
router.get('/getUser/:userId', getUser)
router.put('/updateUser/:_id',updateUser)

router.post('/createProduct',createProduct);
module.exports = router;
