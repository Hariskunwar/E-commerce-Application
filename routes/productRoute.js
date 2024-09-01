const express=require("express");
const { protect, restrict } = require('../middlewares/authMiddleware');
const { createProduct } = require("../controllers/productController");
const upload=require("../middlewares/multer");

const router=express.Router();

router.post("/",protect,restrict("admin"),upload.array('product',10),createProduct);

module.exports=router;