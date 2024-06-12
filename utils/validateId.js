const mongoose=require('mongoose');
const validateId=(id)=>{
    const isValid=mongoose.Types.ObjectId.isValid(id);
    if(!isValid) throw new Error("id is not valid");
}
module.exports=validateId;