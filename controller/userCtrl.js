const { generateToken } = require("../config/jwtToken");
const user=require("../models/userModels");
const product=require("../models/productModel");
const Coupon=require("../models/couponModel");
const Cart=require("../models/cartModel");
const Order=require("../models/orderModel");
const asyncHandler=require("express-async-handler");
const validateID=require('../utils/validateId');
const {generateRefreshToken}=require("../config/refreshToken")
const jwt=require("jsonwebtoken");
const sendEmail = require("./emailCtrl");
const crypto=require("crypto");

const createUser=asyncHandler(async (req,res)=>{
    const email=req.body.email;
    const finduser=await user.findOne({email:email});
    if (!finduser){
        const newUser=await user.create(req.body)
        res.json(newUser)
    }else{
        throw new Error("User already Exists");
    }

});

const loginUserCtrl=asyncHandler(async (req,res)=>{
    const {email,password}=req.body;
    const findUser=await user.findOne({email});
    if(findUser && await findUser.isPasswordMatched(password)){
        const refreshToken=await generateRefreshToken(findUser?.id);
        const updateUser=await user.findByIdAndUpdate(
            findUser.id,{
                refreshToken:refreshToken
            },
            {
                new:true
            }
        )
        res.cookie("refreshToken",refreshToken,{
            httpOnly:true,
            maxAge:70*60*60*1000
        })
        res.json({
            _id:findUser?._id,
            firstname:findUser?.firstname,
            lastname:findUser?.lastname,
            email:findUser?.email,
            mobile:findUser?.mobile,
            password:findUser?.password,
            token:generateToken(findUser?._id),
        });
    }
    else{
        throw new Error("Invalid Credentials");
    }
})

const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const findAdmin = await user.findOne({ email });
    if (!findAdmin) {
        throw new Error("User not found");
    }
    if (findAdmin.role !== "admin") {
        throw new Error("Not Authorized");
    }
    if (findAdmin && await findAdmin.isPasswordMatched(password)) {
        const refreshToken = await generateRefreshToken(findAdmin._id);
        await user.findByIdAndUpdate(
            findAdmin.id, {
                refreshToken: refreshToken
            },{new: true}
        );

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 70 * 60 * 60 * 1000
        });

        res.json({
            _id: findAdmin._id,
            firstname: findAdmin.firstname,
            lastname: findAdmin.lastname,
            email: findAdmin.email,
            mobile: findAdmin.mobile,
            token: generateToken(findAdmin._id),
        });
    } else {
        throw new Error("Invalid Credentials");
    }
});


const getallUser = asyncHandler(async (req, res, next) => {
    const getUsers = await user.find();
    res.json(getUsers);
});

const getaUser = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateID(id);
    try {
        const Users = await user.findById(id);
        res.json({ Users });
    } catch (error) {
        throw new Error(error);
    }
});
const deleteaUser = asyncHandler(async (req, res) => {
    const {id} = req.params;
    try {
        const deleteUser = await user.findByIdAndDelete(id);
        res.json({ deleteUser });
    } catch (error) {
        throw new Error(error);
    }
});

const updateUser=asyncHandler(async(req,res)=>{
    const {_id}=req.user;
    validateID(_id);
    try{
        const updateUser=await user.findByIdAndUpdate(
            _id,
            {
                firstname:req?.body?.firstname,
                lastname:req?.body?.lastname,
                email:req?.body?.email,
                mobile:req?.body?.mobile
            },
            {new:true}  
        );
        res.json({updateUser});
    }catch(error){
        throw new Error(error);
    }
})

const blockUser=asyncHandler(async(req,res)=>{
    const {id}=req.params
    validateID(id);
    try{
        const block=await user.findByIdAndUpdate(id,
            {
                isBlocked:true
            },
            {
                new:true
            }
        )
        res.json({message:"user blocked succesfully"});
    }catch(error){
        throw new Error(error);
    }
})

const unblockUser=asyncHandler(async(req,res)=>{
    const {id}=req.params
    validateID(id);
    try{
        const unblock=await user.findByIdAndUpdate(id,
            {
                isBlocked:false
            },
            {
                new:true
            }
        )
        res.json({message:"user unblocked succesfully"});
    }catch(error){
        throw new Error(error);
    }
})

