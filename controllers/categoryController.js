const Category=require('../models/categoryModel');
const Product = require('../models/productModel');
const CustomError = require('../utils/CustomError');
const asyncErrorHandler = require('../utils/asyncErrorHandler');

//create product category
exports.createCategory=asyncErrorHandler(async (req,res,next)=>{
    const category=await Category.create(req.body);
    res.status(201).json({
        data:category
    });
});

//get all categories
exports.getAllCategory=asyncErrorHandler(async (req,res,next)=>{
    const categories=await Category.find();
    res.status(200).json({
        data:categories
    });
});

//update a category
exports.updateCategory=asyncErrorHandler(async (req,res,next)=>{
    const updatedCategory=await Category.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
    if(!updatedCategory){
        return next(new CustomError("Category not found",404));
    }
    res.status(200).json({
        data:updatedCategory
    });
});

//delete a category
exports.deleteCategory=asyncErrorHandler(async (req,res,next)=>{
    const categoryId=req.params.id
    const category=await Category.findById(categoryId);
    
    if(!category){
        return next(new CustomError("Category not found",404));
    }
   
    //find products with category id and remove category reference
    await Product.updateMany({category:categoryId},{$unset:{category:""}})
    //delete category
    await Category.findByIdAndDelete(categoryId);
    res.status(204).json({
         data:null
    });
});