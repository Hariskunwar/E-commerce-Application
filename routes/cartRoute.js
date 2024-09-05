const express=require("express");
const { protect } = require("../middlewares/authMiddleware");
const { addProductToCart, getCart, removeSpecificCartItem, updateCartItemQuantity, clearCart } = require("../controllers/cartController");

const router=express.Router();

router.use(protect);

router.post("/",addProductToCart);
router.get("/",getCart);
router.delete("/",clearCart);
router.delete("/:id",removeSpecificCartItem);
router.put('/:id',updateCartItemQuantity);



module.exports=router;