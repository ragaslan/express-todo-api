const CustomError = require("../../helpers/errors/CustomError");
const jwt = require("jsonwebtoken");
const Todo = require("../../models/Todo");
const { isTokenIncluded,getAccessTokenFromHeader } = require("../../helpers/authorization/tokenHelper");
const asyncHandler = require("express-async-handler");
const getAccessToRouter = (req,res,next) => {
    
    const {JWT_SECRET_KEY} = process.env;
    
    if(!isTokenIncluded(req)){
        return next(new CustomError("Token bilgisi yok !",401));
    }
    const accessToken = getAccessTokenFromHeader(req);

    jwt.verify(accessToken,JWT_SECRET_KEY,(err,decoded) => {
        if(err){
            return next(new CustomError("Bu dizine erisiminiz yok !"));
        }
        req.user = {
            id : decoded.id,
            username : decoded.username,
            email : decoded.email
        };
        next();
    });
};

const ownerControl = asyncHandler(async(req,res,next) => {
    const todoId = req.params.id;
    const todo = await Todo.findById(todoId);
    if(!todo){
        return next(new CustomError("todo bulunamadı !",400));
    } 
    if(todo.owner != req.user.id){
        return next(new CustomError("bu todo'ya yetkiniz yok !",400));
    }
    return next();
});

module.exports = {
    getAccessToRouter,
    ownerControl
};