const mongoose=require('mongoose');

const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter product name"],
        trim:true,
        minlength: [3, 'Too short product name'],
        maxlength: [100, 'Too long product name'],
    },
    description:{
        type:String,
        required:[true,"Please enter product description"],
    },
    price:{
        type:Number,
        required:[true,"Please enter product price"],
    },
    image:[{
        public_id:String,
        url:String
    }],
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required:[true,"Please enter product category"]
    },
    brand:{
        type:String,
        required:[true,"Please enter product brand"],
    },
    quantity:{
        type:Number,
        default:0
    },
    sold:{
        type:Number,
        default:0
    },
    color:{
        type:String,
        required:[true,"Enter product color"]
    },
    ratings:[
        {
            star:Number,
            ratedBy:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'User'
            }
        }
    ],
    averageRating:{
        type:Number,
        default:0
    }

},{timestamps:true});

module.exports=mongoose.model("Product",productSchema);