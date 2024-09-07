const Order=require("../models/orderModel");
const Cart=require("../models/cartModel");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/CustomError");
const Product=require("../models/productModel");

//create cash on delivery order
exports.createCashOrder=asyncErrorHandler(async (req,res,next)=>{
    //get cart
    const cart=await Cart.findOne({user:req.user._id});
    if(!cart){
        return next(new CustomError("No item in the cart",404));
    }

    //get cart price
    const cartPrice=cart.totalAfterDiscount?cart.totalAfterDiscount:cart.totalCartPrice;
    const order=await Order.create({
        orderBy:req.user._id,
        products:cart.cartItems,
        shippingAddress:req.body.shippingAddress,
        totalOrderPrice:cartPrice
    });

    //decrement product quantity and decrement product sold
    if(order){
        const bulkOption=cart.cartItems.map((item)=>{
            return {
                updateOne:{
                    filter:{_id:item.product},
                    update:{$inc:{quantity:-item.quantity,sold:+item.quantity}}
                }
            }
        });
        await Product.bulkWrite(bulkOption,{});
        //clear cart
        await Cart.findOneAndDelete({user:req.user._id});
    }
    res.status(201).json({
        data:order
    });
});

//all orders
exports.getOrders=asyncErrorHandler(async (req,res,next)=>{
    let orders;
    if(req.user.role==='user'){
     orders=await Order.find({orderBy:req.user._id});
    }else{
        orders=await Order.find();
    }
    
    res.status(200).json({
        data:orders
    });
});

//get specific order
exports.getOrder=asyncErrorHandler(async (req,res,next)=>{
    const order=await Order.findById(req.params.id);
    if(!order){
        return next(new CustomError("Order not found",404));
    }
    res.status(200).json({
        data:order
    });
});

//update order status to paid
exports.updateOrderToPaid=asyncErrorHandler(async (req,res,next)=>{
    let order=await Order.findById(req.params.id);
    if(!order){
        return next(new CustomError("Order not found",404));
    }
    order.isPaid=true;
    order.paidAt=Date.now();
    order=await order.save();
    res.status(200).json({
        data:order
    });
});

//update order status to delivered
exports.updateOrderToDelivered=asyncErrorHandler(async (req,res,next)=>{
    let order=await Order.findById(req.params.id);
    if(!order){
        return next(new CustomError("Order not found",404));
    }
    order.isDelivered=true;
    order.deliveredAt=Date.now();
    order=await order.save();
    res.status(200).json({
        data:order
    });
});