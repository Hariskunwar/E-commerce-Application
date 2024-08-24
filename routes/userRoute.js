const express=require("express");
const { signup, login, getAllUser, getSingleUser } = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

const router=express.Router();

router.post('/signup',signup);
router.post("/login",login);
router.get("/",protect,getAllUser);
router.get("/:id",protect,getSingleUser);


module.exports=router;