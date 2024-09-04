const express=require("express");
const { createCategory, getAllCategory, updateCategory, deleteCategory } = require("../controllers/categoryController");
const { protect, restrict } = require("../middlewares/authMiddleware");

const router=express.Router();

router.post('/',protect,restrict("admin"),createCategory);
router.get("/",getAllCategory);
router.put("/:id",protect,restrict("admin"),updateCategory);
router.delete("/:id",protect,restrict("admin"),deleteCategory);

module.exports=router;