const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) {
        throw new Error("No refresh token in cookies");
    }
    const refreshToken = cookie.refreshToken;
    const userDoc = await user.findOne({ refreshToken });
    if (!userDoc) {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
        });
        return res.sendStatus(204);
    }
    await user.findOneAndUpdate({ refreshToken }, { refreshToken: "" });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
    });
    res.sendStatus(204); 
});

const handleRefreshToken=asyncHandler(async(req,res)=>{
    const cookie=req.cookies;
    if(!cookie?.refreshToken){
        throw new Error("no refresh token in cookies");
    }
    const refreshToken=cookie.refreshToken;
    const User=await user.findOne({refreshToken});
    if(!User) throw new Error("no refresh token present in database")
    jwt.verify(refreshToken,process.env.JWT_SECRET,(err,decoded)=>{
        if(err || User.id !== decoded.id){throw new Error("there is something wrong with refresh token");}
        const accessToken=generateToken(User.id);
        res.json({accessToken});
    })
    res.json(User);  
})

const UpdatePassword = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { password } = req.body;
    console.log(password);
    try {
        const User = await user.findById(_id);
        if (User) {
            User.password = password;
            const updatedUser = await User.save();
            res.json(updatedUser); 
        } else {
            throw new Error("User not found");
        }
    } catch (error) {
        throw new Error(error);
    }
});

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const User = await user.findOne({ email });
    if (!User) {
        return res.status(404).json({ message: "User not found with this email" });
    }

    try {
        const token = User.createPasswordToken();
        await User.save();
        const resetUrl = `http://localhost:5000/api/user/reset-password/${token}`;

        const data = {
            to: email,
            subject: "Forgot Password Link",
            text: `Hi,\nFollow this link to reset your password. This link is valid for 10 minutes:\n${resetUrl}`,
            html: `<p>Hi,</p><p>Follow <a href="${resetUrl}">this link</a> to reset your password.
            This link is valid for 10 minutes.</p>`
        };

        await sendEmail(data);
        res.json({ token });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: "Error sending email" });
    }
});

const getWishList = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    try {
      const findUser = await user.findById(_id).populate("wishList");
      res.json(findUser);
    } catch (error) {
      throw new Error(error);
    }
    console.log(_id);
  });

const saveAddress = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateID(_id);
    try {
        const updatedUser = await user.findByIdAndUpdate(
            _id,
            {
                adress: req.body.adress,
            },
            { new: true }
        );
        res.json(updatedUser);
    } catch (err) {
        throw new Error(err);
    }
});

const userCart = asyncHandler(async (req, res) => {
    const { cart } = req.body;
    const { _id } = req.user;
    validateID(_id);

    try {
        const userDoc = await user.findById(_id);
        const existingCart = await Cart.findOne({ orderby: userDoc._id });
        if (existingCart) {
            await Cart.deleteOne({ _id: existingCart._id });
        }

        const products = await Promise.all(cart.map(async (item) => {
            const productDoc = await product.findById(item._id).select("price").exec();
            if (!productDoc) {
                throw new Error(`Product with ID ${item._id} not found`);
            }
            return {
                product: item._id,
                count: item.count,
                color: item.color,
                price: productDoc.price
            };
        }));

        const cartTotal = products.reduce((total, item) => total + item.price * item.count, 0);

        const newCart = await new Cart({
            products,
            cartTotal,
            orderby: userDoc._id
        }).save();

        res.json(newCart);
    } catch (error) {
        console.error("Error creating user cart:", error);
        res.status(500).json({ message: error.message });
    }
});

const applyCoupon = asyncHandler(async (req, res) => {
    const { coupon } = req.body;
    const { _id } = req.user;
    validateID(_id);
    const validCoupon = await Coupon.findOne({ name: coupon });
    if (validCoupon === null) {
      throw new Error("Invalid Coupon");
    }
    const UserAuth = await user.findOne({ _id });
    let { cartTotal } = await Cart.findOne({
      orderby: UserAuth._id,
    }).populate("products.product");
    let totalAfterDiscount = (
      cartTotal -
      (cartTotal * validCoupon.discount) / 100
    ).toFixed(2);
    await Cart.findOneAndUpdate(
      { orderby: UserAuth._id },
      { totalAfterDiscount },
      { new: true }
    );
    res.json(totalAfterDiscount);
  });

