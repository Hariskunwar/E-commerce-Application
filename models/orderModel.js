const mongoose=require("mongoose");

const orderSchema=new mongoose.Schema({
    orderBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    products:[
        {
            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Product"
            },
            quantity:Number,
            color:String,
            price:Number
        },
    ],
    shippingAddress:{
        district:String,
        city:String,
        phone:String
    },
    totalOrderPrice:Number,
    paymentType:{
        type:String,
        enum:['COD','CARD'],
        default:"COD"
    },
    isPaid:{
        type:Boolean,
        default:false
    },
    paidAt:Date,
    isDelivered:{
        type:Boolean,
        default:false
    },
    deliveredAt:Date
},{timestamps:true});

module.exports=mongoose.model("Order",orderSchema);