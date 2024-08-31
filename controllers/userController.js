const User=require("../models/userModel");
const jwt=require("jsonwebtoken");
const asyncErrorHandler=require("../utils/asyncErrorHandler");
const CustomError=require("../utils/CustomError")
const sendEmail=require("../utils/email");
const crypto=require("crypto");
const dataUri=require("../utils/dataUri");
const cloudinary=require("../utils/cloudinary");

const generateToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE});
}
//user registration
exports.signup=asyncErrorHandler(async (req,res,next)=>{
   
        //check if user already exists
        let user=await User.findOne({email:req.body.email})
        if(user){
            const error=new CustomError('User already exists',400)
            return next(error)
          }
          user=await User.create(req.body);
          res.status(201).json({
            data:user,
            token:generateToken(user._id)
          })
    });

    //user login
    exports.login=asyncErrorHandler(async (req,res,next)=>{
        const {email,password}=req.body;
        if(!email||!password){
            return next(new CustomError("Provide both email and password",400));
          }
        const user=await User.findOne({email}).select("+password");
        if(!user ||!(await user.comparePassword(password,user.password))){
            return next(new CustomError("Incorrect email or password",400));
        }
        delete user._doc.password;
        res.status(200).json({
            data:user,
            token:generateToken(user._id)
        });
    });

    //admin get all users
    exports.getAllUser=asyncErrorHandler(async (req,res,next)=>{
      const users=await User.find();
      res.status(200).json({
        data:users
      });
    });

    //admin get single user 
    exports.getSingleUser=asyncErrorHandler(async (req,res,next)=>{
      const user=await User.findById(req.params.id);
      if(!user){
        return next(new CustomError("User not found",404));
      }
      res.status(200).json({
        data:user
      });
    });

    //get logged in user
    exports.getCurrentUser=asyncErrorHandler(async (req,res,next)=>{
      const user=await User.findById(req.user._id);
      res.status(200).json({
        data:user
      });
    });

    //user change password
    exports.updatePassword=asyncErrorHandler(async (req,res,next)=>{
      const {currentPassword,newPassword,confirmPassword}=req.body;
      const user=await User.findById(req.user._id).select("+password");
      if(!(await user.comparePassword(currentPassword,user.password))){
          return next(new CustomError("Current password provided is wrong",401));
      }
      user.password=newPassword;
      user.confirmPassword=confirmPassword;
      user.passwordChangedAt=new Date();
      await user.save();
      res.status(200).json({
          token:generateToken(user._id),
          data:user
      });
  });


  //resetting password

  exports.forgotPassword=asyncErrorHandler(async (req,res,next)=>{
    const user=await User.findOne({email:req.body.email});
    if(!user){
      return next(new CustomError("User not found",404));
    }
    const resetToken=user.createPasswordResetToken();
    await user.save({validateBeforeSave:false});

   const resetUrl=`${req.protocol}://${req.get('host')}/api/v1/users/reset-password/${resetToken}`;
   const message=`You recieved a password reset request. 
   Please use below link to reset your password.
   ${resetUrl} 
   This link will be valid only for 10 minute.`

   try{
   await sendEmail({
    email:user.email,
    subject:"Password change request recieved",
    message:message
   });
  }catch (error) {
    user.passwordResetToken=undefined;
    user.passwordResetTokenExpires=undefined;
    await user.save({validateBeforeSave:false});
    return next(new CustomError('There was an error sending password reset email, please try again later'),500);
  }
    res.status(200).json({
      status:"success",
     message:"Password reset link send to your email."
  });

  });

  exports.resetPassword=asyncErrorHandler(async (req,res,next)=>{
    const {password,confirmPassword}=req.body;
    const token=crypto.createHash('sha256').update(req.params.resetToken).digest("hex");
    const user=await User.findOne({passwordResetToken:token,passwordResetTokenExpires:{$gte:Date.now()}});
    if(!user){
        return next(new CustomError('Reset token is invalid or expired',400));
    }
    user.password=password;
    user.confirmPassword=confirmPassword;
    user.passwordResetToken=undefined;
    user.passwordResetTokenExpires=undefined;
    user.passwordChangedAt=new Date();
    await user.save();
    
    res.status(200).json({
        message:'Password reset successfully',
        token:generateToken(user._id)
    });

  });

  //update profile
  const filterRequestObj=(reqObj,...allowedFields)=>{
    const newObj={};
    Object.keys(reqObj).forEach((prop)=>{
      if(allowedFields.includes(prop)){
        newObj[prop]=reqObj[prop];
      }
    });
    return newObj;
  }

  exports.updateMe=asyncErrorHandler(async (req,res,next)=>{
    const {password,confirmPassword}=req.body;
    if(password||confirmPassword){
        return next(new CustomError("You cannot change your password using this endpoint",400));
    }
    const filterObj=filterRequestObj(req.body,"email","name","phone","photo");
    const updatedUser=await User.findByIdAndUpdate(req.user._id,filterObj,{new:true,runValidators:true});
    res.status(200).json({
        data:updatedUser
        });
      });


      //upload user profile
      exports.uploadProfilePhoto=asyncErrorHandler(async (req,res,next)=>{
        const user=await User.findById(req.user._id);
        const profile=dataUri(req.file);
        //delete previous profile
        if(user.photo.public_id){
          await cloudinary.uploader.destroy(user.photo.public_id);
        }
        const response=await cloudinary.uploader.upload(profile.content);
        user.photo={
          public_id:response.public_id,
          url:response.secure_url
        }
        await user.save({validateBeforeSave:false});
        res.status(200).json({
          message:"profile updated successfully",
          user
        });
      });