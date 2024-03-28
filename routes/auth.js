const express = require('express')
const router = express.Router();
const {register,login, verifyAccount ,forgetPassword,resetPassword} = require('../controller/auth')




router.post('/register',register);
router.post('/login',login);
router.post('/verifyAccount',verifyAccount);
router.post('/forgetPassword',forgetPassword)
router.patch('/resetPassword/:token',resetPassword)

module.exports = router ; 