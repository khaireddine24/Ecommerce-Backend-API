const express=require("express");
const { createCateg, updateCateg, deleteCateg, getCateg, getAllCateg } = require("../controller/blogCategCtrl");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");
const router=express.Router();

router.post("/",authMiddleware,isAdmin,createCateg);
router.put("/:id",authMiddleware,isAdmin,updateCateg);
router.delete("/:id",authMiddleware,isAdmin,deleteCateg);
router.get("/",getAllCateg);
router.get("/:id",getCateg);
module.exports=router;