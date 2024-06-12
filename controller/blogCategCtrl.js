const BlogCateg=require("../models/blogCategModel.js");
const asyncHandler=require("express-async-handler");
const validateMongoDbId=require("../utils/validateId.js");

const createCateg=asyncHandler(async(req,res)=>{
    try{
        const newCateg=await BlogCateg.create(req.body);
        res.json(newCateg); 
    }catch(err){
        throw new Error(err);
    }
})

const updateCateg=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    validateMongoDbId(id);
    try{
        const updateCateg=await BlogCateg.findByIdAndUpdate(id,req.body,{
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
        const deleteCateg=await BlogCateg.findByIdAndDelete(id);
        res.json(deleteCateg);
    }catch(err){
        throw new Error(err);
    }
})

const getAllCateg=asyncHandler(async(req,res)=>{
    try{   
        const getCat=await BlogCateg.find();
        res.json(getCat);
    }catch(err){
        throw new Error(err);
    }
})


const getCateg=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    validateMongoDbId(id);
    try{   
        const getaCateg=await BlogCateg.findById(id);
        res.json(getaCateg);
    }catch(err){
        throw new Error(err);
    }
})

module.exports={createCateg,updateCateg,deleteCateg,getAllCateg,getCateg}