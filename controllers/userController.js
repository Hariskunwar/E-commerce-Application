const User=require("../models/userModel");
const jwt=require("jsonwebtoken");
const asyncErrorHandler=require("../utils/asyncErrorHandler");
const CustomError=require("../utils/CustomError")

const generateToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:'5d'});
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

    
