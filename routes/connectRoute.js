const express=require("express");
const { createConnect, updateConnect, deleteConnect, getConnect, getAllConnect } = require("../controller/connectCtrl");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");
const router=express.Router();

router.post("/",createConnect);
router.put("/:id",authMiddleware,isAdmin,updateConnect);
router.delete("/:id",authMiddleware,isAdmin,deleteConnect);
router.get("/",getAllConnect);
router.get("/:id",getConnect);
module.exports=router;