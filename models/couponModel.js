const mongoose = require('mongoose');

var CouponSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        uppercase:true,
    },
    expiry:{
        type:Date,
        required:true,
    },
    discount:{
        type:Number,
        required:true,
        unique:true,
    },
});

module.exports = mongoose.model('Coupon', CouponSchema);