const express=require("express");
const { signup, login, getAllUser, getSingleUser, getCurrentUser, updatePassword, forgotPassword, resetPassword, updateMe, uploadProfilePhoto, addRemoveToWishlist, getWishlist } = require("../controllers/userController");
const { protect, restrict } = require("../middlewares/authMiddleware");
const upload=require('../middlewares/multer');
const router=express.Router();

router.get("/wishlist",protect,getWishlist);
router.post('/signup',signup);
router.post("/login",login);
router.get("/",protect,restrict('admin'),getAllUser);
router.get("/current-user",protect,getCurrentUser);
router.get("/:id",protect,restrict('admin'),getSingleUser);
router.put("/update-password",protect,updatePassword);
router.post("/forgot-password",forgotPassword);
router.put("/reset-password/:resetToken",resetPassword);
router.put("/update-profile",protect,updateMe)
router.put("/upload-profile",protect,upload.single("profile"),uploadProfilePhoto)
router.put("/add-wishlist",protect,addRemoveToWishlist);


module.exports=router;