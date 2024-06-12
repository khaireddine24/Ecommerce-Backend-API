const express=require("express");
const { createUser, loginUserCtrl,getallUser,getaUser,deleteaUser, updateUser, blockUser, unblockUser,logout, handleRefreshToken,UpdatePassword, forgotPassword, resetPassword, loginAdmin, getWishList, saveAddress, userCart, getUserCart, EmptyCart, applyCoupon, getOrders, getAllOrders, getOrderByUserId, updateOrderStatus } = require("../controller/userCtrl");
const router=express.Router();
const {authMiddleware,isAdmin}=require("../middleware/authMiddleware");

//post Part
router.post("/register",createUser);
router.post("/login",loginUserCtrl);
router.post("/logout",logout);
router.post("/forgot-password",forgotPassword);
router.post("/login-admin",loginAdmin);
router.post("/userCart/applyCoupon",authMiddleware,applyCoupon);
router.post("/userCart",authMiddleware,userCart);
router.post("/getorderbyuser/:id", authMiddleware, isAdmin, getOrderByUserId);
//get Part
router.get("/users",getallUser);
router.get("/:id",authMiddleware,getaUser);
router.get("/wishList",authMiddleware,getWishList);
router.get("/get-orders", authMiddleware, getOrders);
router.get("/getallorders", authMiddleware, isAdmin, getAllOrders);
router.get("/userCart",authMiddleware,getUserCart);
//delete Part
router.delete("/:id",deleteaUser);
router.delete("/EmptyCart",authMiddleware,EmptyCart);
//update Part
router.put("/SaveAddress",authMiddleware,saveAddress);
router.put("/reset-password/:token",resetPassword);
router.put("/order/update-order/:id",authMiddleware,isAdmin,updateOrderStatus);
router.put("/:id",authMiddleware,updateUser);
router.put("/password",authMiddleware,UpdatePassword);
router.put("/block-user/:id",authMiddleware,isAdmin,blockUser);
router.put("/unblock-user/:id",authMiddleware,isAdmin,unblockUser);
router.put("/refresh",handleRefreshToken);

module.exports=router;