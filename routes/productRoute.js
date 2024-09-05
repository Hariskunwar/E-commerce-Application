const express=require("express");
const { protect, restrict } = require('../middlewares/authMiddleware');
const { createProduct, getProducts, getProduct, updateProduct, deleteProduct, ratings } = require("../controllers/productController");
const upload=require("../middlewares/multer");

const router=express.Router();

router.post("/",protect,restrict("admin"),upload.array('product',10),createProduct);
router.get("/",getProducts);
router.get("/:id",getProduct);
router.put("/rating",protect,ratings);
router.put("/:id",protect,restrict("admin"),updateProduct);
router.delete("/:id",protect,restrict("admin"),deleteProduct);

module.exports=router;