const createOrder = asyncHandler(async (req, res) => {
    const { COD, couponApplied } = req.body;
    const { _id } = req.user;
    validateID(_id);
    try {
      if (!COD) throw new Error("Create cash order failed");
      const userAuth = await user.findById(_id);
      let userCart = await Cart.findOne({ orderby: userAuth._id });
      let finalAmout = 0;
      if (couponApplied && userCart.totalAfterDiscount) {
        finalAmout = userCart.totalAfterDiscount;
      } else {
        finalAmout = userCart.cartTotal;
      }
  
      let newOrder = await new Order({
        products: userCart.products,
        paymentIntent: {
          id: uniqid(),
          method: "COD",
          amount: finalAmout,
          status: "Cash on Delivery",
          created: Date.now(),
          currency: "dnt",
        },
        orderby: userAuth._id,
        orderStatus: "Cash on Delivery",
      }).save();
      let update = userCart.products.map((item) => {
        return {
          updateOne: {
            filter: { _id: item.product._id },
            update: { $inc: { quantity: -item.count, sold: +item.count } },
          },
        };
      });
      const updated = await product.bulkWrite(update, {});
      res.json({ message: "success" });
    } catch (error) {
      throw new Error(error);
    }
  });

  const getOrders = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateID(_id);
    try {
      const userorders = await Order.findOne({ orderby: _id })
        .populate("products.product")
        .populate("orderby")
        .exec();
      res.json(userorders);
    } catch (error) {
      throw new Error(error);
    }
  });

  const getAllOrders = asyncHandler(async (req, res) => {
    try {
      const alluserorders = await Order.find()
        .populate("products.product")
        .populate("orderby")
        .exec();
      res.json(alluserorders);
    } catch (error) {
      throw new Error(error);
    }
  });

  const getOrderByUserId = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      const userorders = await Order.findOne({ orderby: id })
        .populate("products.product")
        .populate("orderby")
        .exec();
      res.json(userorders);
    } catch (error) {
      throw new Error(error);
    }
  });

  
  const updateOrderStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      const updateOrderStatus = await Order.findByIdAndUpdate(
        id,
        {
          orderStatus: status,
          paymentIntent: {
            status: status,
          },
        },
        { new: true }
      );
      res.json(updateOrderStatus);
    } catch (error) {
      throw new Error(error);
    }
  });

const getUserCart=asyncHandler(async(req,res)=>{
    const { _id } = req.user;
    try{
        const cart=await Cart.findOne({orderby:_id}).populate("products.product");
        res.json(cart);
    }catch(err){
        throw new Error(err);
    }
});

const EmptyCart=asyncHandler(async(req,res)=>{
    const { _id } = req.user;
    validateID(_id);
    try{
        const User=await user.findOne({_id});
        const cart=await Cart.findOneAndRemove({orderby:User._id});
        res.json(cart);
    }catch(err){
        throw new Error(err);
    }
})

  
  

const resetPassword=asyncHandler(async(req,res)=>{
    const {password}=req.body;
    const {token}=req.params;
    const hashToken=crypto.createHash('sha256').update(token).digest("hex");
    const User=await user.findOne({
        resetPasswordToken:hashToken,
        resetPasswordExpires:{$gt:Date.now()}
    })
    if(!User) throw new Error("Token Expired,please try again");
    User.password=password;
    User.resetPasswordToken=undefined;
    User.resetPasswordExpires=undefined;
    await User.save();
    res.json(User);
})

module.exports={createUser,loginUserCtrl,getallUser,getaUser,deleteaUser,
updateUser,blockUser,unblockUser,logout,handleRefreshToken,UpdatePassword,forgotPassword,resetPassword,
getWishList,loginAdmin,saveAddress,userCart,getUserCart,EmptyCart,applyCoupon,createOrder,getOrders,getAllOrders,getOrderByUserId,updateOrderStatus}