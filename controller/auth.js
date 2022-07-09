const asyncHandler = require("express-async-handler");
const CustomError = require("../helpers/errors/CustomError");
const User = require("../models/User");
const {comparePassword,validateLoginInputs} = require("../helpers/input/validateInput");
const {sendJwtToClient} = require("../helpers/authorization/tokenHelper");
const register = asyncHandler(async(req,res,next) => {
    
    const {username,email,password} = req.body;
    
    let user = await User.create({
        username,
        email,
        password
    });

    res.status(200)
    .json({
        success : true,
        message : "Kullanici kaydi yapildi",
        data : user
    });

});

const login = asyncHandler(async(req,res,next) => {
    
    const {username,password} = req.body;
    
    if(!validateLoginInputs(username,password)){
        return next(new CustomError("lutfen giris bilgilerini eksiksiz doldurun ",400));
    }

    let user = await User.findOne({username}).select("+password");
    
    if(!user){
        return next(new CustomError("hatali kullanici adi girisi ",400));
    }
    
    if(!comparePassword(password,user.password)){
        return next(new CustomError("hatali sifre girisi ",400)); 
    }
    
    sendJwtToClient(user,res);
    
});
const showProfile = asyncHandler(async(req,res,next) => {
    
    const {username} = req.user;

    const user = await User.findOne({username});

    if(!user){
        return next(new CustomError("Kullanici Bulunamadi !",500));
    }

    res.status(200)
    .json({
        success : true,
        data : user
    });

});

const logout = asyncHandler(async(req,res,next) => {
    
    return res.status(200)
    .clearCookie("access_token")
    .json({
        success : true,
        message : "cikis islemi basarili !"
    });

});

const imageUpload = asyncHandler(async (req,res,next)=>{
    // Image Upload Success
    const user = await User.findByIdAndUpdate(req.user.id,{
        "profileImage" : req.savedProfileImage
    },{
        new : true,
        runValidators : true
    });
    res.status(200)
    .json({
        success : true,
        message : "image upload successfull",
        data : user
    })
});

module.exports = {
    register,
    login,
    showProfile,
    logout,
    imageUpload
}