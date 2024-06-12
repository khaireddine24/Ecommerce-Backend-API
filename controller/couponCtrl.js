const Coupon=require("../models/couponModel");
const validateMongoDbId=require("../utils/validateId");
const asyncHandler=require("express-async-handler");

const createCoupon=asyncHandler(async(req,res)=>{
    try{
        const newCoupon=await Coupon.create(req.body);
        res.json(newCoupon);
    }catch(err){
        throw new Error(err);
    }
})

const getAllCoupons=asyncHandler(async(req,res)=>{
    try{
        const Coupons=await Coupon.find();
        res.json(Coupons);
    }catch(err){
        throw new Error(err);
    }
})

const deleteCoupon=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    validateMongoDbId(id);
    try{
        const Deletecoupon=await Coupon.findByIdAndDelete(id);
        res.json(Deletecoupon);
    }catch(err){
        throw new Error(err);
    }
})

const updateCoupons=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    validateMongoDbId(id);
    try{
        const Updatecoupon=await Coupon.findByIdAndUpdate(id,req.body,{new:true});
        res.json(Updatecoupon);
    }catch(err){
        throw new Error(err);
    }
})


module.exports={createCoupon,getAllCoupons,deleteCoupon,updateCoupons}