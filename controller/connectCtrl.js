const Connect=require("../models/connectModel.js");
const asyncHandler=require("express-async-handler");
const validateMongoDbId=require("../utils/validateId.js");

const createConnect=asyncHandler(async(req,res)=>{
    try{
        const newConnect=await Connect.create(req.body);
        res.json(newConnect); 
    }catch(err){
        throw new Error(err);
    }
})

const updateConnect=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    validateMongoDbId(id);
    try{
        const updateConnect=await Connect.findByIdAndUpdate(id,req.body,{
            new:true,
        });
        res.json(updateConnect);
    }catch(err){
        throw new Error(err);
    }
})

const deleteConnect=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    validateMongoDbId(id);
    try{   
        const deleteConnect=await Connect.findByIdAndDelete(id);
        res.json(deleteConnect);
    }catch(err){
        throw new Error(err);
    }
})

const getAllConnect=asyncHandler(async(req,res)=>{
    try{   
        const getConnect=await Connect.find();
        res.json(getConnect);
    }catch(err){
        throw new Error(err);
    }
})


const getConnect=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    validateMongoDbId(id);
    try{   
        const getaConnect=await Connect.findById(id);
        res.json(getaConnect);
    }catch(err){
        throw new Error(err);
    }
})

module.exports={createConnect,updateConnect,deleteConnect,getAllConnect,getConnect}