const express = require("express");
const dbconnect = require("./config/dbconnect");
const app=express();
const dotenv=require("dotenv").config();
const morgan=require('morgan');

const PORT=process.env.PORT || 4000;
const authrouter=require("./routes/authRoute");
const Productrouter=require("./routes/productRoute");
const Blogrouter=require("./routes/blogRoute");
const Categrouter=require("./routes/categoryRoute");
const BlogCategrouter=require("./routes/blogCategRoute");
const Brandrouter=require("./routes/brandRoute");
const ColorRouter=require("./routes/colorRoute");
const ConnectRouter=require("./routes/connectRoute");
const CouponRouter=require("./routes/couponRoute");
const UploadRouter=require("./routes/uploadRoute");

const cookieParser=require("cookie-parser");
const bodyParser = require("body-parser");
const { notFound, errorHandler } = require("./middleware/errorHandler");
dbconnect();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended:false}));
app.use('/api/user',authrouter);
app.use('/api/product',Productrouter);
app.use('/api/blog',Blogrouter);
app.use('/api/category',Categrouter);
app.use('/api/blogcategory',BlogCategrouter);
app.use('/api/brandCateg',Brandrouter);
app.use('/api/color',ColorRouter);
app.use('/api/connect',ConnectRouter);
app.use('/api/coupon',CouponRouter);
app.use("/api/upload", UploadRouter);

app.use(notFound);
app.use(errorHandler);
app.listen(PORT, ()=>{
    console.log(`app running in PORT ${PORT}`);
});