const Coupon=require("../models/couponModel");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/CustomError");

//create a new coupon
exports.createCoupon=asyncErrorHandler(async (req,res,next)=>{
    const coupon=await Coupon.create(req.body);
    res.status(201).json({
        data:coupon
    });
});

//get list of coupon
exports.getCoupons=asyncErrorHandler(async (req,res,next)=>{
    const coupons=await Coupon.find();
    res.status(200).json({
        data:coupons
    });
});

//get specific coupon
exports.getCoupon=asyncErrorHandler(async (req,res,next)=>{
    const coupon=await Coupon.findById(req.params.id);
    if(!coupon){
        return next(new CustomError("Coupon not found",404));
    }
    res.status(200).json({
        data:coupon
    });
});

//update specific coupon
exports.updateCoupon=asyncErrorHandler(async (req,res,next)=>{
    const updatedCoupon=await Coupon.findByIdAndUpdate(req.params.id,req.body,{new:true});
    if(!updatedCoupon){
        return next(new CustomError("Coupon not found",404));
    }
    res.status(200).json({
        data:updatedCoupon
    });
});

//delete specific coupon
exports.deleteCoupon=asyncErrorHandler(async (req,res,next)=>{
    const deletedCoupon=await Coupon.findByIdAndDelete(req.params.id);
    if(!deletedCoupon){
        return next(new CustomError("Coupon not found",404));
    }
    res.status(204).json({
        data:null
    });
});