const Product=require("../models/productModel");
const asyncErrorHandler=require('../utils/asyncErrorHandler');
const dataUri=require("../utils/dataUri");
const cloudinary=require("../utils/cloudinary");
const CustomError = require("../utils/CustomError");

//create new product
exports.createProduct=asyncErrorHandler(async (req,res,next)=>{
      if(!req.files){
         return next(new CustomError("Please provide product images",400));
      }
      let imageArray=[];
      try{
      for(let file of req.files){

      const photos=dataUri(file);
      const response=await cloudinary.uploader.upload(photos.content);
      imageArray.push({
        public_id:response.public_id,
        url:response.secure_url
      })
      }
      const newProduct=await Product.create({...req.body,image:imageArray});
      res.status(201).json({
       data:newProduct
      });
    }catch(error){
      // If any error occurs during product creation, delete the uploaded images from Cloudinary
     if (imageArray.length > 0) {
      for (const image of imageArray) {
        try {
          await cloudinary.uploader.destroy(image.public_id);
        } catch (error) {
        return  next(new CustomError(`Failed to delete image with public_id ${image.public_id}: ${deleteError.message}`,500));
          
        }
      }
      return next(error);
     }
    }
    });