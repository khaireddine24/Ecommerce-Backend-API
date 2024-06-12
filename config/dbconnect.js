const {default:mongoose} = require("mongoose");
const dbconnect=()=>{
    try{
        const con=mongoose.connect(process.env.MONGODB_URL);
        console.log("database connected succssefully");
    }catch(err){
        console.log(err);
    }
}
module.exports=dbconnect;