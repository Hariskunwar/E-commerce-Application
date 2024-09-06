const mongoose=require("mongoose");

const couponSchema=mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter coupon name"],
        unique:true,
        uppercase:true
    },
    expire:{
        type:Date,
        required:[true,"Enter coupon expiry date"]
    },
    discount:{
        type:Number,
        required:[true,"Enter discount percentage"]
    },
},{timestamps:true});

module.exports=mongoose.model("Coupon",couponSchema);