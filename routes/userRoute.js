const express=require("express");
const { signup, login, getAllUser, getSingleUser, getCurrentUser, updatePassword } = require("../controllers/userController");
const { protect, restrict } = require("../middlewares/authMiddleware");

const router=express.Router();

router.post('/signup',signup);
router.post("/login",login);
router.get("/",protect,restrict('admin'),getAllUser);
router.get("/current-user",protect,getCurrentUser);
router.get("/:id",protect,restrict('admin'),getSingleUser);
router.put("/update-password",protect,updatePassword);

module.exports=router;