const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {registerUser , logIn, getUser,updateUser,createProduct, updateProduct,getProduct , getpro , deletepro,addCart,delCart,updateCart,getCart,createOrder,updateOrderStatus}=require('./controller');

router.post('/register',registerUser);
router.post('/login',logIn);
router.get('/getUser/:userId', getUser)
router.put('/updateUser/:_id',updateUser)

router.post('/createProduct',createProduct);
router.get('/getProduct',getProduct);
router.get('/getpro/:_id',getpro)
router.put('/products/:productId',updateProduct);
router.delete('/deletepro/:_id',deletepro)

router.post('/addCart/:_id',addCart);
router.put('/updateCart/:_id',updateCart);
router.delete('/delCart/:_id',delCart);
router.get('/getCartSummary/:userId',getCart);


router.post('/createOrder/:_id',createOrder);
router.put('/updateOrderStatus/:_id', updateOrderStatus);
module.exports = router;
