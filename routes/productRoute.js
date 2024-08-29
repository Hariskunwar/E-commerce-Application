const express=require("express");
const { protect, restrict } = require('../middlewares/authMiddleware');
const { createProduct } = require("../controllers/productController");

const router=express.Router();

router.post("/",protect,restrict("admin"),createProduct);

module.exports=router;