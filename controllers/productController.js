const Product=require("../models/productModel");
const asyncErrorHandler=require('../utils/asyncErrorHandler');

//create new product
exports.createProduct=asyncErrorHandler(async (req,res,next)=>{
      const newProduct=await Product.create(req.body);
      res.status(201).json({
       data:newProduct
      });
    });