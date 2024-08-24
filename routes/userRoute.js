const express=require("express");
const { signup, login, getAllUser, getSingleUser } = require("../controllers/userController");
const { protect, restrict } = require("../middlewares/authMiddleware");

const router=express.Router();

router.post('/signup',signup);
router.post("/login",login);
router.get("/",protect,restrict('admin'),getAllUser);
router.get("/:id",protect,restrict('admin'),getSingleUser);


module.exports=router;