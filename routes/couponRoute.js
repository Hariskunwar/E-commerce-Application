const express=require("express");
const { protect, restrict } = require("../middlewares/authMiddleware");
const { createCoupon, getCoupon, getCoupons, updateCoupon, deleteCoupon } = require("../controllers/couponController");

const router=express.Router();

router.post("/",protect,restrict("admin"),createCoupon);
router.get("/",protect,getCoupons);
router.get("/:id",protect,getCoupon);
router.put("/:id",protect,restrict("admin"),updateCoupon);
router.delete("/:id",protect,restrict("admin"),deleteCoupon);

module.exports=router;