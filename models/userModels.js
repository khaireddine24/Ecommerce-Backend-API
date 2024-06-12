const mongoose = require('mongoose');
const crypto=require('crypto');
const bcrypt=require('bcrypt');

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        default:"user"
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    cart:{
        type:Array,
        default:[]
    },
    adress:[{
        type:String
    }],
    wishList:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product"
    }],
    refreshToken:{
        type:String
    },
    PasswordChangeAt:Date,
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }

},{timestamps: true});

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    }
    const salt=await bcrypt.genSaltSync(10);
    this.password=await bcrypt.hash(this.password,salt);
});

userSchema.methods.isPasswordMatched=async function(entred){
    return await bcrypt.compare(entred,this.password);
} 
userSchema.methods.createPasswordToken = function() {
    const token = crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken = token;
    this.resetPasswordExpires = Date.now() + 600000; // 10 minutes
    return token;
};

//Export the model
module.exports = mongoose.model('User', userSchema);