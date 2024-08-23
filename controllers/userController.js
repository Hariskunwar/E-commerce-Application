const User=require("../models/userModel");
const jwt=require("jsonwebtoken");
const asyncErrorHandler=require("../utils/asyncErrorHandler");
const CustomError=require("../utils/CustomError")

const generateToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:'5d'});
}

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
    })