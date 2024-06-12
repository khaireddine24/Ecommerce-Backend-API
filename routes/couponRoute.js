const express=require("express");
const {createCoupon,getAllCoupons, updateCoupons, deleteCoupon}=require("../controller/couponCtrl");
const {authMiddleware,isAdmin}=require("../middleware/authMiddleware");
const router=express.Router();

router.post("/",authMiddleware,isAdmin,createCoupon);
router.get("/",authMiddleware,isAdmin,getAllCoupons);
router.put("/:id",authMiddleware,isAdmin,updateCoupons);
router.delete("/:id",authMiddleware,isAdmin,deleteCoupon);

module.exports=router;