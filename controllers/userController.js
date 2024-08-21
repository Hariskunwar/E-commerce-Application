const User=require("../models/userModel");
const jwt=require("jsonwebtoken");

const generateToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:'5d'});
}

exports.signup=async (req,res)=>{
    try {
        //check if user already exists
        let user=await User.findOne({email:req.body.email})
        if(user){
            return res.status(400).json({msg:'User already exists'});
          }
          user=await User.create(req.body);
          res.status(201).json({
            user,
            token:generateToken(user._id)
          })
    } catch (error) {
        res.status(500).json({
            error
        })
    }
}