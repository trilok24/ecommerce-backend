const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
const {registerUser}=require('./controller')

router.post('/register',registerUser);
module.exports = router;
