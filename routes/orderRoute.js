const express=require("express");
const { protect, restrict } = require("../middlewares/authMiddleware");
const { createCashOrder, getOrders, getOrder, updateOrderToPaid, updateOrderToDelivered } = require("../controllers/orderController");

const router=express.Router();

router.post("/",protect,createCashOrder);
router.get("/",protect,getOrders);
router.get("/:id",protect,getOrder);
router.put("/paid/:id",protect,restrict("admin"),updateOrderToPaid);
router.put("/delivered/:id",protect,restrict("admin"),updateOrderToDelivered);

module.exports=router;
