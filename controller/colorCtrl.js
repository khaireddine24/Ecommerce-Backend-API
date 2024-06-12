const Color=require("../models/colorModel.js");
const asyncHandler=require("express-async-handler");
const validateMongoDbId=require("../utils/validateId.js");

const createColor=asyncHandler(async(req,res)=>{
    try{
        const newColor=await Color.create(req.body);
        res.json(newColor); 
    }catch(err){
        throw new Error(err);
    }
})

const updateColor=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    validateMongoDbId(id);
    try{
        const updateColor=await Color.findByIdAndUpdate(id,req.body,{
            new:true,
        });
        res.json(updateColor);
    }catch(err){
        throw new Error(err);
    }
})

const deleteColor=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    validateMongoDbId(id);
    try{   
        const deleteColor=await Color.findByIdAndDelete(id);
        res.json(deleteColor);
    }catch(err){
        throw new Error(err);
    }
})

const getAllColor=asyncHandler(async(req,res)=>{
    try{   
        const getColor=await Color.find();
        res.json(getColor);
    }catch(err){
        throw new Error(err);
    }
})


const getColor=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    validateMongoDbId(id);
    try{   
        const getaColor=await Color.findById(id);
        res.json(getaColor);
    }catch(err){
        throw new Error(err);
    }
})

module.exports={createColor,updateColor,deleteColor,getAllColor,getColor}