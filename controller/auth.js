
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const nodemailer  = require('nodemailer')
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
const crypto = require('crypto')


//let otpCode = null;
const register = async (req, res) => {
    try {
        const {username,email,password}=req.body;
        if (!username || !email || !password) {
          return res.status(400).send('Please provide all required fields: username, email, and password.');
        }
        const existingUser = await User.findOne({ email }); // Check for existing email
    if (existingUser) {
      return res.status(400).send('Email address already in use.');
    }
        let otpCode = Math.floor(Math.random() * 900000) + 100000;
        const user = new User({username,email,password,otpCode});
        await user.save();

        await sendOtp(req, res,otpCode);
        
        res.status(201).send('User registered successfully');
    } catch (error) {
      console.error(error.message);
        res.status(400).send('An error occurred during registration. Please try again later.')
    }
} 
//sendotp enajem n7otha fi middleware ?
//famechy tari9a o5ra lel otp code be5lef global : otp code lezem yetzed fel schema mta3 l user w ba3ed manthabet
//bih lezem nraj3ou null
const sendOtp = async (req,res,otpCode) => {
   

    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
          
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
      }
      });

      const handlebarOptions = {
        viewEngine: {
            partialsDir: path.resolve('./views/'),
            defaultLayout: false,
        },
        viewPath: path.resolve('./views/'),
    };

    transporter.use('compile', hbs(handlebarOptions))

      const mailOptions = {
        from: 'nada.ghribi203@gmail.com',
        template:"email",
        to: process.env.EMAIL_USER,
        subject: 'Sending Email using Node.js',
        context: {
          otpCode: otpCode
        },
        
      };
      
  
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
          res.status(200).send('Email sent successfully');
        }
      });
      
}

const verifyAccount = async (req,res) => {
  const { email , inputCode } = req.body
  const user = await User.findOne({ email });

  
  if (user.otpCode  === parseInt(inputCode)) {
    user.otpCode = 0
    user.verified=true;
    user.save()
    res.status(200).send('OTP verification successful');
} else {
    res.status(400).send('OTP verification failed');
}

  };

const login = async (req,res) => {
    try{
        const { email, password }= req.body;
        console.log("🚀 ~ login ~ req.body:", req.body)
        // Check if the user exists in the database
        const user = await User.findOne({ email:email });

        if (!user){
            return res.status(404).send('user not found')
        }

        const isPasswordMatch = await  bcrypt.compare(password, user.password);
        if(!isPasswordMatch){
            return res.status(401).send('invalid password')
        }
        const verified= user.verified;
        if(verified==false){
          return res.status(401).send('Verify your account')

        }
        // Generate token   
        const token = jwt.sign({_id : user._id}, process.env.JWT_SECRET);
        res.send({token:token})
    } catch (error) {
        res.status(400).send(error.message)
    }
    


}


const forgetPassword = async (req,res) => {
  const { email } = req.body;
  const user = await  User.findOne({ email })
  if(!user){
    return res.status(404).send('user not found')
  }
  const resetToken = user.createResetPasswordToken();

await user.save({ValidateBeforeSave: false});
const sendResetPassword = async (req,res) => {
  const resetUrl = `${req.protocol}://${req.get('host')}/auth/resetPassword/${resetToken}`
   

  const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
    });

    const handlebarOptions = {
      viewEngine: {
          partialsDir: path.resolve('./views/'),
          defaultLayout: false,
      },
      viewPath: path.resolve('./views/'),
  };

  transporter.use('compile', hbs(handlebarOptions))

    const mailOptions = {
      from: 'nada.ghribi203@gmail.com',
      template:"reset",
      to: process.env.EMAIL_USER,
      subject: 'Sending Email reset password using Node.js',
      context: {
       resetUrl: resetUrl
      },
      
    };
    

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
        res.status(200).send('Email sent successfully');
      }
    });
    
}
try {
  await sendResetPassword(req,res)
  res.status(200).send('Email sent successfully');
  
}catch(err){
user.passwordResetToken = undefined;
user.save({ValidateBeforeSave: false})
return res.status(404).send('there was an error sending password reset email')

}




}

const resetPassword = async (req,res) => {
  //if the user exist with the given token
  const token = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({passwordResetToken : req.params.token})
  if (!user) {
    return res.status(404).send('token is invalid') 
  }
  //reset the user password
  user.password = req.body.password
  user.confirmPassword = req.body.confirmPassword
  user.passwordResetToken = undefined
  user.save();

  //login the user

  const loginToken = jwt.sign({_id : user._id}, process.env.JWT_SECRET);
  res.send({token:loginToken})

  }



module.exports = {register,login,sendOtp,verifyAccount,forgetPassword,resetPassword}