const Brand=require("../models/brandModel.js");
const asyncHandler=require("express-async-handler");
const validateMongoDbId=require("../utils/validateId.js");

const createBrand=asyncHandler(async(req,res)=>{
    try{
        const newBrand=await Brand.create(req.body);
        res.json(newBrand); 
    }catch(err){
        throw new Error(err);
    }
})

const updateBrand=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    validateMongoDbId(id);
    try{
        const updateBrand=await Brand.findByIdAndUpdate(id,req.body,{
            new:true,
        });
        res.json(updateBrand);
    }catch(err){
        throw new Error(err);
    }
})

const deleteBrand=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    validateMongoDbId(id);
    try{   
        const deleteBrand=await Brand.findByIdAndDelete(id);
        res.json(deleteBrand);
    }catch(err){
        throw new Error(err);
    }
})

const getAllBrand=asyncHandler(async(req,res)=>{
    try{   
        const getBrand=await Brand.find();
        res.json(getBrand);
    }catch(err){
        throw new Error(err);
    }
})


const getBrand=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    validateMongoDbId(id);
    try{   
        const getaBrand=await Brand.findById(id);
        res.json(getaBrand);
    }catch(err){
        throw new Error(err);
    }
})

module.exports={createBrand,updateBrand,deleteBrand,getAllBrand,getBrand}