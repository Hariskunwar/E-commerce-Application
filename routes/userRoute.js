const express=require("express");
const { signup, login, getAllUser, getSingleUser } = require("../controllers/userController");

const router=express.Router();

router.post('/signup',signup);
router.post("/login",login);
router.get("/",getAllUser);
router.get("/:id",getSingleUser);


module.exports=router;