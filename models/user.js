const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto')
const userSchema = new mongoose.Schema({
    username:{type:String},
    email:{type:String,unique:true},
    password:{type:String},
    otpCode:{type:Number},
    passwordResetToken : {type:String},
    verified : { type:Boolean , default:false} 
}) 

userSchema.pre('save',async function(next){
   const user = this;
   if(user.isModified('password')){
    user.password = await bcrypt.hash(user.password,10)
   }
   next();
})

userSchema.methods.createResetPasswordToken = function()  {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    console.log(resetToken,this.passwordResetToken)
    return resetToken
}

const User = mongoose.model('User',userSchema)
module.exports = User;