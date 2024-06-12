const Category=require("../models/categoryModel.js");
const asyncHandler=require("express-async-handler");
const validateMongoDbId=require("../utils/validateId.js");

const createCateg=asyncHandler(async(req,res)=>{
    try{
        const newCateg=await Category.create(req.body);
        res.json(newCateg); 
    }catch(err){
        throw new Error(err);
    }
})

const updateCateg=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    validateMongoDbId(id);
    try{
        const updateCateg=await Category.findByIdAndUpdate(id,req.body,{
            new:true,
        });
        res.json(updateCateg);
    }catch(err){
        throw new Error(err);
    }
})

const deleteCateg=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    validateMongoDbId(id);
    try{   
        const deleteCateg=await Category.findByIdAndDelete(id);
        res.json(deleteCateg);
    }catch(err){
        throw new Error(err);
    }
})

const getAllCateg=asyncHandler(async(req,res)=>{
    try{   
        const getCat=await Category.find();
        res.json(getCat);
    }catch(err){
        throw new Error(err);
    }
})


const getCateg=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    validateMongoDbId(id);
    try{   
        const getaCateg=await Category.findById(id);
        res.json(getaCateg);
    }catch(err){
        throw new Error(err);
    }
})

module.exports={createCateg,updateCateg,deleteCateg,getAllCateg,getCateg}