const User=require("../models/userModel");
const asyncErrorHandler=require("../utils/asyncErrorHandler");
const CustomError=require("../utils/CustomError");
const jwt=require("jsonwebtoken");
const util=require("util");

//restrict access to authenticated users  
exports.protect=asyncErrorHandler(async (req,res,next)=>{
    //check token exists or not
    let token;
    if(req.headers.authorization&&req.headers.authorization.startsWith("Bearer")){
        token=req.headers.authorization.split(" ")[1];
    }
    if(!token){
        return next(new CustomError("You are not logged in, please login",401));
    }
    //verify  JWT to ensure it is unchanged and not expired 
    const decoded=await util.promisify(jwt.verify)(token,process.env.JWT_SECRET);

    //check user exist or not
    const user=await User.findById(decoded.id);
    if(!user){
        return next(new CustomError("User does not exist",401));
    }

    //check if user change his password after token created
    if(await user.isPasswordChanged(decoded.iat)){
       return next(new CustomError("Password was changed, please login again",401))
    }
  
    //attach user with request object
    req.user=user;
    next();
});

//Middleware to restrict access based on user roles
exports.restrict=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new CustomError("You are not allowed to access this route",403))
        }
        next();
    }
}