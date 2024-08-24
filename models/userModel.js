const mongoose=require("mongoose");
const validator=require("validator");
const bcrypt=require("bcryptjs");

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter your email"]
    },
    email:{
        type:String,
        required:[true,"Please enter your email"],
        unique:true,
        validate:[validator.isEmail,"Please enter a valid email"]
    },
    phone:{
        type:String,
        required:[true,"Please enter your mobile number"],
        unique:true,
    },
    photo:{
        type:String,
        default:"https://i.stack.imgur.com/l60Hf.png"
    },
    password:{
        type:String,
        required:[true,"Please enter your password"],
        minlength:[6,"Password must be at least 6 characters long"],
        select:false
    },
    confirmPassword:{
        type:String,
        required:[true,"Please confirm your password"],
        validate:{
            validator:function(val){
                return val==this.password
            },
            message:"Password and confirm password does not match"
        }
    },
    passwordChangedAt:Date,
},{timestamps:true});

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        return next();
    }
    this.password=await bcrypt.hash(this.password,10);
    this.confirmPassword=undefined;
    next();
})

userSchema.methods.comparePassword=async function(userEnteredPwd,dbPassword){
    return bcrypt.compare(userEnteredPwd,dbPassword);
}

userSchema.methods.isPasswordChanged=async function(jwtIssuedTimestamp){
    if(this.passwordChangedAt){
        const passChangedTimestamp=parseInt(this.passwordChangedAt.getTime()/1000,10);
        return jwtIssuedTimestamp<passChangedTimestamp;
    }
    return false;
}

module.exports=mongoose.model("User",userSchema);
