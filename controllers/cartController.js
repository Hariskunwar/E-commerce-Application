const Cart=require("../models/cartModel");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const Product=require("..//models/productModel");
const CustomError = require("../utils/CustomError");

const calculateCartTotal=(cart)=>{
    let totalPrice=0;
    
    cart.cartItems.forEach((item)=>{
        totalPrice +=item.quantity * item.price;
    })
    cart.totalCartPrice=totalPrice;
    cart.totalAfterDiscount=undefined;
    return totalPrice;
}

//add product to cart
exports.addProductToCart=asyncErrorHandler(async (req,res,next)=>{
    const {productId,color}=req.body;
    const product=await Product.findById(productId);
    if(!product){
        return next(new CustomError("Product not found",404));
    }
    //get logged user cart
    let cart=await Cart.findOne({user:req.user._id});
    if(!cart){
        //create cart for logged user with product
        cart=await Cart.create({
            cartItems:[{product:productId,color,price:product.price}],
            user:req.user._id
        });
    }
    else{
        //if product exist in cart then update product quantity
        const productIndex=cart.cartItems.findIndex((item)=>{
            return item.product.toString()===productId && item.color===color;
        });
        if(productIndex>-1){
            const cartItem=cart.cartItems[productIndex];
            cartItem.quantity +=1;
            cart.cartItems[productIndex]=cartItem;
        }else{
            //if product not exist in cart, add product to cartItems array
            cart.cartItems.push({product:productId,color,price:product.price});
            
        }
    }
    //calculate total cart price
    calculateCartTotal(cart);
    await cart.save();
    res.status(200).json({
        message:"product added to cart successfully",
        data:cart
    });
});

//get logged user cart
exports.getCart=asyncErrorHandler(async (req,res,next)=>{
    const cart=await Cart.findOne({user:req.user._id});
    if(!cart){
        return next(new CustomError("No product in the cart",404));
    }
    res.status(200).json({
        data:cart
    });
});

//remove specific item from cart
exports.removeSpecificCartItem=asyncErrorHandler(async (req,res,next)=>{
    const cart=await Cart.findOneAndUpdate(
        {user:req.user._id},
        {
            $pull:{cartItems:{_id:req.params.id}}
        },
        {new:true}
    );
    calculateCartTotal(cart);
    await cart.save();
    res.status(200).json({
        data:cart
    });
});

//update cart item qunatity
exports.updateCartItemQuantity=asyncErrorHandler(async (req,res,next)=>{
    const {quantity}=req.body;
    const cart=await Cart.findOne({user:req.user._id});
    if(!cart){
        return next(new CustomError("No cart",404));
    }
    const itemIndex=cart.cartItems.findIndex((item)=>{
        return item._id.toString()===req.params.id;
    });
     if(itemIndex>-1){
        const cartItem=cart.cartItems[itemIndex];
        cartItem.quantity=quantity;
        cart.cartItems[itemIndex]=cartItem
     }else{
        return next(new CustomError("No item with given id",404));
     }
     calculateCartTotal(cart);
     await cart.save();
     res.status(200).json({
        data:cart
     });
});

//clear user cart
exports.clearCart=asyncErrorHandler(async (req,res,next)=>{
    await Cart.findOneAndDelete({user:req.user._id});
    res.status(204).json({
        data:null
    });
});