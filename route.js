const express = require('express');
const router = express.Router();
// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
const {registerUser , logIn, getUser,updateUser}=require('./controller');

router.post('/register',registerUser);
router.post('/login',logIn);
router.get('/getUser/:_id', getUser)
router.put('/updateUser/:_id',updateUser)
module.exports = router;
